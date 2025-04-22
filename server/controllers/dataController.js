const SensorData = require('../models/sensorData');

// 🔹 POST New Sensor Data
exports.postSensorData = async (req, res) => {
  try {
    const newData = new SensorData(req.body);
    await newData.save();
    res.status(201).json({ message: 'Sensor data saved successfully' });
  } catch (err) {
    console.error('Error saving sensor data:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Get Latest Sensor Data
exports.getLatestData = async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(1);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Get Data for Last 24 Hours (Graph)
exports.getGraphData = async (req, res) => {
  try {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const data = await SensorData.find({ timestamp: { $gte: last24Hours } });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
