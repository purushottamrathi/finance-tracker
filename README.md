# FinTracker — Personal Finance App

This repository contains a full-stack personal finance tracker: an Express/MongoDB backend and a Next.js + TypeScript frontend with PWA support.

Overview
- Backend: `backend/` — Express API, MongoDB models, cron jobs.
- Frontend: `frontend/` — Next.js app, service worker, PWA install UI.

Quick start (development)

Prerequisites:
- Node.js 18+ (matching `engines`)
- MongoDB running locally or accessible via `MONGODB_URI`

Commands:

```bash
# Start backend (in one terminal)
cd backend
npm install
npm run seed    # creates demo user (development only)
npm run dev

# Start frontend (in another terminal)
cd frontend
npm install
npm run dev
```

Environment variables
- Backend: create `.env` in `backend/`:
  - `MONGODB_URI` — MongoDB connection string
  - `CLIENT_URL` — frontend origin(s) for CORS (comma-separated)
  - `PORT` — optional (default 5000)
  - `NODE_ENV` — `development` or `production`
  - `JWT_SECRET`, `JWT_EXPIRES_IN` — authentication

- Frontend: in `frontend/.env` (or environment):
  - `NEXT_PUBLIC_API_URL` — e.g. `http://localhost:5000/api`

Seeding
- The backend `seed` script creates a demo user `demo+user@example.com` / `password123` and sample data. It refuses to run when `NODE_ENV=production`.

PWA notes
- Service worker is served at `/sw.js`. Manifest at `/manifest.json` (ensure `start_url` and `scope` include `/`).
- iOS requires manual `Share → Add to Home Screen` (no programmatic prompt).

Troubleshooting
- See `docs/429-troubleshooting.md` and `docs/PWA-troubleshooting.md` for common issues.

Next steps
- To run end-to-end tests, consider adding Playwright or Cypress tests. I can scaffold this if you want.
# finance-tracker
