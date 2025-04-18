import { GoogleGenerativeAI } from '@google/generative-ai';
const axios = require('axios');
require('dotenv').config();

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const chatConfig = {
  generationConfig: {
    responseMimeType: 'text/plain',
  },
  systemInstruction: {
    parts: [
      {
        text: `You are a plant care assistant for a smart pot system. 
      Provide clear, actionable advice based on sensor data. 
      Keep responses friendly and concise. 
      Never use markdown or code formatting.`,
      },
    ],
  },
};

let chatSession;

// Initialize chat session
async function initializeChat() {
  if (!chatSession) {
    chatSession = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'Hello' }],
        },
        {
          role: 'model',
          parts: [
            {
              text: "I'm your plant care assistant. How can I help with your smart pot today?",
            },
          ],
        },
      ],
      generationConfig: chatConfig.generationConfig,
      systemInstruction: chatConfig.systemInstruction,
    });
  }
  return chatSession;
}

// Helper function to format sensor values
function formatSensorValue(value, unit = '') {
  return value === undefined ||
    value === null ||
    value === '' ||
    value === 'undefined'
    ? 'N/A'
    : `${value}${unit}`;
}

// Fetch sensor data from backend
async function fetchSensorData() {
  try {
    const sensorRes = await axios.get(
      process.env.BACKEND_URL
        ? `${process.env.BACKEND_URL}/api/data`
        : 'https://smart-pot-l9l9.onrender.com/api/data'
    );

    // Normalize data format
    const latest = Array.isArray(sensorRes.data)
      ? sensorRes.data[0]
      : sensorRes.data;

    if (!latest || Object.keys(latest).length === 0) {
      throw new Error('No sensor data received');
    }

    console.log('Raw Sensor Data:', JSON.stringify(latest, null, 2));

    return latest;
  } catch (error) {
    console.error('Sensor data fetch error:', error.message);
    return null;
  }
}

// Generate prompt from sensor data
async function generatePrompt(message) {
  const latest = await fetchSensorData();

  if (!latest) {
    return {
      error:
        "❌ Couldn't retrieve sensor data. Please check your device connection.",
      prompt: null,
    };
  }

  const prompt = `
📊 Current Plant Environment:
- 🌡️ Temperature: ${formatSensorValue(latest.temperature, '°C')}
- 💧 Humidity: ${formatSensorValue(latest.humidity, '%')}
- 🌿 Soil Moisture: ${formatSensorValue(latest.moistureAnalog, '%')}
- 🚰 Moisture Status: ${formatSensorValue(latest.moistureDigital)}
- 💡 Light Level: ${formatSensorValue(latest.luminance, ' lux')}
- ⏳ Water Flow Rate: ${formatSensorValue(latest.flowRate, ' mL/min')}
- 🌊 Total Water Used: ${formatSensorValue(latest.totalFlow, ' mL')}

👤 User Question: "${message}"

Analyze the plant's health and environment. Prioritize:
1. Immediate actions if critical conditions detected
2. Troubleshooting if sensors show N/A
3. General care advice based on available data
`;

  return { prompt, error: null };
}

// Main function to handle Gemini responses
async function sendMessageToGemini(message) {
  try {
    await initializeChat();

    const { prompt, error } = await generatePrompt(message);
    if (error) return { response: error };

    const result = await chatSession.sendMessage(prompt);
    const response = result.response.text();

    return { response };
  } catch (error) {
    console.error('Gemini communication error:', error);
    return {
      response: '⚠️ Temporary system issue. Please try again in a moment.',
    };
  }
}

module.exports = { sendMessageToGemini };
