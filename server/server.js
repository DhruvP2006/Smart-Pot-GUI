require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.text()); // Handle text/plain content

const DB = process.env.MONGO_URI.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

const sensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  moistureAnalog: Number,
  moistureDigital: String,
  luminance: Number,
  timestamp: { type: Date, default: Date.now },
});

const SensorData = mongoose.model('Sensors', sensorSchema, 'Sensors');

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

let lastSavedTime = 0;

app.post('/api/data', async (req, res) => {
  try {
    console.log('🔹 Incoming Raw Request Body:', req.body);
    let data;

    if (typeof req.body === 'string') {
      try {
        data = JSON.parse(req.body);
      } catch (err) {
        return res.status(400).json({ error: 'Invalid JSON format' });
      }
    } else {
      data = req.body;
    }

    console.log('✅ Parsed Data:', data);

    const {
      temperature,
      humidity,
      moistureAnalog,
      moistureDigital,
      luminance,
    } = data;

    if (
      temperature === undefined ||
      humidity === undefined ||
      moistureAnalog === undefined ||
      moistureDigital === undefined ||
      luminance === undefined
    ) {
      console.error('❌ Missing required fields:', data);
      return res.status(400).json({ error: 'Missing required sensor data' });
    }

    const formattedMoistureDigital = moistureDigital === 1 ? 'Wet' : 'Dry';

    // 🔹 Emit real-time data
    io.emit('sensorData', {
      temperature,
      humidity,
      moistureAnalog,
      moistureDigital: formattedMoistureDigital,
      luminance,
    });

    const currentTime = Date.now();

    // 🔹 Always update the latest data (overwrite previous)
    await SensorData.findOneAndUpdate(
      {}, // Find any document
      {
        temperature,
        humidity,
        moistureAnalog,
        moistureDigital: formattedMoistureDigital,
        luminance,
        timestamp: new Date(),
      },
      { upsert: true, new: true }
    );

    console.log('✅ Latest data updated');

    // 🔹 Save only every 15 minutes for graph
    if (currentTime - lastSavedTime >= 15 * 60 * 1000) {
      await SensorData.create({
        temperature,
        humidity,
        moistureAnalog,
        moistureDigital: formattedMoistureDigital,
        luminance,
      });
      lastSavedTime = currentTime;
      console.log('✅ Data saved for graph');
    }

    res.status(201).json({ message: 'Data processed!' });
  } catch (err) {
    console.error('❌ Server Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/data', async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(1);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/graph-data', async (req, res) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const data = await SensorData.find({ timestamp: { $gte: last24Hours } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
