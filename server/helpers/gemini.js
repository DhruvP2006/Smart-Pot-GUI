const axios = require('axios');
require('dotenv').config();

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

async function sendMessageToGemini(userId, message) {
  try {
    // Fetch latest Smart Pot sensor data
    const sensorRes = await axios.get(
      process.env.BACKEND_URL
        ? `${process.env.BACKEND_URL}/api/data`
        : 'https://smart-pot-l9l9.onrender.com/api/data'
    );

    const latest = Array.isArray(sensorRes.data) ? sensorRes.data[0] : null;

    console.log('Latest Smart Pot Data:', latest);

    if (!latest) {
      return {
        response:
          "❌ Sorry, I couldn't retrieve your sensor data. Please check if the device is online.",
      };
    }

    console.log('Sensor data debug:', {
      temp: latest.temperature,
      hum: latest.humidity,
      moist: latest.moistureAnalog,
    });

    const prompt = `
📊 Latest Sensor Readings:
- 🌡️ Temperature: ${latest.temperature ?? 'N/A'} °C
- 💧 Humidity: ${latest.humidity ?? 'N/A'} %
- 🌿 Soil Moisture (Analog): ${latest.moistureAnalog ?? 'N/A'}
- 🚰 Moisture Status: ${latest.moistureDigital ?? 'N/A'}
- 💡 Luminance: ${latest.luminance ?? 'N/A'}
- ⏳ Flow Rate: ${latest.flowRate ?? 'N/A'}
- 🌊 Total Water Flow: ${latest.totalFlow ?? 'N/A'}

🧑‍🌾 User’s question: "${message}"

Based on the above sensor data, respond with helpful insights about the plant’s health. Give actionable suggestions if needed. Keep the tone friendly and clear.
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
      error: '⚠️ Failed to get a response from Gemini. Please try again later.',
    };
  }
}

module.exports = { sendMessageToGemini };
