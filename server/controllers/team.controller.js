const Team = require('../models/Team');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { success, created, noContent } = require('../utils/apiResponse');
const { parsePaginationParams, buildPaginatedResponse } = require('../utils/pagination');
const { generateInviteCode } = require('../utils/helpers');

// POST /api/v1/teams
const createTeam = asyncHandler(async (req, res) => {
  const { teamName, hackathonId, githubRepo, members } = req.body;

  const team = await Team.create({
    teamName,
    hackathonId,
    githubRepo: githubRepo || '',
    members: members || [],
    inviteCode: generateInviteCode(),
  });

  const populated = await Team.findById(team._id)
    .populate('members.userId', 'name email role')
    .populate('assignedJudges', 'name email');

  created(res, { team: populated }, 'Team created successfully');
});

// GET /api/v1/teams
const getAllTeams = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parsePaginationParams(req.query);
  const filter = {};

  if (req.query.hackathonId) {
    filter.hackathonId = req.query.hackathonId;
  }

  const [teams, total] = await Promise.all([
    Team.find(filter)
      .populate('members.userId', 'name email role')
      .populate('assignedJudges', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Team.countDocuments(filter),
  ]);

  const result = buildPaginatedResponse(teams, total, page, limit);
  success(res, result);
});

// GET /api/v1/teams/:id
const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id)
    .populate('members.userId', 'name email role')
    .populate('assignedJudges', 'name email');

  if (!team) {
    throw new AppError('Team not found', 404);
  }

  success(res, { team });
});

// POST /api/v1/teams/join
const joinTeam = asyncHandler(async (req, res) => {
  const { inviteCode } = req.body;

  if (!inviteCode) {
    throw new AppError('Invite code is required', 400);
  }

  const team = await Team.findOne({ inviteCode });
  if (!team) {
    throw new AppError('Invalid invite code', 404);
  }

  const alreadyMember = team.members.some(
    (m) => m.userId.toString() === req.user._id.toString()
  );

  if (alreadyMember) {
    throw new AppError('You are already a member of this team', 400);
  }

  team.members.push({ userId: req.user._id, role: 'member' });
  await team.save();

  const populated = await Team.findById(team._id)
    .populate('members.userId', 'name email role')
    .populate('assignedJudges', 'name email');

  success(res, { team: populated }, 'Joined team successfully');
});

// PUT /api/v1/teams/:id/assign-judges
const assignJudges = asyncHandler(async (req, res) => {
  const { judgeIds } = req.body;

  if (!judgeIds || !Array.isArray(judgeIds)) {
    throw new AppError('judgeIds must be an array', 400);
  }

  const team = await Team.findById(req.params.id);
  if (!team) {
    throw new AppError('Team not found', 404);
  }

  team.assignedJudges = judgeIds;
  await team.save();

  const populated = await Team.findById(team._id)
    .populate('members.userId', 'name email role')
    .populate('assignedJudges', 'name email');

  success(res, { team: populated }, 'Judges assigned successfully');
});

// PUT /api/v1/teams/:id
const updateTeam = asyncHandler(async (req, res) => {
  const { teamName, githubRepo, hackathonId } = req.body;

  const team = await Team.findById(req.params.id);
  if (!team) {
    throw new AppError('Team not found', 404);
  }

  if (teamName !== undefined) team.teamName = teamName;
  if (githubRepo !== undefined) team.githubRepo = githubRepo;
  if (hackathonId !== undefined) team.hackathonId = hackathonId;

  await team.save();

  const populated = await Team.findById(team._id)
    .populate('members.userId', 'name email role')
    .populate('assignedJudges', 'name email');

  success(res, { team: populated }, 'Team updated successfully');
});

// DELETE /api/v1/teams/:id
const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) {
    throw new AppError('Team not found', 404);
  }

  await team.deleteOne();
  noContent(res);
});

// GET /api/v1/teams/my-team
const getMyTeam = asyncHandler(async (req, res) => {
  const team = await Team.findOne({
    'members.userId': req.user._id,
  })
    .populate('members.userId', 'name email role')
    .populate('assignedJudges', 'name email');

  if (!team) {
    throw new AppError('You are not part of any team', 404);
  }

  success(res, { team });
});

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  joinTeam,
  assignJudges,
  updateTeam,
  deleteTeam,
  getMyTeam,
};
