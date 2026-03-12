const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const teamRoutes = require('./team.routes');
const timerRoutes = require('./timer.routes');
const githubRoutes = require('./github.routes');
const notificationRoutes = require('./notification.routes');
const formRoutes = require('./form.routes');
const evaluationRoutes = require('./evaluation.routes');
const leaderboardRoutes = require('./leaderboard.routes');
const exportRoutes = require('./export.routes');
const adminRoutes = require('./admin.routes');

router.use('/auth', authRoutes);
router.use('/teams', teamRoutes);
router.use('/timer', timerRoutes);
router.use('/github', githubRoutes);
router.use('/notifications', notificationRoutes);
router.use('/forms', formRoutes);
router.use('/evaluations', evaluationRoutes);
router.use('/leaderboard', leaderboardRoutes);
router.use('/export', exportRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
