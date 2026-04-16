# SkillSwap MVP

SkillSwap uses a Vite + React + TypeScript frontend and a modular Express + MongoDB backend inside [server](C:/Users/hp/Downloads/SkillSwap%20MVP/server).

## Local setup

1. Run `npm install` in `C:\Users\hp\Downloads\SkillSwap MVP`.
2. Run `npm install` in `C:\Users\hp\Downloads\SkillSwap MVP\server`.
3. Copy [server/.env.example](C:/Users/hp/Downloads/SkillSwap%20MVP/server/.env.example) to `server/.env`.
4. Copy [.env.example](C:/Users/hp/Downloads/SkillSwap%20MVP/.env.example) to `.env`.
5. Add your final MongoDB Atlas URI to `server/.env`.
6. Start the backend with `npm run dev` inside `server`, or `npm run server` from the root.
7. Start the frontend with `npm run dev` in the project root.

## API routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/user/profile`
- `PUT /api/user/profile`
- `POST /api/swaps`
- `GET /api/swaps`
- `PUT /api/swaps/:id`

## Frontend integration

- `src/app/services/authService.ts` handles register/login.
- `src/app/services/userService.ts` handles profile fetch/update.
- `src/app/services/swapService.ts` handles create/list/update for swap requests.
- `src/app/context/AuthContext.tsx` now persists JWT auth and session state.
- The existing `Login`, `Register`, `Profile`, and `Requests` pages are wired to the backend without changing their UI layout or styling.

## Deployment

### Backend on Render or Railway

1. Deploy the `server` folder as a Node service.
2. Set `MONGO_URI`, `JWT_SECRET`, and `PORT`.
3. Use `npm install` for install and `npm start` for start.
4. Update the allowed CORS origins before production if your frontend is not served from `http://localhost:5173`.

### Frontend on Vercel

1. Import the project root into Vercel.
2. Set `VITE_API_URL` to your deployed backend URL plus `/api`.
3. Use the standard Vite build command.

## Important note

The MongoDB string you shared still contains a placeholder password, so the backend scaffold is ready but the database connection should be considered pending until you provide the final Atlas URI.
