// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { handleGeminiChat } = require('../controllers/chatController');

// ✅ Route is now POST /api/chat
router.post('/', handleGeminiChat);

module.exports = router;
