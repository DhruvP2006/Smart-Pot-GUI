const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  moistureAnalog: Number,
  moistureDigital: String,
  luminance: Number,
  flowRate: Number,
  totalFlow: Number,
  timestamp: { type: Date, default: Date.now },
});

const SensorData = mongoose.model('Sensors', sensorSchema, 'Sensors');
module.exports = SensorData;
