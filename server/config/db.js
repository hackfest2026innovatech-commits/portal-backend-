const mongoose = require('mongoose');
const dns = require('dns');
const { MONGO_URI, NODE_ENV } = require('./env');

// Force Google DNS to avoid university/ISP DNS blocking SRV lookups
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

async function connectDB() {
  // First try the configured MONGO_URI (Atlas or local)
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return;
  } catch (err) {
    console.error(`MongoDB Atlas connection failed: ${err.message}`);
  }

  // Fallback: use in-memory MongoDB for development
  if (NODE_ENV === 'development' || NODE_ENV === undefined) {
    console.log('Starting in-memory MongoDB for development...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri, { maxPoolSize: 10 });
      console.log(`In-memory MongoDB connected: ${memUri}`);
      console.log('WARNING: Data will NOT persist after server restart.');
      console.log('To use persistent storage, fix your Atlas connection or install MongoDB locally.');

      // Seed default data for development
      await seedDefaultData();
      return;
    } catch (memErr) {
      console.error('In-memory MongoDB also failed:', memErr.message);
    }
  }

  console.error('Could not connect to any MongoDB instance. API calls will fail.');
}

async function seedDefaultData() {
  const User = require('../models/User');
  const Team = require('../models/Team');
  const Timer = require('../models/Timer');
  const Notification = require('../models/Notification');

  // Only seed if empty
  const userCount = await User.countDocuments();
  if (userCount > 0) return;

  console.log('Seeding default data...');

  // Create users
  const admin = await User.create({
    name: 'Super Admin',
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
    name: 'Dr. Sarah Wilson',
    email: 'judge1@test.com',
    password: 'password123',
    role: 'judge',
  });

  const judge2 = await User.create({
    name: 'Prof. James Lee',
    email: 'judge2@test.com',
    password: 'password123',
    role: 'judge',
  });

  // Create teams
  await Team.create({
    teamName: 'Team Alpha',
    members: [
      { userId: student1._id, role: 'leader' },
      { userId: student2._id, role: 'member' },
    ],
    githubRepo: 'https://github.com/octocat/Hello-World',
    assignedJudges: [judge1._id],
    hackathonId: 'hackfest-2026',
  });

  await Team.create({
    teamName: 'Team Beta',
    members: [
      { userId: student3._id, role: 'leader' },
    ],
    githubRepo: '',
    assignedJudges: [judge2._id],
    hackathonId: 'hackfest-2026',
  });

  // Create timer
  await Timer.create({
    hackathonId: 'hackfest-2026',
    duration: 18000,
    isRunning: false,
  });

  // Create notification
  await Notification.create({
    message: 'Welcome to HackFest 2026! Get ready to build something amazing.',
    targetRole: 'all',
    hackathonId: 'hackfest-2026',
    createdBy: admin._id,
  });

  console.log('Default data seeded successfully!');
  console.log('  Admin:   admin@hackathon.com / admin123');
  console.log('  Student: student1@test.com / password123');
  console.log('  Judge:   judge1@test.com / password123');
}

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose connection disconnected.');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('Mongoose connection closed due to app termination.');
  process.exit(0);
});

module.exports = connectDB;
