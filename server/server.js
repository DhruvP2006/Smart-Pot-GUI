const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const express = require('express');
const mongoose = require('./config/db');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'https://smartpot-eta.vercel.app', // your frontend
  'https://smartpot-git-main-dhruv-pankhanias-projects.vercel.app',
  'https://smart-m62ouwvjh-dhruv-pankhanias-projects.vercel.app',
  'http://localhost:3000', // optional for local dev
];

// ✅ Create io instance and export it
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});
module.exports.io = io; // ✅ This is the fix: export io to use it in controller

// Middleware
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.text());

// Routes
app.use('/api/data', require('./routes/dataRoutes'));
app.use('/api/sensors', require('./routes/sensorRoutes'));
app.use('/', require('./routes/authRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/gemini', require('./routes/geminiRoutes'));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('🔗 Client connected');
  socket.on('disconnect', () => console.log('❌ Client disconnected'));
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
