const mongoose = require('mongoose');

const gitHubCommitSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team ID is required'],
    },
    sha: {
      type: String,
      required: [true, 'Commit SHA is required'],
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      default: '',
    },
    author: {
      type: String,
      trim: true,
      default: '',
    },
    timestamp: {
      type: Date,
      required: true,
    },
    additions: {
      type: Number,
      default: 0,
    },
    deletions: {
      type: Number,
      default: 0,
    },
    repoFullName: {
      type: String,
      required: [true, 'Repository full name is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

gitHubCommitSchema.index({ teamId: 1, timestamp: -1 });
gitHubCommitSchema.index({ sha: 1, repoFullName: 1 }, { unique: true });

module.exports = mongoose.model('GitHubCommit', gitHubCommitSchema);
