const GitHubCommit = require('../models/GitHubCommit');
const Team = require('../models/Team');
const githubService = require('../services/github.service');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { success } = require('../utils/apiResponse');
const { parsePaginationParams, buildPaginatedResponse } = require('../utils/pagination');

// POST /api/v1/github/sync/:teamId
const syncRepoCommits = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId);
  if (!team) {
    throw new AppError('Team not found', 404);
  }

  if (!team.githubRepo) {
    throw new AppError('Team does not have a GitHub repository configured', 400);
  }

  try {
    const result = await githubService.syncAndStoreCommits(teamId);
    success(res, result, 'Repository commits synced successfully');
  } catch (err) {
    // Handle GitHub API errors gracefully
    if (err.status === 401 || err.message?.includes('Bad credentials')) {
      throw new AppError('GitHub token is missing or invalid. Please configure a valid GITHUB_TOKEN in the server environment.', 401);
    }
    if (err.status === 404) {
      throw new AppError(`GitHub repository not found: ${team.githubRepo}. Check that the repo exists and is accessible.`, 404);
    }
    if (err.status === 403) {
      throw new AppError('GitHub API rate limit exceeded. Please try again later or configure a GITHUB_TOKEN.', 429);
    }
    throw err;
  }
});

// GET /api/v1/github/commits/:teamId
const getCommitsByTeam = asyncHandler(async (req, res) => {
  const { teamId } = req.params;
  const { page, limit, skip, sort } = parsePaginationParams(req.query);

  const team = await Team.findById(teamId);
  if (!team) {
    throw new AppError('Team not found', 404);
  }

  const filter = { teamId };

  const [commits, total] = await Promise.all([
    GitHubCommit.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    GitHubCommit.countDocuments(filter),
  ]);

  const result = buildPaginatedResponse(commits, total, page, limit);
  success(res, result);
});

// GET /api/v1/github/timeline/:teamId
const getCommitTimeline = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const team = await Team.findById(teamId);
  if (!team) {
    throw new AppError('Team not found', 404);
  }

  const timeline = await GitHubCommit.aggregate([
    { $match: { teamId: team._id } },
    {
      $group: {
        _id: {
          year: { $year: '$timestamp' },
          month: { $month: '$timestamp' },
          day: { $dayOfMonth: '$timestamp' },
          hour: { $hour: '$timestamp' },
        },
        commitCount: { $sum: 1 },
        totalAdditions: { $sum: '$additions' },
        totalDeletions: { $sum: '$deletions' },
        commits: {
          $push: {
            sha: '$sha',
            message: '$message',
            author: '$author',
            timestamp: '$timestamp',
          },
        },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
        '_id.day': 1,
        '_id.hour': 1,
      },
    },
    {
      $project: {
        _id: 0,
        hour: {
          $dateFromParts: {
            year: '$_id.year',
            month: '$_id.month',
            day: '$_id.day',
            hour: '$_id.hour',
          },
        },
        commitCount: 1,
        totalAdditions: 1,
        totalDeletions: 1,
        commits: 1,
      },
    },
  ]);

  success(res, { timeline });
});

// POST /api/v1/github/fetch-commits (alternative direct fetch)
const fetchCommits = asyncHandler(async (req, res) => {
  const { repoUrl, since } = req.body;

  if (!repoUrl) {
    throw new AppError('repoUrl is required', 400);
  }

  const { owner, repo } = githubService.parseRepoUrl(repoUrl);

  try {
    const commits = await githubService.fetchCommitsFromGitHub(owner, repo, since);
    success(res, { commits, count: commits.length });
  } catch (err) {
    if (err.status === 401 || err.message?.includes('Bad credentials')) {
      throw new AppError('GitHub token is missing or invalid. Please configure a valid GITHUB_TOKEN.', 401);
    }
    if (err.status === 404) {
      throw new AppError(`Repository ${owner}/${repo} not found on GitHub.`, 404);
    }
    if (err.status === 403) {
      throw new AppError('GitHub API rate limit exceeded. Try again later or configure a GITHUB_TOKEN.', 429);
    }
    throw err;
  }
});

module.exports = {
  syncRepoCommits,
  getCommitsByTeam,
  getCommitTimeline,
  fetchCommits,
};
