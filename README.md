<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This repository contains both the Vite frontend and the Express-based AI backend used by the Tiwaton Adventure experience.

View your app in AI Studio: https://ai.studio/apps/drive/1T7G0hxnyDfG2Y9G39VmbD8P-3k0YPb0l

## Run Locally

### Prerequisites
1. Node.js (>=18 recommended)
2. A valid `GEMINI_API_KEY` from Google’s GenAI Console

### Install & start
1. Install dependencies:
   `npm install`
2. Populate the backend env file: copy `server/.env.example` to `server/.env` and fill in your `GEMINI_API_KEY` + any additional CORS origins.
3. Populate the frontend env file: copy `.env.example` to `.env.local` and swap in your Firebase + API URLs (`VITE_API_BASE_URL` should point to your backend).
4. Start the backend (required before hitting `/api`):
   `npm run backend`
5. Start the frontend (automatically proxies `/api` to the backend while developing):
   `npm run frontend`

### Environment overview
- `server/.env` (also generated from `.env.example`): `PORT`, `NODE_ENV`, `CORS_ORIGIN`, `GEMINI_API_KEY`. The backend loads this file first, then falls back to the project root `.env` if present. Keep it out of version control.
- `.env.local`: used by Vite to inject `VITE_*` keys into the client. Add Firebase config, `VITE_API_BASE_URL`, and optional `VITE_API_TIMEOUT_MS`.

## Build for production
- Frontend: `npm run build` (outputs to `dist/`, which Vercel deploys).
- Backend: `node server/index.cjs` (Render runs it via the root-level `index.cjs` entrypoint so it can start inside `/server`).

## Deployment notes

### Render (API/backend)
- Environment: Web Service
- Root directory: `.`
- Build command: `npm install`
- Start command: `node index.cjs`
- Environment variables:
  - `GEMINI_API_KEY` (required)
  - `CORS_ORIGIN` (comma-separated list of every domain you expect to call the backend, e.g. `https://tiwaton-adventure.vercel.app,https://tiwaton-adventure-git-main.vercel.app`)
  - `NODE_ENV=production`
  - Do not manually set `PORT` (Render injects it automatically).

### Vercel (frontend)
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment variables:
  - `VITE_API_BASE_URL=https://tiwaton-api.onrender.com` (set to your Render URL)
  - Optional: `VITE_API_TIMEOUT_MS`, Firebase keys matching those in `.env.example`
  - Make sure the CORS origins above include every Vercel preview URL you plan to use.

## Health check
- Backend health: `GET /api/health` (returns `{ ok: true }`)
- Make sure `VITE_API_BASE_URL` aligns with the deployed backend so the quiz, story, and coloring routes work on the production UI.
