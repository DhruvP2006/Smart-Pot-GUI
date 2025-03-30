const express = require('express');
const router = express.Router();
const cors = require('cors');
const authController = require('./../controllers/authController');
const test = require('./../controllers/authController');

// middlewares
router.use(cors({ credentials: true, origin: 'https://localhost:3000' }));

router.get('/', test);

module.exports = router;
