const express = require('express');
const router = express.Router();
const {
  syncRepoCommits,
  getCommitsByTeam,
  getCommitTimeline,
  fetchCommits,
} = require('../controllers/github.controller');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/sync/:teamId', syncRepoCommits);
router.get('/commits/:teamId', getCommitsByTeam);
router.get('/timeline/:teamId', getCommitTimeline);
router.post('/fetch-commits', fetchCommits);

module.exports = router;
