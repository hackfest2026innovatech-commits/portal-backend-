const mongoose = require('mongoose');
const { FORM_FIELD_TYPES_ARRAY, FORM_TYPES_ARRAY } = require('../utils/constants');

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    inputType: {
      type: String,
      enum: FORM_FIELD_TYPES_ARRAY,
      required: [true, 'Input type is required'],
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Form title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    hackathonId: {
      type: String,
      required: [true, 'Hackathon ID is required'],
      trim: true,
    },
    formType: {
      type: String,
      enum: FORM_TYPES_ARRAY,
      required: [true, 'Form type is required'],
    },
    questions: [questionSchema],
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

formSchema.index({ hackathonId: 1 });

module.exports = mongoose.model('Form', formSchema);
