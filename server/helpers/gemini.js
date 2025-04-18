const axios = require('axios');
require('dotenv').config();

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

// Helper function to properly handle missing/empty data
function formatSensorValue(value, unit = '') {
  return value === undefined || value === null || value === ''
    ? 'N/A'
    : `${value}${unit}`;
}

async function sendMessageToGemini(userId, message) {
  try {
    // Fetch latest Smart Pot sensor data
    const sensorRes = await axios.get(
      process.env.BACKEND_URL
        ? `${process.env.BACKEND_URL}/api/data`
        : 'https://smart-pot-l9l9.onrender.com/api/data'
    );

    // Ensure we have a proper data object
    const latest = Array.isArray(sensorRes.data)
      ? sensorRes.data[0]
      : typeof sensorRes.data === 'object'
      ? sensorRes.data
      : {};

    console.log('Latest Smart Pot Data:', latest);

    // Check if we got any usable data
    const hasData = Object.values(latest).some(
      (val) => val !== undefined && val !== null && val !== ''
    );

    if (!hasData) {
      return {
        response:
          '❌ No recent sensor data available. Please check:\n' +
          '1. Is your Smart Pot powered on?\n' +
          '2. Is it connected to WiFi?\n' +
          '3. Try restarting the device if problems persist.',
      };
    }

    const prompt = `
📊 Latest Sensor Readings:
- 🌡️ Temperature: ${formatSensorValue(latest.temperature, '°C')}
- 💧 Humidity: ${formatSensorValue(latest.humidity, '%')}
- 🌿 Soil Moisture (Analog): ${formatSensorValue(latest.moistureAnalog, '%')}
- 🚰 Moisture Status: ${formatSensorValue(latest.moistureDigital)}
- 💡 Luminance: ${formatSensorValue(latest.luminance, ' lux')}
- ⏳ Flow Rate: ${formatSensorValue(latest.flowRate, ' mL/min')}
- 🌊 Total Water Flow: ${formatSensorValue(latest.totalFlow, ' mL')}

🧑‍🌾 User's question: "${message}"

Please analyze the plant's health based on the available sensor data. Follow these guidelines:
1. First mention any missing data (shown as N/A)
2. For available data:
   - Moisture: "Dry" = needs water, "Wet" = sufficient
   - Luminance: <100 lux = low, 100-1000 = moderate, >1000 = bright
   - Temperature: >30°C may need attention
3. Provide specific care suggestions based on current readings
4. If critical data is missing, suggest troubleshooting steps
5. Keep responses friendly, concise, and actionable

Important: If soil moisture is "Dry" or <20%, recommend watering immediately!
`;

    const geminiRes = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      }
    );

    const result =
      geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return { response: result };
  } catch (error) {
    console.error('Gemini error:', error.response?.data || error.message);
    return {
      response:
        '⚠️ I encountered an issue processing your request. ' +
        'Please try again later or check your device connection.',
    };
  }
}

module.exports = { sendMessageToGemini };
