import { GoogleGenAI } from '@google/genai';
const axios = require('axios');
require('dotenv').config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const config = {
  responseMimeType: 'text/plain',
  systemInstruction: [
    {
      text: `This is a Chat window for a ESP32 Project for Plant Sensor Data and Health. Give actionable suggestions if needed. Keep the tone friendly and clear. Do not use Markdown or suggest code!`,
    },
  ],
};
const model = 'gemini-2.0-flash';
const contents = [
  {
    role: 'user',
    parts: [{ text: 'Hello' }],
  },
  {
    role: 'model',
    parts: [{ text: 'Great to meet you. What would you like to know?' }],
  },
];

const chat = ai.chats.create({
  model: model,
  config: config,
  history: contents,
});

let prompt;

async function geminiResponseHandler() {
  // const responsewrong = await ai.models.generateContentStream({
  //   model,
  //   config,
  //   contents,
  // });
  // for await (const chunk of responsewrong) {
  //   console.log(chunk.text);
  // }

  const response = await chat.sendMessageStream({
    message: prompt,
  });

  for await (const chunk of response2) {
    console.debug('chat response 1 chunk: ', chunk.text);
  }
  // return;
}

async function fetchData(message) {
  // try {
  // Fetch latest Smart Pot sensor data
  const sensorRes = await axios.get(`${process.env.BACKEND_URL}/api/data`);

  const latest = Array.isArray(sensorRes.data) ? sensorRes.data[0] : null;

  console.log('Latest Smart Pot Data:', latest);

  if (!latest) {
    prompt = 'Data Not Retrieved';
  }

  console.log('Sensor data debug:', {
    temp: latest.temperature,
    hum: latest.humidity,
    moist: latest.moistureAnalog,
  });

  prompt = `
📊 Latest Sensor Readings:
- 🌡️ Temperature: ${latest.temperature ?? 'N/A'} °C
- 💧 Humidity: ${latest.humidity ?? 'N/A'} %
- 🌿 Soil Moisture (Analog): ${latest.moistureAnalog ?? 'N/A'} %
- 🚰 Moisture Status: ${latest.moistureDigital ?? 'N/A'}
- 💡 Luminance: ${latest.luminance ?? 'N/A'} lux
- ⏳ Flow Rate: ${latest.flowRate ?? 'N/A'} mL/min
- 🌊 Total Water Flow: ${latest.totalFlow ?? 'N/A'} mL

🧑‍🌾 User’s question: "${message}"

Give actionable suggestions if needed. Keep the tone friendly and clear. NO MARKDOWN!
`;
  return prompt;
}
// }

async function sendMessageToGemini(message) {
  fetchData(message);
  if (prompt == 'Data Not Retrieved') {
    return {
      response:
        "❌ Sorry, I couldn't retrieve your sensor data. Please check if the device is online.",
    };
  } else {
    try {
      geminiResponseHandler();
      // return { response: result };
    } catch (error) {
      console.error('Gemini error:', error.response?.data || error.message);
      return {
        error:
          '⚠️ Failed to get a response from Gemini. Please try again later.',
      };
    }
  }
}

module.exports = { sendMessageToGemini };
