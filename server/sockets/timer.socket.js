const Timer = require('../models/Timer');
const { calculateTimeRemaining } = require('../utils/helpers');

const activeIntervals = new Map();

function setupTimerSocket(io) {
  function startTickBroadcast(hackathonId) {
    if (activeIntervals.has(hackathonId)) {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        const timer = await Timer.findOne({ hackathonId });

        if (!timer || !timer.isRunning) {
          clearInterval(intervalId);
          activeIntervals.delete(hackathonId);
          return;
        }

        const remaining = calculateTimeRemaining(
          timer.startTime,
          timer.remainingTime || timer.duration
        );

        io.emit('timer:tick', {
          hackathonId,
          remainingTime: remaining,
          isRunning: true,
        });

        if (remaining <= 0) {
          timer.isRunning = false;
          timer.remainingTime = 0;
          await timer.save();

          io.emit('timer:finished', { hackathonId });

          clearInterval(intervalId);
          activeIntervals.delete(hackathonId);
        }
      } catch (err) {
        console.error(`Timer tick error for hackathon ${hackathonId}:`, err.message);
      }
    }, 1000);

    activeIntervals.set(hackathonId, intervalId);
  }

  function stopTickBroadcast(hackathonId) {
    const intervalId = activeIntervals.get(hackathonId);
    if (intervalId) {
      clearInterval(intervalId);
      activeIntervals.delete(hackathonId);
    }
  }

  io.on('connection', (socket) => {
    socket.on('timer:start', async (data) => {
      const { hackathonId } = data || {};
      if (hackathonId) {
        startTickBroadcast(hackathonId);
      }
    });

    socket.on('timer:pause', async (data) => {
      const { hackathonId } = data || {};
      if (hackathonId) {
        stopTickBroadcast(hackathonId);
      }
    });

    socket.on('timer:reset', async (data) => {
      const { hackathonId } = data || {};
      if (hackathonId) {
        stopTickBroadcast(hackathonId);
      }
    });
  });

  // Resume any running timers on server restart (wait for DB to be ready)
  const mongoose = require('mongoose');
  function resumeTimers() {
    if (mongoose.connection.readyState !== 1) {
      mongoose.connection.once('connected', resumeTimers);
      return;
    }
    (async () => {
      try {
        const runningTimers = await Timer.find({ isRunning: true });
        for (const timer of runningTimers) {
          const remaining = calculateTimeRemaining(
            timer.startTime,
            timer.remainingTime || timer.duration
          );
          if (remaining > 0) {
            startTickBroadcast(timer.hackathonId);
          } else {
            timer.isRunning = false;
            timer.remainingTime = 0;
            await timer.save();
          }
        }
      } catch (err) {
        console.error('Error resuming running timers:', err.message);
      }
    })();
  }
  resumeTimers();

  return { startTickBroadcast, stopTickBroadcast };
}

module.exports = setupTimerSocket;
