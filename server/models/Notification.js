const mongoose = require('mongoose');
const { TARGET_ROLES_ARRAY } = require('../utils/constants');

const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    targetRole: {
      type: String,
      enum: TARGET_ROLES_ARRAY,
      default: 'all',
    },
    hackathonId: {
      type: String,
      trim: true,
      default: '',
    },
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ targetRole: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
