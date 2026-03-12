const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { success, created } = require('../utils/apiResponse');
const { parsePaginationParams, buildPaginatedResponse } = require('../utils/pagination');

// POST /api/v1/notifications
const createNotification = asyncHandler(async (req, res) => {
  const { message, targetRole, hackathonId } = req.body;

  if (!message) {
    throw new AppError('Notification message is required', 400);
  }

  const notification = await Notification.create({
    message,
    targetRole: targetRole || 'all',
    hackathonId: hackathonId || '',
    createdBy: req.user._id,
  });

  const populated = await Notification.findById(notification._id).populate(
    'createdBy',
    'name email role'
  );

  const io = req.app.get('io');
  if (io) {
    const eventData = {
      notification: populated,
    };

    if (targetRole === 'all' || !targetRole) {
      io.emit('notification:new', eventData);
    } else {
      io.to(`role:${targetRole}`).emit('notification:new', eventData);
    }
  }

  created(res, { notification: populated }, 'Notification created successfully');
});

// GET /api/v1/notifications
const getNotifications = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePaginationParams(req.query);
  const userRole = req.user.role;

  const filter = {
    $or: [{ targetRole: 'all' }, { targetRole: userRole }],
  };

  if (req.query.hackathonId) {
    filter.hackathonId = req.query.hackathonId;
  }

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .populate('createdBy', 'name email role')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(filter),
  ]);

  // Annotate each notification with isRead status for current user
  const annotated = notifications.map((n) => ({
    ...n,
    isRead: n.readBy ? n.readBy.some((id) => id.toString() === req.user._id.toString()) : false,
  }));

  const result = buildPaginatedResponse(annotated, total, page, limit);
  success(res, result);
});

// PUT /api/v1/notifications/:id/read
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  const alreadyRead = notification.readBy.some(
    (id) => id.toString() === req.user._id.toString()
  );

  if (!alreadyRead) {
    notification.readBy.push(req.user._id);
    await notification.save();
  }

  success(res, { notification }, 'Notification marked as read');
});

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
};
