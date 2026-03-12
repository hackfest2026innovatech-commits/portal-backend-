const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema(
  {
    judgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Judge ID is required'],
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team ID is required'],
    },
    scores: {
      innovation: {
        type: Number,
        required: true,
        min: [0, 'Score must be at least 0'],
        max: [10, 'Score cannot exceed 10'],
      },
      technical: {
        type: Number,
        required: true,
        min: [0, 'Score must be at least 0'],
        max: [10, 'Score cannot exceed 10'],
      },
      uiux: {
        type: Number,
        required: true,
        min: [0, 'Score must be at least 0'],
        max: [10, 'Score cannot exceed 10'],
      },
      presentation: {
        type: Number,
        required: true,
        min: [0, 'Score must be at least 0'],
        max: [10, 'Score cannot exceed 10'],
      },
    },
    comments: {
      type: String,
      trim: true,
      maxlength: [2000, 'Comments cannot exceed 2000 characters'],
      default: '',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

evaluationSchema.virtual('totalScore').get(function () {
  if (!this.scores) return 0;
  const { innovation, technical, uiux, presentation } = this.scores;
  return (innovation || 0) + (technical || 0) + (uiux || 0) + (presentation || 0);
});

evaluationSchema.index({ judgeId: 1, teamId: 1 }, { unique: true });
evaluationSchema.index({ teamId: 1 });

module.exports = mongoose.model('Evaluation', evaluationSchema);
