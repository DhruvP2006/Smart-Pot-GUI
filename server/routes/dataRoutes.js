const express = require('express');
const router = express.Router();
const {
  getLatestData,
  getGraphData,
} = require('../controllers/dataController');

router.get('/', getLatestData);
router.get('/graph-data', getGraphData);

module.exports = router;
