const axios = require('axios');
require('dotenv').config();

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

async function sendMessageToGemini(userId, message) {
  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: message }],
          },
        ],
      }
    );

    const result =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return { response: result };
  } catch (error) {
    console.error('Gemini error:', error.response?.data || error.message);
    return { error: 'Failed to communicate with Gemini.' };
  }
}

module.exports = { sendMessageToGemini };
