const mongoose = require('mongoose');
const { generateInviteCode } = require('../utils/helpers');

const teamMemberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['leader', 'member'],
      default: 'member',
    },
  },
  { _id: false }
);

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
      maxlength: [100, 'Team name cannot exceed 100 characters'],
    },
    members: [teamMemberSchema],
    githubRepo: {
      type: String,
      trim: true,
      default: '',
    },
    assignedJudges: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    hackathonId: {
      type: String,
      required: [true, 'Hackathon ID is required'],
      trim: true,
    },
    inviteCode: {
      type: String,
      unique: true,
      default: () => generateInviteCode(),
    },
  },
  {
    timestamps: true,
  }
);

teamSchema.index({ hackathonId: 1 });

module.exports = mongoose.model('Team', teamSchema);
