# Hackathon Management Portal

A full-stack web application for managing hackathon events end-to-end — team registration, real-time collaboration, judge evaluations, GitHub integration, live leaderboards, and admin dashboards.

Built with **React + Vite** on the frontend and **Node.js + Express + MongoDB** on the backend, connected in real time via **Socket.io**.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Docker Setup](#docker-setup)
- [Database Seeding](#database-seeding)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [License](#license)

---

## Features

- **Authentication & Authorization** — JWT-based auth with role-based access control (superadmin, student, judge)
- **Team Management** — Create teams, join via invite codes, assign judges to teams
- **Real-time Timer** — Hackathon countdown timer with start, pause, and reset controls broadcast over WebSockets
- **Live Notifications** — Push notifications to all users or specific roles via Socket.io
- **Evaluation System** — Judges score teams against configurable criteria; admins view aggregate results
- **Dynamic Forms** — Admin-created submission, feedback, and checkpoint forms with team responses
- **GitHub Integration** — Sync and visualize commit activity per team repository
- **Leaderboard** — Live-updating leaderboard with CSV export
- **Admin Dashboard** — User management, statistics, and data exports (teams, scores, submissions)
- **Responsive UI** — Tailwind CSS design that works on desktop and mobile

---

## Tech Stack

| Layer        | Technology                                                    |
| ------------ | ------------------------------------------------------------- |
| Frontend     | React 18, React Router 6, Vite 5, Tailwind CSS 3             |
| Backend      | Node.js 20, Express 4, Socket.io 4                           |
| Database     | MongoDB 7, Mongoose 8                                        |
| Auth         | JSON Web Tokens (access + refresh), bcryptjs                  |
| Validation   | Joi                                                           |
| Dev Tools    | Nodemon, ESLint, PostCSS, Autoprefixer                       |
| Deployment   | Docker, Docker Compose, Nginx                                |

---

## Prerequisites

- **Node.js** 20+ and **npm** 9+
- **MongoDB** 7+ (local install or Docker)
- **Git** 2.x
- **Docker** and **Docker Compose** (optional, for containerised setup)

---

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/your-org/hackathon-portal.git
cd hackathon-portal
```

### 2. Configure environment variables

```bash
cp .env.example server/.env
```

Open `server/.env` and set real values for `JWT_SECRET`, `JWT_REFRESH_SECRET`, and optionally `GITHUB_TOKEN`.

### 3. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 4. Seed the database (optional)

```bash
cd server
node seed.js
```

This creates sample users, teams, a timer, and notifications. See [Database Seeding](#database-seeding) for details.

### 5. Start development servers

Open two terminal windows:

```bash
# Terminal 1 — Backend (port 5000)
cd server
npm run dev

# Terminal 2 — Frontend (port 5173)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Docker Setup

### Production

```bash
# Copy and configure environment
cp .env.example .env
# Edit .env with your secrets

# Build and start all services
docker compose up -d --build

# View logs
docker compose logs -f
```

The application will be available at:
- **Frontend:** [http://localhost](http://localhost) (port 80)
- **API:** [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- **MongoDB:** `localhost:27017`

### Development (with hot reload)

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

This mounts source directories as volumes and runs nodemon for the server and Vite dev server for the client, so file changes are reflected instantly.

### Useful Docker commands

```bash
# Stop all services
docker compose down

# Stop and remove volumes (clears database)
docker compose down -v

# Rebuild a specific service
docker compose build server

# Open a shell inside the server container
docker compose exec server sh

# Run the seeder inside Docker
docker compose exec server node seed.js
```

---

## Database Seeding

The seeder script (`server/seed.js`) populates the database with sample data for development and testing.

```bash
cd server
node seed.js
```

### Seeded credentials

| Email                 | Password      | Role       |
| --------------------- | ------------- | ---------- |
| admin@hackathon.com   | admin123      | superadmin |
| student1@test.com     | password123   | student    |
| student2@test.com     | password123   | student    |
| student3@test.com     | password123   | student    |
| judge1@test.com       | password123   | judge      |
| judge2@test.com       | password123   | judge      |

The seeder also creates two teams (Team Alpha, Team Beta), a 24-hour timer, and two sample notifications.

> **Warning:** Running the seeder clears all existing data in the database.

---

## Project Structure

```
portal/
├── client/                     # React frontend (Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route-level page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── context/            # React context providers
│   │   ├── services/           # API service modules (Axios)
│   │   ├── utils/              # Utility functions & constants
│   │   ├── App.jsx             # Root component with routing
│   │   └── main.jsx            # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express backend
│   ├── config/
│   │   ├── db.js               # MongoDB connection with retry logic
│   │   └── env.js              # Environment variable loader
│   ├── controllers/            # Route handlers
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication middleware
│   │   ├── authorize.js        # Role-based authorization
│   │   └── errorHandler.js     # Global error handler
│   ├── models/                 # Mongoose schemas
│   │   ├── User.js
│   │   ├── Team.js
│   │   ├── Timer.js
│   │   ├── Notification.js
│   │   ├── Evaluation.js
│   │   ├── Form.js
│   │   ├── FormResponse.js
│   │   ├── GitHubCommit.js
│   │   └── index.js
│   ├── routes/                 # Express route definitions
│   ├── services/               # Business logic services
│   ├── sockets/                # Socket.io event handlers
│   ├── utils/                  # Helpers, constants, custom errors
│   ├── seed.js                 # Database seeder
│   ├── server.js               # Application entry point
│   └── package.json
│
├── docker-compose.yml          # Production Docker orchestration
├── docker-compose.dev.yml      # Development overrides (hot reload)
├── Dockerfile.server           # Multi-stage server image
├── Dockerfile.client           # Multi-stage client image (Nginx)
├── nginx.conf                  # Nginx config with SPA fallback & proxy
├── .env.example                # Environment variable template
├── .gitignore
└── README.md
```

---

## API Endpoints

All endpoints are prefixed with `/api/v1`. Authenticated routes require a `Bearer` token in the `Authorization` header.

### Authentication

| Method | Endpoint              | Description              | Auth |
| ------ | --------------------- | ------------------------ | ---- |
| POST   | `/auth/register`      | Register a new user      | No   |
| POST   | `/auth/login`         | Login and receive tokens | No   |
| GET    | `/auth/me`            | Get current user profile | Yes  |
| POST   | `/auth/refresh-token` | Refresh access token     | No   |

### Teams

| Method | Endpoint                     | Description               | Auth  |
| ------ | ---------------------------- | ------------------------- | ----- |
| GET    | `/teams`                     | List all teams            | Yes   |
| POST   | `/teams`                     | Create a team             | Admin |
| GET    | `/teams/my-team`             | Get current user's team   | Yes   |
| POST   | `/teams/join`                | Join a team via invite    | Yes   |
| GET    | `/teams/:id`                 | Get team by ID            | Yes   |
| PUT    | `/teams/:id`                 | Update a team             | Admin |
| DELETE | `/teams/:id`                 | Delete a team             | Admin |
| PUT    | `/teams/:id/assign-judges`   | Assign judges to a team   | Admin |

### Timer

| Method | Endpoint        | Description       | Auth  |
| ------ | --------------- | ----------------- | ----- |
| GET    | `/timer`        | Get timer state   | Yes   |
| POST   | `/timer/start`  | Start the timer   | Admin |
| POST   | `/timer/pause`  | Pause the timer   | Admin |
| POST   | `/timer/reset`  | Reset the timer   | Admin |

### Notifications

| Method | Endpoint                 | Description              | Auth  |
| ------ | ------------------------ | ------------------------ | ----- |
| GET    | `/notifications`         | Get notifications        | Yes   |
| POST   | `/notifications`         | Create a notification    | Admin |
| PUT    | `/notifications/:id/read`| Mark as read             | Yes   |

### Forms

| Method | Endpoint                            | Description               | Auth  |
| ------ | ----------------------------------- | ------------------------- | ----- |
| GET    | `/forms`                            | List all forms            | Yes   |
| POST   | `/forms`                            | Create a form             | Admin |
| GET    | `/forms/:id`                        | Get form by ID            | Yes   |
| GET    | `/forms/:id/responses`              | Get responses for a form  | Yes   |
| POST   | `/forms/:id/responses`              | Submit a form response    | Yes   |
| GET    | `/forms/responses/team/:teamId`     | Get responses by team     | Yes   |

### Evaluations

| Method | Endpoint                    | Description                | Auth        |
| ------ | --------------------------- | -------------------------- | ----------- |
| POST   | `/evaluations`              | Submit an evaluation       | Judge/Admin |
| PUT    | `/evaluations/:id`          | Update an evaluation       | Judge/Admin |
| GET    | `/evaluations/assignments`  | Get judge assignments      | Judge/Admin |
| GET    | `/evaluations/overview`     | Score overview             | Admin       |
| GET    | `/evaluations/team/:teamId` | Get evaluations for a team | Yes         |

### Leaderboard

| Method | Endpoint                              | Description            | Auth |
| ------ | ------------------------------------- | ---------------------- | ---- |
| GET    | `/leaderboard/:hackathonId`           | Get leaderboard        | Yes  |
| GET    | `/leaderboard/:hackathonId/export`    | Export leaderboard CSV | Yes  |

### GitHub

| Method | Endpoint                    | Description               | Auth |
| ------ | --------------------------- | ------------------------- | ---- |
| POST   | `/github/sync/:teamId`     | Sync repo commits         | Yes  |
| GET    | `/github/commits/:teamId`  | Get commits by team       | Yes  |
| GET    | `/github/timeline/:teamId` | Get commit timeline       | Yes  |
| POST   | `/github/fetch-commits`    | Fetch commits             | Yes  |

### Admin

| Method | Endpoint                 | Description          | Auth  |
| ------ | ------------------------ | -------------------- | ----- |
| GET    | `/admin/stats`           | Dashboard statistics | Admin |
| GET    | `/admin/users`           | List all users       | Admin |
| PUT    | `/admin/users/:id/role`  | Update user role     | Admin |

### Exports

| Method | Endpoint               | Description         | Auth  |
| ------ | ---------------------- | ------------------- | ----- |
| GET    | `/export/teams`        | Export teams CSV     | Admin |
| GET    | `/export/scores`       | Export scores CSV    | Admin |
| GET    | `/export/submissions`  | Export submissions   | Admin |

### Health Check

| Method | Endpoint   | Description          | Auth |
| ------ | ---------- | -------------------- | ---- |
| GET    | `/health`  | Application health   | No   |

---

## Environment Variables

| Variable              | Required | Default                                   | Description                             |
| --------------------- | -------- | ----------------------------------------- | --------------------------------------- |
| `PORT`                | No       | `5000`                                    | Server port                             |
| `MONGO_URI`           | Yes      | —                                         | MongoDB connection string               |
| `JWT_SECRET`          | Yes      | —                                         | Secret for signing access tokens        |
| `JWT_REFRESH_SECRET`  | Yes      | —                                         | Secret for signing refresh tokens       |
| `GITHUB_TOKEN`        | No       | `""`                                      | GitHub personal access token            |
| `CLIENT_URL`          | No       | `http://localhost:5173`                   | Allowed CORS origin                     |
| `NODE_ENV`            | No       | `development`                             | `development` or `production`           |
| `VITE_API_URL`        | No       | `http://localhost:5000/api/v1`            | API base URL (used by client at build)  |
| `VITE_SOCKET_URL`     | No       | `http://localhost:5000`                   | Socket.io URL (used by client at build) |

---

## Deployment

### Frontend — Netlify

1. Connect the repository to [Netlify](https://netlify.com).
2. Set the build settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`
3. Add environment variables in Netlify's dashboard:
   - `VITE_API_URL` — your deployed backend URL (e.g. `https://api.yourdomain.com/api/v1`)
   - `VITE_SOCKET_URL` — your deployed backend URL (e.g. `https://api.yourdomain.com`)
4. Add a `client/_redirects` file for SPA routing:
   ```
   /*    /index.html   200
   ```

### Backend — Docker / Railway

#### Docker (self-hosted)

```bash
# Build production images
docker compose up -d --build

# The Nginx container serves the frontend on port 80
# and proxies /api and /socket.io to the server on port 5000
```

#### Railway

1. Create a new Railway project and connect the repository.
2. Set the root directory to `server`.
3. Add environment variables (`MONGO_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, etc.).
4. Railway will auto-detect Node.js and run `npm start`.
5. Provision a MongoDB plugin or use [MongoDB Atlas](https://www.mongodb.com/atlas).

#### MongoDB Atlas (recommended for production)

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Whitelist your server's IP address (or use `0.0.0.0/0` for Railway).
3. Copy the connection string and set it as `MONGO_URI`.

---

## License

ISC
