const mongoose = require('mongoose');

const timerSchema = new mongoose.Schema(
  {
    hackathonId: {
      type: String,
      required: [true, 'Hackathon ID is required'],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'Duration (in seconds) is required'],
      min: [0, 'Duration must be a positive number'],
    },
    startTime: {
      type: Date,
      default: null,
    },
    isRunning: {
      type: Boolean,
      default: false,
    },
    pausedAt: {
      type: Date,
      default: null,
    },
    remainingTime: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Timer', timerSchema);
