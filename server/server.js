const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Correct origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// ✅ Proper CORS configuration
app.use(
  cors({
    origin: 'http://localhost:3000', // Allow frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// ✅ JSON and text parsing (remove duplicate)
app.use(express.json());
app.use(express.text());

// ✅ Route handlers
app.use('/api/data', require('./routes/dataRoutes'));
app.use('/api/sensors', require('./routes/sensorRoutes'));
app.use('/', require('./routes/authRoutes'));

// ✅ Socket connection
io.on('connection', (socket) => {
  console.log('🔗 Client connected');
  socket.on('disconnect', () => console.log('❌ Client disconnected'));
});

// ✅ Server running
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
