const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
  temperature: Number,
  humidity: { type: Number, min: 0, max: 100 },
  moistureAnalog: { type: Number, min: 0, max: 100 },
  moistureDigital: String,
  luminance: { type: Number, min: 0, max: 100 },
  flowRate: Number,
  totalFlow: Number,
  timestamp: { type: Date, default: Date.now },
});

const SensorData = mongoose.model('Sensors', sensorSchema, 'Sensors');
module.exports = SensorData;
