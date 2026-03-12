/**
 * Database Seeder for Hackathon Portal
 *
 * Creates sample users, teams, a timer, and notifications for development.
 *
 * Usage:
 *   node seed.js                          — uses MONGO_URI from .env
 *   MONGO_URI=mongodb://... node seed.js  — custom connection string
 */

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Import models
const User = require('./models/User');
const Team = require('./models/Team');
const Timer = require('./models/Timer');
const Notification = require('./models/Notification');
const Evaluation = require('./models/Evaluation');
const Form = require('./models/Form');
const FormResponse = require('./models/FormResponse');
const GitHubCommit = require('./models/GitHubCommit');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hackathon-portal';
const HACKATHON_ID = 'hackathon-2026';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(plain, salt);
}

function generateInviteCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

async function seed() {
  console.log('--------------------------------------------------');
  console.log('  Hackathon Portal — Database Seeder');
  console.log('--------------------------------------------------');
  console.log(`Connecting to: ${MONGO_URI}\n`);

  await mongoose.connect(MONGO_URI, { maxPoolSize: 5 });
  console.log('Connected to MongoDB.\n');

  // ---- Clear existing data ----
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Timer.deleteMany({}),
    Notification.deleteMany({}),
    Evaluation.deleteMany({}),
    Form.deleteMany({}),
    FormResponse.deleteMany({}),
    GitHubCommit.deleteMany({}),
  ]);
  console.log('All collections cleared.\n');

  // ---- Create Users (model pre-save hook handles password hashing) ----
  console.log('Creating users...');

  const superadmin = await User.create({
    name: 'Admin',
    email: 'admin@hackathon.com',
    password: 'admin123',
    role: 'superadmin',
  });

  const student1 = await User.create({
    name: 'Alice Johnson',
    email: 'student1@test.com',
    password: 'password123',
    role: 'student',
  });

  const student2 = await User.create({
    name: 'Bob Smith',
    email: 'student2@test.com',
    password: 'password123',
    role: 'student',
  });

  const student3 = await User.create({
    name: 'Charlie Brown',
    email: 'student3@test.com',
    password: 'password123',
    role: 'student',
  });

  const judge1 = await User.create({
    name: 'Dr. Sarah Williams',
    email: 'judge1@test.com',
    password: 'password123',
    role: 'judge',
  });

  const judge2 = await User.create({
    name: 'Prof. Michael Chen',
    email: 'judge2@test.com',
    password: 'password123',
    role: 'judge',
  });

  console.log('  - 1 superadmin created  (admin@hackathon.com / admin123)');
  console.log('  - 3 students created    (student[1-3]@test.com / password123)');
  console.log('  - 2 judges created      (judge[1-2]@test.com / password123)\n');

  // ---- Create Teams ----
  console.log('Creating teams...');

  const teamAlpha = await Team.create({
    teamName: 'Team Alpha',
    members: [
      { userId: student1._id, role: 'leader' },
      { userId: student2._id, role: 'member' },
    ],
    githubRepo: 'https://github.com/example/team-alpha',
    assignedJudges: [judge1._id],
    hackathonId: HACKATHON_ID,
    inviteCode: generateInviteCode(),
  });

  const teamBeta = await Team.create({
    teamName: 'Team Beta',
    members: [
      { userId: student3._id, role: 'leader' },
    ],
    githubRepo: 'https://github.com/example/team-beta',
    assignedJudges: [judge1._id, judge2._id],
    hackathonId: HACKATHON_ID,
    inviteCode: generateInviteCode(),
  });

  console.log(`  - Team Alpha (invite: ${teamAlpha.inviteCode}) — Alice (leader), Bob`);
  console.log(`  - Team Beta  (invite: ${teamBeta.inviteCode}) — Charlie (leader)\n`);

  // ---- Create Timer ----
  console.log('Creating timer...');

  await Timer.create({
    hackathonId: HACKATHON_ID,
    duration: 18000, // 5 hours in seconds
    startTime: null,
    isRunning: false,
    pausedAt: null,
    remainingTime: 18000,
  });

  console.log('  - Timer created (24 hours, not started)\n');

  // ---- Create Notifications ----
  console.log('Creating notifications...');

  await Notification.create({
    message: 'Welcome to the Hackathon Portal! Check your team assignments and get ready to build something amazing.',
    targetRole: 'all',
    hackathonId: HACKATHON_ID,
    readBy: [],
    createdBy: superadmin._id,
  });

  await Notification.create({
    message: 'Judging criteria have been published. Please review the evaluation rubric before submitting your scores.',
    targetRole: 'judge',
    hackathonId: HACKATHON_ID,
    readBy: [],
    createdBy: superadmin._id,
  });

  console.log('  - 2 notifications created\n');

  // ---- Summary ----
  console.log('==================================================');
  console.log('  Seed complete!');
  console.log('==================================================');
  console.log('');
  console.log('  Login credentials:');
  console.log('  ┌─────────────────────────┬──────────────┬────────────┐');
  console.log('  │ Email                   │ Password     │ Role       │');
  console.log('  ├─────────────────────────┼──────────────┼────────────┤');
  console.log('  │ admin@hackathon.com     │ admin123     │ superadmin │');
  console.log('  │ student1@test.com       │ password123  │ student    │');
  console.log('  │ student2@test.com       │ password123  │ student    │');
  console.log('  │ student3@test.com       │ password123  │ student    │');
  console.log('  │ judge1@test.com         │ password123  │ judge      │');
  console.log('  │ judge2@test.com         │ password123  │ judge      │');
  console.log('  └─────────────────────────┴──────────────┴────────────┘');
  console.log('');

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

seed().catch((err) => {
  console.error('Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
