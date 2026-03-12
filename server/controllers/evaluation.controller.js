const Evaluation = require('../models/Evaluation');
const Team = require('../models/Team');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { success, created } = require('../utils/apiResponse');
const { parsePaginationParams, buildPaginatedResponse } = require('../utils/pagination');

// POST /api/v1/evaluations
const submitEvaluation = asyncHandler(async (req, res) => {
  const { teamId, scores, comments } = req.body;
  const judgeId = req.user._id;

  if (!teamId || !scores) {
    throw new AppError('teamId and scores are required', 400);
  }

  const team = await Team.findById(teamId);
  if (!team) {
    throw new AppError('Team not found', 404);
  }

  // Check if judge is assigned to this team
  const isAssigned = team.assignedJudges.some(
    (j) => j.toString() === judgeId.toString()
  );

  if (!isAssigned && req.user.role !== 'superadmin') {
    throw new AppError('You are not assigned to evaluate this team', 403);
  }

  // Check for existing evaluation
  const existing = await Evaluation.findOne({ judgeId, teamId });
  if (existing) {
    throw new AppError(
      'You have already submitted an evaluation for this team. Use PUT to update.',
      409
    );
  }

  const evaluation = await Evaluation.create({
    judgeId,
    teamId,
    scores,
    comments: comments || '',
    submittedAt: new Date(),
  });

  const populated = await Evaluation.findById(evaluation._id)
    .populate('judgeId', 'name email')
    .populate('teamId', 'teamName');

  created(res, { evaluation: populated }, 'Evaluation submitted successfully');
});

// PUT /api/v1/evaluations/:id
const updateEvaluation = asyncHandler(async (req, res) => {
  const { scores, comments } = req.body;

  const evaluation = await Evaluation.findById(req.params.id);
  if (!evaluation) {
    throw new AppError('Evaluation not found', 404);
  }

  // Only the judge who created it or superadmin can update
  if (
    evaluation.judgeId.toString() !== req.user._id.toString() &&
    req.user.role !== 'superadmin'
  ) {
    throw new AppError('Not authorized to update this evaluation', 403);
  }

  if (scores) {
    if (scores.innovation !== undefined) evaluation.scores.innovation = scores.innovation;
    if (scores.technical !== undefined) evaluation.scores.technical = scores.technical;
    if (scores.uiux !== undefined) evaluation.scores.uiux = scores.uiux;
    if (scores.presentation !== undefined) evaluation.scores.presentation = scores.presentation;
  }

  if (comments !== undefined) {
    evaluation.comments = comments;
  }

  evaluation.submittedAt = new Date();
  await evaluation.save();

  const populated = await Evaluation.findById(evaluation._id)
    .populate('judgeId', 'name email')
    .populate('teamId', 'teamName');

  success(res, { evaluation: populated }, 'Evaluation updated successfully');
});

// GET /api/v1/evaluations/team/:teamId
const getEvaluationsByTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId);
  if (!team) {
    throw new AppError('Team not found', 404);
  }

  const evaluations = await Evaluation.find({ teamId })
    .populate('judgeId', 'name email')
    .populate('teamId', 'teamName')
    .sort('-submittedAt')
    .lean();

  // Calculate averages
  let avgScores = { innovation: 0, technical: 0, uiux: 0, presentation: 0, total: 0 };
  if (evaluations.length > 0) {
    const sum = evaluations.reduce(
      (acc, ev) => {
        acc.innovation += ev.scores.innovation;
        acc.technical += ev.scores.technical;
        acc.uiux += ev.scores.uiux;
        acc.presentation += ev.scores.presentation;
        acc.total +=
          ev.scores.innovation + ev.scores.technical + ev.scores.uiux + ev.scores.presentation;
        return acc;
      },
      { innovation: 0, technical: 0, uiux: 0, presentation: 0, total: 0 }
    );

    const count = evaluations.length;
    avgScores = {
      innovation: parseFloat((sum.innovation / count).toFixed(2)),
      technical: parseFloat((sum.technical / count).toFixed(2)),
      uiux: parseFloat((sum.uiux / count).toFixed(2)),
      presentation: parseFloat((sum.presentation / count).toFixed(2)),
      total: parseFloat((sum.total / count).toFixed(2)),
    };
  }

  success(res, {
    evaluations,
    averageScores: avgScores,
    evaluationCount: evaluations.length,
  });
});

// GET /api/v1/evaluations/assignments
const getJudgeAssignments = asyncHandler(async (req, res) => {
  const judgeId = req.user._id;

  const assignedTeams = await Team.find({
    assignedJudges: judgeId,
  })
    .populate('members.userId', 'name email')
    .lean();

  // Get existing evaluations by this judge
  const existingEvaluations = await Evaluation.find({ judgeId })
    .select('teamId')
    .lean();

  const evaluatedTeamIds = new Set(
    existingEvaluations.map((e) => e.teamId.toString())
  );

  const assignments = assignedTeams.map((team) => ({
    ...team,
    evaluated: evaluatedTeamIds.has(team._id.toString()),
  }));

  success(res, { assignments });
});

// GET /api/v1/evaluations/overview
const getScoreOverview = asyncHandler(async (req, res) => {
  const overview = await Evaluation.aggregate([
    {
      $group: {
        _id: '$teamId',
        avgInnovation: { $avg: '$scores.innovation' },
        avgTechnical: { $avg: '$scores.technical' },
        avgUiux: { $avg: '$scores.uiux' },
        avgPresentation: { $avg: '$scores.presentation' },
        evaluationCount: { $sum: 1 },
      },
    },
    {
      $addFields: {
        avgTotal: {
          $add: ['$avgInnovation', '$avgTechnical', '$avgUiux', '$avgPresentation'],
        },
      },
    },
    {
      $sort: { avgTotal: -1 },
    },
    {
      $lookup: {
        from: 'teams',
        localField: '_id',
        foreignField: '_id',
        as: 'team',
      },
    },
    {
      $unwind: '$team',
    },
    {
      $project: {
        _id: 0,
        teamId: '$_id',
        teamName: '$team.teamName',
        hackathonId: '$team.hackathonId',
        avgInnovation: { $round: ['$avgInnovation', 2] },
        avgTechnical: { $round: ['$avgTechnical', 2] },
        avgUiux: { $round: ['$avgUiux', 2] },
        avgPresentation: { $round: ['$avgPresentation', 2] },
        avgTotal: { $round: ['$avgTotal', 2] },
        evaluationCount: 1,
      },
    },
  ]);

  success(res, { overview });
});

module.exports = {
  submitEvaluation,
  updateEvaluation,
  getEvaluationsByTeam,
  getJudgeAssignments,
  getScoreOverview,
};
