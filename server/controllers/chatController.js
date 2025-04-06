// controllers/chatController.js
const { sendMessageToGemini } = require('../helpers/gemini');

const handleGeminiChat = async (req, res) => {
  const { message } = req.body;

  if (!message) return res.status(400).json({ error: 'Message is required.' });

  const result = await sendMessageToGemini('user', message);

  if (result.error) {
    return res.status(500).json({ error: result.error });
  }

  res.json({ response: result.response });
};

module.exports = { handleGeminiChat };
