const express = require('express');
const router = express.Router();
const { chatWithGemini } = require('../helpers/gemini');

router.post('/chat', async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message)
    return res.status(400).json({ error: 'Missing userId or message' });

  const reply = await chatWithGemini(userId, message);
  res.json({ reply });
});

module.exports = router;
