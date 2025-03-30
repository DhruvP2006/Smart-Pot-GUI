const SensorData = require('../models/SensorData');

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
