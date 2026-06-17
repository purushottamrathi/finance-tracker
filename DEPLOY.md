# Deployment Checklist

Before deploying to production, verify:

- `NODE_ENV=production` and `MONGODB_URI` are set to production values.
- `CLIENT_URL` contains the exact frontend origin(s) for CORS (include `https://`).
- `JWT_SECRET` is set and kept secret.
- Build frontend and serve static files from the same root or ensure `sw.js` is served from `/sw.js` at site root.

Recommended steps

```bash
# Build frontend
cd frontend
npm install
npm run build

# On server or host, serve built frontend and start backend
cd backend
npm install --production
NODE_ENV=production node server.js
```

If using a platform (Vercel/Netlify for frontend, Heroku/DigitalOcean for backend), ensure the service worker file and manifest are deployed at the root path. Vercel sometimes serves app from a subpath — set `NEXT_PUBLIC_BASE_PATH` and ensure SW scope matches.
# Deploy checklist — keep local and production separate

1) Prepare env for production
   - Backend: set `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` (comma-separated allowed).
   - Frontend: set `NEXT_PUBLIC_API_URL` to the API base (e.g. `https://api.example.com/api`) if API is hosted separately. If frontend + API share the same domain, leave it blank to use same-origin `/api`.

2) Build and verify locally
   - Frontend build: `cd frontend && npm install && npm run build` (already validated).
   - Backend: ensure DB connection and env vars, then run `node server.js` or use your process manager.

3) Deploy steps
   - Upload backend code and set production env vars on the server.
   - Start backend with a process manager (PM2, systemd) or container.
   - Build frontend and serve the static output, or deploy via your hosting provider.

4) Verification
   - Confirm frontend can reach backend: open browser console and network tab, verify requests to `https://api.example.com/api` or to `/api` succeed (status 200/201).
   - Check auth flow: register/login, then call `/api/auth/me` to verify token exchange.
   - Check CORS: backend logs should show no CORS errors and requests from allowed origins should succeed.

5) Rollback
   - Keep last-known-good build artifact or Git tag.
   - If issues found, revert to previous tag/build and restart services.

6) Secrets & security
   - Do not commit real secrets; use secret manager or environment variables.
   - Rotate `JWT_SECRET` only if suspected compromised (requires users to re-login).

7) Troubleshooting tips
   - 401 responses: check `JWT_SECRET` consistency between token issuer and verifier.
   - CORS errors: ensure `CLIENT_URL` includes exact origin (protocol + host + port).
   - Frontend showing calls to `http://localhost:5000`: set `NEXT_PUBLIC_API_URL` in production or host frontend + API under same origin.
