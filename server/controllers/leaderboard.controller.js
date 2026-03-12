const mongoose = require('mongoose');
const Evaluation = require('../models/Evaluation');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middleware/asyncHandler');
const { success } = require('../utils/apiResponse');
const { generateCSV } = require('../services/export.service');

// GET /api/v1/leaderboard/:hackathonId
const getLeaderboard = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;

  const leaderboard = await Evaluation.aggregate([
    {
      $lookup: {
        from: 'teams',
        localField: 'teamId',
        foreignField: '_id',
        as: 'team',
      },
    },
    { $unwind: '$team' },
    {
      $match: {
        'team.hackathonId': hackathonId,
      },
    },
    {
      $group: {
        _id: '$teamId',
        teamName: { $first: '$team.teamName' },
        githubRepo: { $first: '$team.githubRepo' },
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
      $project: {
        _id: 0,
        teamId: '$_id',
        teamName: 1,
        githubRepo: 1,
        avgInnovation: { $round: ['$avgInnovation', 2] },
        avgTechnical: { $round: ['$avgTechnical', 2] },
        avgUiux: { $round: ['$avgUiux', 2] },
        avgPresentation: { $round: ['$avgPresentation', 2] },
        avgTotal: { $round: ['$avgTotal', 2] },
        evaluationCount: 1,
      },
    },
  ]);

  // Add rank
  const ranked = leaderboard.map((entry, index) => ({
    rank: index + 1,
    ...entry,
  }));

  success(res, { leaderboard: ranked });
});

// GET /api/v1/leaderboard/:hackathonId/export
const exportLeaderboardCSV = asyncHandler(async (req, res) => {
  const { hackathonId } = req.params;

  const leaderboard = await Evaluation.aggregate([
    {
      $lookup: {
        from: 'teams',
        localField: 'teamId',
        foreignField: '_id',
        as: 'team',
      },
    },
    { $unwind: '$team' },
    {
      $match: {
        'team.hackathonId': hackathonId,
      },
    },
    {
      $group: {
        _id: '$teamId',
        teamName: { $first: '$team.teamName' },
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
  ]);

  const data = leaderboard.map((entry, index) => ({
    rank: index + 1,
    teamName: entry.teamName,
    avgInnovation: entry.avgInnovation.toFixed(2),
    avgTechnical: entry.avgTechnical.toFixed(2),
    avgUiux: entry.avgUiux.toFixed(2),
    avgPresentation: entry.avgPresentation.toFixed(2),
    avgTotal: entry.avgTotal.toFixed(2),
    evaluationCount: entry.evaluationCount,
  }));

  const columns = [
    { id: 'rank', title: 'Rank' },
    { id: 'teamName', title: 'Team Name' },
    { id: 'avgInnovation', title: 'Avg Innovation' },
    { id: 'avgTechnical', title: 'Avg Technical' },
    { id: 'avgUiux', title: 'Avg UI/UX' },
    { id: 'avgPresentation', title: 'Avg Presentation' },
    { id: 'avgTotal', title: 'Avg Total' },
    { id: 'evaluationCount', title: 'Evaluations' },
  ];

  const csvBuffer = generateCSV(data, columns);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=leaderboard-${hackathonId}.csv`
  );
  res.send(csvBuffer);
});

module.exports = {
  getLeaderboard,
  exportLeaderboardCSV,
};
