const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('./asyncHandler');

const auth = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Not authorized, no token provided', 401);
  }

  const token = authHeader.split(' ')[1];

  const decoded = jwt.verify(token, JWT_SECRET);

  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    throw new AppError('Not authorized, user not found', 401);
  }

  req.user = user;
  next();
});

module.exports = auth;
