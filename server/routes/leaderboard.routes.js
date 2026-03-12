const express = require('express');
const router = express.Router();
const {
  getLeaderboard,
  exportLeaderboardCSV,
} = require('../controllers/leaderboard.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/:hackathonId', getLeaderboard);
router.get('/:hackathonId/export', exportLeaderboardCSV);

module.exports = router;
