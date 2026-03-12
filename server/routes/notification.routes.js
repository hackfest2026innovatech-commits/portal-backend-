const express = require('express');
const router = express.Router();
const {
  createNotification,
  getNotifications,
  markAsRead,
} = require('../controllers/notification.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../utils/constants');

router.use(auth);

router.route('/')
  .get(getNotifications)
  .post(authorize(ROLES.SUPERADMIN), createNotification);

router.put('/:id/read', markAsRead);

module.exports = router;
