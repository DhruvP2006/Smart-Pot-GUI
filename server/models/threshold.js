const mongoose = require('mongoose');

const thresholdSchema = new mongoose.Schema(
  {
    moistureThreshold: {
      type: Number,
      required: true,
      default: 50,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Threshold', thresholdSchema);
