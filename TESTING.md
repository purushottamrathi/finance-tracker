# Testing & QA

Manual smoke tests

1. Seed demo data (development only):

```bash
cd backend
npm run seed
```

2. Start servers and log in with `demo+user@example.com` / `password123`.

3. Verify key pages load: Dashboard, Transactions, Settings, Budgets.

Automated tests

- Consider adding Playwright or Cypress for end-to-end tests. Example scenarios:
  - User can login and view transactions
  - Create a transaction and see it listed
  - PWA install flow (desktop) via `beforeinstallprompt`

CI

- Run linting and tests on PRs. Add GitHub Actions (suggestion) to run `npm test`, `npm run build` for frontend, and `node --check` for backend.
