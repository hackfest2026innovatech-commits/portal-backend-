const Form = require('../models/Form');
const FormResponse = require('../models/FormResponse');
const Team = require('../models/Team');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { success, created } = require('../utils/apiResponse');
const { parsePaginationParams, buildPaginatedResponse } = require('../utils/pagination');

// POST /api/v1/forms
const createForm = asyncHandler(async (req, res) => {
  const { title, hackathonId, formType, questions } = req.body;

  if (!title || !hackathonId || !formType) {
    throw new AppError('title, hackathonId, and formType are required', 400);
  }

  const form = await Form.create({
    title,
    hackathonId,
    formType,
    questions: questions || [],
    createdBy: req.user._id,
  });

  const populated = await Form.findById(form._id).populate('createdBy', 'name email role');

  created(res, { form: populated }, 'Form created successfully');
});

// GET /api/v1/forms
const getForms = asyncHandler(async (req, res) => {
  const { page, limit, skip } = parsePaginationParams(req.query);
  const filter = {};

  if (req.query.hackathonId) {
    filter.hackathonId = req.query.hackathonId;
  }

  if (req.query.formType) {
    filter.formType = req.query.formType;
  }

  const [forms, total] = await Promise.all([
    Form.find(filter)
      .populate('createdBy', 'name email role')
      .sort('-createdAt')
      .skip(skip)
      .limit(limit)
      .lean(),
    Form.countDocuments(filter),
  ]);

  const result = buildPaginatedResponse(forms, total, page, limit);
  success(res, result);
});

// GET /api/v1/forms/:id
const getFormById = asyncHandler(async (req, res) => {
  const form = await Form.findById(req.params.id).populate(
    'createdBy',
    'name email role'
  );

  if (!form) {
    throw new AppError('Form not found', 404);
  }

  success(res, { form });
});

// POST /api/v1/forms/:id/responses
const submitResponse = asyncHandler(async (req, res) => {
  const { teamId, answers } = req.body;
  const formId = req.params.id;

  const form = await Form.findById(formId);
  if (!form) {
    throw new AppError('Form not found', 404);
  }

  if (!teamId) {
    throw new AppError('teamId is required', 400);
  }

  const team = await Team.findById(teamId);
  if (!team) {
    throw new AppError('Team not found', 404);
  }

  // Check if team has already submitted a response for this form
  const existingResponse = await FormResponse.findOne({ formId, teamId });
  if (existingResponse) {
    throw new AppError('A response has already been submitted for this form by this team', 409);
  }

  // Validate required questions
  const requiredQuestions = form.questions.filter((q) => q.required);
  for (const rq of requiredQuestions) {
    const answer = answers ? answers.find(
      (a) => a.questionId.toString() === rq._id.toString()
    ) : null;
    if (!answer || !answer.value) {
      throw new AppError(`Answer is required for question: "${rq.question}"`, 400);
    }
  }

  const formResponse = await FormResponse.create({
    formId,
    teamId,
    answers: answers || [],
    submittedAt: new Date(),
  });

  const populated = await FormResponse.findById(formResponse._id)
    .populate('formId', 'title formType')
    .populate('teamId', 'teamName');

  created(res, { response: populated }, 'Response submitted successfully');
});

// GET /api/v1/forms/:id/responses
const getResponses = asyncHandler(async (req, res) => {
  const formId = req.params.id;
  const { page, limit, skip } = parsePaginationParams(req.query);

  const form = await Form.findById(formId);
  if (!form) {
    throw new AppError('Form not found', 404);
  }

  const filter = { formId };

  if (req.query.teamId) {
    filter.teamId = req.query.teamId;
  }

  const [responses, total] = await Promise.all([
    FormResponse.find(filter)
      .populate('formId', 'title formType')
      .populate('teamId', 'teamName')
      .sort('-submittedAt')
      .skip(skip)
      .limit(limit)
      .lean(),
    FormResponse.countDocuments(filter),
  ]);

  const result = buildPaginatedResponse(responses, total, page, limit);
  success(res, result);
});

// GET /api/v1/forms/responses/team/:teamId
const getResponsesByTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const { page, limit, skip } = parsePaginationParams(req.query);

  const team = await Team.findById(teamId);
  if (!team) {
    throw new AppError('Team not found', 404);
  }

  const filter = { teamId };

  const [responses, total] = await Promise.all([
    FormResponse.find(filter)
      .populate('formId', 'title formType hackathonId')
      .populate('teamId', 'teamName')
      .sort('-submittedAt')
      .skip(skip)
      .limit(limit)
      .lean(),
    FormResponse.countDocuments(filter),
  ]);

  const result = buildPaginatedResponse(responses, total, page, limit);
  success(res, result);
});

module.exports = {
  createForm,
  getForms,
  getFormById,
  submitResponse,
  getResponses,
  getResponsesByTeam,
};
