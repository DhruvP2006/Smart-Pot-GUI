const SensorData = require('../models/sensorData');
const Threshold = require('../models/threshold');
const { io } = require('../server');

let lastSavedTime = 0;
let cachedThreshold = null; // Loaded from DB on first access

// 🔹 Get threshold from DB or fallback
const getThresholdFromDB = async () => {
  if (cachedThreshold !== null) return cachedThreshold;

  let thresholdDoc = await Threshold.findOne();
  if (!thresholdDoc) {
    thresholdDoc = await Threshold.create({ moistureThreshold: 50 });
  }

  cachedThreshold = thresholdDoc.moistureThreshold;
  return cachedThreshold;
};

// 🔹 Post Sensor Data
exports.postSensorData = async (req, res) => {
  try {
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

    const {
      temperature,
      humidity,
      moistureAnalog,
      moistureDigital,
      luminance,
      flowRate,
    } = data;

    if (
      temperature === undefined ||
      humidity === undefined ||
      humidity < 0 ||
      humidity > 100 ||
      moistureAnalog < 0 ||
      moistureAnalog > 100 ||
      moistureAnalog === undefined ||
      moistureDigital === undefined ||
      luminance === undefined ||
      flowRate === undefined
    ) {
      return res.status(400).json({ error: 'Missing required sensor data' });
    }

    const formattedMoistureDigital = moistureDigital === 1 ? 'Wet' : 'Dry';

    // 🔹 Calculate total flow for 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const pastData = await SensorData.find(
      { timestamp: { $gte: last24Hours } },
      'flowRate timestamp'
    );

    let totalFlow = 0;
    if (pastData.length > 1) {
      for (let i = 1; i < pastData.length; i++) {
        const duration =
          (pastData[i].timestamp - pastData[i - 1].timestamp) / (1000 * 60);
        totalFlow += (pastData[i - 1].flowRate || 0) * duration;
      }
    }
    totalFlow = Math.max(0, parseFloat(totalFlow.toFixed(1)));

    const currentTime = Date.now();

    // 🔹 Emit live sensor data
    io.emit('sensorData', {
      temperature,
      humidity,
      moistureAnalog,
      moistureDigital: formattedMoistureDigital,
      luminance,
      flowRate,
      totalFlow,
    });

    // 🔹 Emit threshold too (ESP32 or UI might listen)
    const thresholdValue = await getThresholdFromDB();
    io.emit('thresholdUpdate', { moistureThreshold: thresholdValue });

    // 🔹 Update current record
    await SensorData.findOneAndUpdate(
      {},
      {
        temperature,
        humidity,
        moistureAnalog,
        moistureDigital: formattedMoistureDigital,
        luminance,
        flowRate,
        totalFlow,
        timestamp: new Date(),
      },
      { upsert: true, new: true }
    );

    // 🔹 Save for graph (every 15 mins)
    if (currentTime - lastSavedTime >= 1 * 30 * 1000) {
      await SensorData.create({
        temperature,
        humidity,
        moistureAnalog,
        moistureDigital: formattedMoistureDigital,
        luminance,
        flowRate,
        totalFlow,
      });
      lastSavedTime = currentTime;
    }

    res.status(201).json({ message: '✅ Data processed successfully!' });
  } catch (err) {
    console.error('❌ Server Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// 🔹 Get Moisture Threshold
exports.getThreshold = async (req, res) => {
  try {
    const threshold = await getThresholdFromDB();
    res.json({ moistureThreshold: threshold });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching threshold' });
  }
};

// 🔹 Save Moisture Threshold
exports.saveThreshold = async (req, res) => {
  try {
    const { moistureThreshold: newThreshold } = req.body;

    if (newThreshold === undefined) {
      return res.status(400).json({ error: 'No threshold provided' });
    }

    let thresholdDoc = await Threshold.findOne();
    if (thresholdDoc) {
      thresholdDoc.moistureThreshold = newThreshold;
      await thresholdDoc.save();
    } else {
      await Threshold.create({ moistureThreshold: newThreshold });
    }

    cachedThreshold = newThreshold;

    // Broadcast new threshold
    io.emit('thresholdUpdate', { moistureThreshold: newThreshold });

    res.json({ message: 'Threshold updated', moistureThreshold: newThreshold });
  } catch (err) {
    console.error('Error updating threshold:', err);
    res.status(500).json({ error: 'Error updating threshold' });
  }
};
