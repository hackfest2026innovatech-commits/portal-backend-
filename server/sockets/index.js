const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const User = require('../models/User');
const setupTimerSocket = require('./timer.socket');
const setupNotificationSocket = require('./notification.socket');

function setupSocket(io) {
  // JWT authentication middleware for Socket.io
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password').lean();

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (err) {
      return next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} (user: ${socket.user.email})`);

    // Join role-based rooms
    socket.join(`role:${socket.user.role}`);
    socket.join(`user:${socket.user._id}`);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id} (user: ${socket.user.email})`);
    });
  });

  // Set up sub-module sockets
  setupTimerSocket(io);
  setupNotificationSocket(io);
}

module.exports = setupSocket;
