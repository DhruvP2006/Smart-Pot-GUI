const axios = require('axios');
require('dotenv').config();

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

function formatSensorValue(value, unit = '') {
  // Handle undefined/null/empty strings, but allow 0 as valid
  return value === undefined ||
    value === null ||
    value === '' ||
    value === 'undefined'
    ? 'N/A'
    : `${value}${unit}`;
}

async function sendMessageToGemini(userId, message) {
  try {
    const sensorRes = await axios.get(
      process.env.BACKEND_URL
        ? `${process.env.BACKEND_URL}/api/data`
        : 'https://smart-pot-l9l9.onrender.com/api/data'
    );

    // Normalize data: handle both array and object responses
    const latest = Array.isArray(sensorRes.data)
      ? sensorRes.data[0]
      : sensorRes.data;

    // Debug log to verify raw data
    console.log('Raw API Response:', JSON.stringify(latest, null, 2));

    // Validate critical sensors
    const criticalSensorsMissing = [
      'temperature',
      'humidity',
      'moistureAnalog',
    ].some(
      (key) =>
        latest[key] === undefined || latest[key] === null || latest[key] === ''
    );

    const prompt = `
📊 **Sensor Data** (Raw: ${JSON.stringify(latest)}):
- 🌡️ Temperature: ${formatSensorValue(latest.temperature, '°C')}
- 💧 Humidity: ${formatSensorValue(latest.humidity, '%')}
- 🌿 Soil Moisture: ${formatSensorValue(
      latest.moistureAnalog,
      '%'
    )} (Status: ${formatSensorValue(latest.moistureDigital)})
- 💡 Light: ${formatSensorValue(latest.luminance, ' lux')}
- 🚰 Water Flow: ${formatSensorValue(latest.flowRate, ' mL/min')}

🔍 **User Query**: "${message}"

**Instructions for Gemini**:
1. If any critical sensor (temperature/humidity/moisture) shows "N/A", FIRST explain how to troubleshoot it.
2. For valid data:
   - Soil moisture <10% → Urgent watering needed.
   - Temperature >30°C → Risk of heat stress.
   - Light <100 lux → Likely insufficient.
3. Prioritize actionable steps. Never guess—flag missing data clearly.
`;

    const geminiRes = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      }
    );

    return {
      response:
        geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No response from Gemini.',
    };
  } catch (error) {
    console.error('Full Error:', error);
    return {
      response:
        '⚠️ **System Error**: Check backend connection. Sensors may be offline.',
    };
  }
}

module.exports = { sendMessageToGemini };
