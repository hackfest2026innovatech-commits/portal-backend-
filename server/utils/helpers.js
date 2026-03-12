const crypto = require('crypto');

function generateInviteCode(length = 8) {
  return crypto.randomBytes(length).toString('hex').slice(0, length).toUpperCase();
}

function calculateTimeRemaining(startTime, durationSeconds) {
  if (!startTime || !durationSeconds) {
    return 0;
  }
  const elapsed = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
  const remaining = durationSeconds - elapsed;
  return Math.max(0, remaining);
}

module.exports = {
  generateInviteCode,
  calculateTimeRemaining,
};
