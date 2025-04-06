const express = require('express');
const router = express.Router();
const {
  postSensorData,
  saveThreshold,
  getThreshold,
} = require('../controllers/sensorController');

router.post('/', postSensorData);
router.post('/threshold', saveThreshold);
router.get('/threshold', getThreshold);

module.exports = router;
