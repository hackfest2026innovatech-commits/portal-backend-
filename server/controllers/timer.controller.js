const Timer = require('../models/Timer');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { success, created } = require('../utils/apiResponse');
const { calculateTimeRemaining } = require('../utils/helpers');

// GET /api/v1/timer?hackathonId=xxx
const getTimer = asyncHandler(async (req, res) => {
  const { hackathonId } = req.query;

  if (!hackathonId) {
    throw new AppError('hackathonId query parameter is required', 400);
  }

  let timer = await Timer.findOne({ hackathonId });

  if (!timer) {
    throw new AppError('Timer not found for this hackathon', 404);
  }

  const timerData = timer.toObject();

  if (timer.isRunning && timer.startTime) {
    timerData.currentRemaining = calculateTimeRemaining(
      timer.startTime,
      timer.remainingTime || timer.duration
    );
  } else {
    timerData.currentRemaining = timer.remainingTime || timer.duration;
  }

  success(res, { timer: timerData });
});

// POST /api/v1/timer/start
const startTimer = asyncHandler(async (req, res) => {
  const { hackathonId, duration } = req.body;

  if (!hackathonId) {
    throw new AppError('hackathonId is required', 400);
  }

  let timer = await Timer.findOne({ hackathonId });

  if (!timer) {
    if (!duration) {
      throw new AppError('duration is required when creating a new timer', 400);
    }
    timer = await Timer.create({
      hackathonId,
      duration,
      startTime: new Date(),
      isRunning: true,
      remainingTime: duration,
    });
  } else {
    if (timer.isRunning) {
      throw new AppError('Timer is already running', 400);
    }
    timer.startTime = new Date();
    timer.isRunning = true;
    if (timer.remainingTime === null || timer.remainingTime === undefined) {
      timer.remainingTime = timer.duration;
    }
    timer.pausedAt = null;
    await timer.save();
  }

  const io = req.app.get('io');
  if (io) {
    io.emit('timer:started', {
      hackathonId,
      startTime: timer.startTime,
      duration: timer.duration,
      remainingTime: timer.remainingTime,
    });
  }

  success(res, { timer }, 'Timer started');
});

// POST /api/v1/timer/pause
const pauseTimer = asyncHandler(async (req, res) => {
  const { hackathonId } = req.body;

  if (!hackathonId) {
    throw new AppError('hackathonId is required', 400);
  }

  const timer = await Timer.findOne({ hackathonId });
  if (!timer) {
    throw new AppError('Timer not found', 404);
  }

  if (!timer.isRunning) {
    throw new AppError('Timer is not running', 400);
  }

  const elapsed = Math.floor((Date.now() - new Date(timer.startTime).getTime()) / 1000);
  const remaining = Math.max(0, (timer.remainingTime || timer.duration) - elapsed);

  timer.isRunning = false;
  timer.pausedAt = new Date();
  timer.remainingTime = remaining;
  await timer.save();

  const io = req.app.get('io');
  if (io) {
    io.emit('timer:paused', {
      hackathonId,
      remainingTime: remaining,
    });
  }

  success(res, { timer }, 'Timer paused');
});

// POST /api/v1/timer/reset
const resetTimer = asyncHandler(async (req, res) => {
  const { hackathonId, duration } = req.body;

  if (!hackathonId) {
    throw new AppError('hackathonId is required', 400);
  }

  const timer = await Timer.findOne({ hackathonId });
  if (!timer) {
    throw new AppError('Timer not found', 404);
  }

  timer.isRunning = false;
  timer.startTime = null;
  timer.pausedAt = null;
  timer.remainingTime = duration || timer.duration;
  if (duration) {
    timer.duration = duration;
  }
  await timer.save();

  const io = req.app.get('io');
  if (io) {
    io.emit('timer:reset', {
      hackathonId,
      duration: timer.duration,
      remainingTime: timer.remainingTime,
    });
  }

  success(res, { timer }, 'Timer reset');
});

module.exports = {
  getTimer,
  startTimer,
  pauseTimer,
  resetTimer,
};
