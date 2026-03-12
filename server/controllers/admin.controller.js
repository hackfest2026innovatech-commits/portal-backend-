const User = require('../models/User');
const Team = require('../models/Team');
const Evaluation = require('../models/Evaluation');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { success } = require('../utils/apiResponse');
const { ROLES_ARRAY } = require('../utils/constants');
const { parsePaginationParams, buildPaginatedResponse } = require('../utils/pagination');

// GET /api/v1/admin/stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalTeams,
    totalUsers,
    totalStudents,
    totalJudges,
    totalSuperadmins,
    totalEvaluations,
  ] = await Promise.all([
    Team.countDocuments(),
    User.countDocuments(),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'judge' }),
    User.countDocuments({ role: 'superadmin' }),
    Evaluation.countDocuments(),
  ]);

  success(res, {
    stats: {
      totalTeams,
      totalUsers,
      usersByRole: {
        student: totalStudents,
        judge: totalJudges,
        superadmin: totalSuperadmins,
      },
      totalEvaluations,
    },
  });
});

// GET /api/v1/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort } = parsePaginationParams(req.query);
  const filter = {};

  if (req.query.role) {
    filter.role = req.query.role;
  }

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filter.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  const result = buildPaginatedResponse(users, total, page, limit);
  success(res, result);
});

// PUT /api/v1/admin/users/:id/role
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role || !ROLES_ARRAY.includes(role)) {
    throw new AppError(
      `Invalid role. Must be one of: ${ROLES_ARRAY.join(', ')}`,
      400
    );
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Prevent superadmin from demoting themselves
  if (
    user._id.toString() === req.user._id.toString() &&
    role !== 'superadmin'
  ) {
    throw new AppError('You cannot change your own role', 400);
  }

  user.role = role;
  await user.save();

  success(res, { user }, 'User role updated successfully');
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
};
