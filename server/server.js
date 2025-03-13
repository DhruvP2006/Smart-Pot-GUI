require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // Required for Socket.io
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, { cors: { origin: '*' } }); // Attach Socket.io

app.use(cors());
app.use(express.json()); // Parse JSON data

// MongoDB Connection
const DB = process.env.MONGO_URI.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// ✅ **Schema & Model**
const sensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  timestamp: { type: Date, default: Date.now },
});

const SensorData = mongoose.model('Sensors', sensorSchema, 'Sensors');

// ✅ **Socket.io Setup**
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

let lastSavedTime = 0; // Track last save time

// ✅ **POST - ESP32 sends data**
app.post('/api/data', async (req, res) => {
  try {
    const { temperature, humidity } = req.body;

    if (temperature === undefined || humidity === undefined) {
      return res.status(400).json({ error: 'Missing temperature or humidity' });
    }

    // 🔹 Emit real-time data to frontend
    io.emit('sensorData', { temperature, humidity });

    const currentTime = Date.now();

    // 🔹 Save only every 15 minutes
    if (currentTime - lastSavedTime >= 15 * 60 * 1000) {
      await SensorData.create({ temperature, humidity });
      lastSavedTime = currentTime;
    }

    res.status(201).json({ message: 'Data processed!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ **GET - Retrieve latest data**
app.get('/api/data', async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(1);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ **GET - Fetch Last 24 Hours Data for Graph**
app.get('/api/graph-data', async (req, res) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const data = await SensorData.find({ timestamp: { $gte: last24Hours } });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
