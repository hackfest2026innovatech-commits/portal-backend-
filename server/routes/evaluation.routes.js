const express = require('express');
const router = express.Router();
const {
  submitEvaluation,
  updateEvaluation,
  getEvaluationsByTeam,
  getJudgeAssignments,
  getScoreOverview,
} = require('../controllers/evaluation.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../utils/constants');

router.use(auth);

router.post('/', authorize(ROLES.JUDGE, ROLES.SUPERADMIN), submitEvaluation);
router.put('/:id', authorize(ROLES.JUDGE, ROLES.SUPERADMIN), updateEvaluation);
router.get('/assignments', authorize(ROLES.JUDGE, ROLES.SUPERADMIN), getJudgeAssignments);
router.get('/overview', authorize(ROLES.SUPERADMIN), getScoreOverview);
router.get('/team/:teamId', getEvaluationsByTeam);

module.exports = router;
