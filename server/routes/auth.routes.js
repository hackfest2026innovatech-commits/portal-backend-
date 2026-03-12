const express = require('express');
const router = express.Router();
const { register, login, getMe, refreshToken } = require('../controllers/auth.controller');
const auth = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.post('/refresh-token', refreshToken);

module.exports = router;
