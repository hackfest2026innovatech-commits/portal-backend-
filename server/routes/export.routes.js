const express = require('express');
const router = express.Router();
const {
  exportTeamsCSV,
  exportScoresCSV,
  exportSubmissionsCSV,
} = require('../controllers/export.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../utils/constants');

router.use(auth);
router.use(authorize(ROLES.SUPERADMIN));

router.get('/teams', exportTeamsCSV);
router.get('/scores', exportScoresCSV);
router.get('/submissions', exportSubmissionsCSV);

module.exports = router;
