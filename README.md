# SkillSwap MVP

SkillSwap is a full-stack skill exchange MVP built with React, Vite, Express, and MongoDB. It lets users create profiles, browse members, publish learning posts, send swap requests, and manage notifications.

This repository is prepared to run locally with minimal setup:

- `npm install` installs both the frontend and backend dependencies
- `npm run dev` starts the frontend and backend together
- `npm test` runs a production build plus an API smoke test

## Credits

Project creators:

- Harsimran Singh
- Yashraj Deshmukh (Assistant Developer)

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind, MUI
- Backend: Express, Mongoose
- Local database: in-memory MongoDB by default for zero-config startup
- Optional database: MongoDB Atlas or any MongoDB connection string

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yashrajds/SkillSwapMVP.git
cd SkillSwapMVP
```

### 2. Install everything

```bash
npm install
```

### 3. Start the app

```bash
npm run dev
```

The app will be available at:

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000](http://localhost:5000)

Demo account for a quick tour:

- Email: `sophia@example.com`
- Password: `DemoPass123!`

## Default Local Behavior

The backend is configured to run out of the box with an in-memory MongoDB instance for local development. That means:

- no MongoDB install is required
- no Atlas account is required
- demo users, posts, requests, and notifications are seeded automatically on first boot
- data resets when the backend process stops

This makes the project easy to clone, run, and evaluate quickly.

## Environment Variables

### Frontend

Create a root `.env` file if you want to override the default API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

The included [.env.example](C:/Users/hp/Downloads/SkillSwap%20MVP/.env.example) already matches the local default.

### Backend

Backend settings live in `server/.env`.

You can start with the example file:

```bash
copy server\\.env.example server\\.env
```

Example values:

```env
MONGO_URI=
JWT_SECRET=change-me
PORT=5000
CLIENT_ORIGIN=http://localhost:5173,http://localhost:4173
USE_IN_MEMORY_DB=true
```

Notes:

- Leave `USE_IN_MEMORY_DB=true` for the easiest local setup.
- If `MONGO_URI` is empty, the app uses the in-memory database.
- Set `USE_IN_MEMORY_DB=false` and provide a real `MONGO_URI` if you want persistent data.

## Available Scripts

From the project root:

- `npm run dev` starts frontend and backend together
- `npm run dev:client` starts only the Vite frontend
- `npm run dev:server` starts only the backend in watch mode
- `npm run server` starts the backend without watch mode
- `npm run build` creates a production frontend build
- `npm test` runs the frontend build and backend smoke tests

## What Is Tested

`npm test` verifies:

- frontend production build succeeds
- backend boots successfully
- registration works
- login-protected profile access works
- member listing works
- post creation works
- post like toggling works
- swap creation works
- swap acceptance works
- notifications are returned

## Main API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/user`
- `GET /api/user/profile`
- `PUT /api/user/profile`
- `GET /api/posts`
- `POST /api/posts`
- `PUT /api/posts/:id/like`
- `PUT /api/posts/:id/save`
- `GET /api/swaps`
- `POST /api/swaps`
- `PUT /api/swaps/:id`
- `GET /api/notifications`
- `PUT /api/notifications/read-all`
- `PUT /api/notifications/:id/read`

## Publishing Notes

Before pushing or deploying:

- keep `.env` and `server/.env` out of version control
- replace `JWT_SECRET` with a strong secret in production
- set a real `MONGO_URI` if you need persistent data
- tighten `CLIENT_ORIGIN` to your deployed frontend URL

## Repository Status

This MVP has been cleaned up for publishing with:

- a root install flow that works from a fresh clone
- a single local run command
- a repeatable smoke test
- safer default local configuration
- seeded demo content for easier evaluation
