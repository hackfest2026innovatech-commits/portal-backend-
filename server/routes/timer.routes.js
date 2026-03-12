const express = require('express');
const router = express.Router();
const {
  getTimer,
  startTimer,
  pauseTimer,
  resetTimer,
} = require('../controllers/timer.controller');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { ROLES } = require('../utils/constants');

router.use(auth);

router.get('/', getTimer);
router.post('/start', authorize(ROLES.SUPERADMIN), startTimer);
router.post('/pause', authorize(ROLES.SUPERADMIN), pauseTimer);
router.post('/reset', authorize(ROLES.SUPERADMIN), resetTimer);

module.exports = router;
