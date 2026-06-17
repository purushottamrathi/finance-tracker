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
