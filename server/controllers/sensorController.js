const SensorData = require('../models/SensorData');
const { io } = require('../server'); // Importing Socket

let lastSavedTime = 0;

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
      moistureAnalog === undefined ||
      moistureDigital === undefined ||
      luminance === undefined ||
      flowRate === undefined
    ) {
      return res.status(400).json({ error: 'Missing required sensor data' });
    }

    const formattedMoistureDigital = moistureDigital === 1 ? 'Wet' : 'Dry';

    // 🔹 Calculate total water consumption for last 24 hours
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

    // 🔹 Emit real-time data
    io.emit('sensorData', {
      temperature,
      humidity,
      moistureAnalog,
      moistureDigital: formattedMoistureDigital,
      luminance,
      flowRate,
      totalFlow,
    });

    const currentTime = Date.now();

    // 🔹 Update latest data (overwrite previous)
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

    // 🔹 Save data every 15 minutes for graph
    if (currentTime - lastSavedTime >= 15 * 60 * 1000) {
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
