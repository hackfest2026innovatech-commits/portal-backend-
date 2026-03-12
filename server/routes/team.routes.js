const express = require('express');
const router = express.Router();
const {
  createTeam,
  getAllTeams,
  getTeamById,
  joinTeam,
  assignJudges,
  updateTeam,
  deleteTeam,
  getMyTeam,
} = require('../controllers/team.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../utils/constants');

router.use(auth);

router.get('/my-team', getMyTeam);
router.post('/join', joinTeam);

router.route('/')
  .get(getAllTeams)
  .post(authorize(ROLES.SUPERADMIN), createTeam);

router.route('/:id')
  .get(getTeamById)
  .put(authorize(ROLES.SUPERADMIN), updateTeam)
  .delete(authorize(ROLES.SUPERADMIN), deleteTeam);

router.put('/:id/assign-judges', authorize(ROLES.SUPERADMIN), assignJudges);

module.exports = router;
