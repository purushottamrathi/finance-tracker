# Backend — FinTracker

Quick notes for running and debugging the backend server.

## Start

Install deps and run:

```bash
cd backend
npm install
npm run dev   # or `node server.js` for production
```

## Required environment variables

- `PORT` (default 5000)
- `MONGODB_URI` — connection string
- `CLIENT_URL` — comma-separated origins allowed for CORS (e.g. `http://localhost:3000,https://app.example.com`)
- `NODE_ENV` — `development` or `production`

Example `.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fintracker
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## CORS

The server uses `cors()` with `CLIENT_URL`. Ensure the exact origin is listed in `CLIENT_URL` (including scheme and port). Wildcards like `.vercel.app` are supported by the custom origin-check helper in `server.js`.

## Rate limiting

The app uses `express-rate-limit` (configured in `server.js`):

- `authLimiter`: 20 requests per 15 minutes for auth routes.
- `apiLimiter`: 200 requests per 15 minutes for API routes.

If you see `429 Too Many Requests` in the browser, first confirm whether the client is making many repeated requests. Increasing the server limit is a quick temporary fix — adjust `max` in `server.js` (not recommended for production without understanding client behaviour).

Example: increase API limit (in `server.js`):

```js
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 });
```

Or skip limiting for localhost during development:

```js
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  skip: (req) => req.ip === '::1' || req.hostname === 'localhost'
});
```

For distributed deployments, use a shared store (Redis) for rate limiter persistence.

## Health check

GET `/api/health` should return a simple OK response. Use this for uptime checks.

## Logs

The server logs SW & registration messages and errors to the console. Tail the logs when diagnosing client 429s.

## Seeding (development)

Create demo data locally with:

```bash
cd backend
npm run seed
```

This will create a demo user `demo+user@example.com` / `password123` and sample budgets and transactions. The script refuses to run when `NODE_ENV=production`.
