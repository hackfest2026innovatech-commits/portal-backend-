const express = require('express');
const router = express.Router();
const {
  createForm,
  getForms,
  getFormById,
  submitResponse,
  getResponses,
  getResponsesByTeam,
} = require('../controllers/form.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../utils/constants');

router.use(auth);

router.route('/')
  .get(getForms)
  .post(authorize(ROLES.SUPERADMIN), createForm);

router.get('/responses/team/:teamId', getResponsesByTeam);

router.route('/:id')
  .get(getFormById);

router.route('/:id/responses')
  .get(getResponses)
  .post(submitResponse);

module.exports = router;
