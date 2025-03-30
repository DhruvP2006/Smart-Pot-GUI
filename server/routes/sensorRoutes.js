const express = require('express');
const router = express.Router();
const { postSensorData } = require('../controllers/sensorController');

router.post('/', postSensorData);

module.exports = router;
