
     Context

     Purushottam wants to build a multi-user personal finance tracker from scratch. Users can log income, expenses,
     investments, savings, rent, EMI, subscriptions, and other transactions. The app must visualize spending trends,
     enforce budget limits with warnings, auto-apply recurring expenses monthly, and be installable as a PWA on mobile.

     Decided: Multi-user JWT auth · MongoDB Atlas · Vercel (frontend) + Render/Railway (backend)

     ---
     Project Structure

     FullStackApp/
     ├── backend/                        # Node.js + Express
     │   ├── models/
     │   │   ├── User.js
     │   │   ├── Transaction.js          ← shared enums exported here
     │   │   └── Budget.js
     │   ├── routes/
     │   │   ├── auth.js                 # register, login, /me
     │   │   ├── transactions.js         # CRUD + summary + analytics
     │   │   └── budgets.js              # CRUD + usage
     │   ├── services/
     │   │   ├── transaction.service.js  ← all aggregation/filter logic
     │   │   └── budget.service.js       ← usage % + warning thresholds
     │   ├── middleware/
     │   │   └── auth.js                 # JWT verify middleware
     │   ├── jobs/
     │   │   └── recurringTransactions.js  # node-cron monthly job
     │   ├── .env.example
     │   ├── server.js
     │   └── package.json
     │
     └── frontend/                       # Next.js 14 App Router
         ├── src/
         │   ├── app/
         │   │   ├── layout.tsx           # root layout + PWA meta
         │   │   ├── page.tsx             # redirect → /dashboard or /login
         │   │   ├── (auth)/login/page.tsx
         │   │   ├── (auth)/register/page.tsx
         │   │   ├── dashboard/page.tsx   # summary cards + quick-add
         │   │   ├── transactions/page.tsx
         │   │   ├── analytics/page.tsx
         │   │   └── settings/page.tsx    # budgets + recurring view
         │   ├── components/
         │   │   ├── dashboard/SummaryCards.tsx
         │   │   ├── dashboard/QuickAdd.tsx
         │   │   ├── transactions/TransactionForm.tsx
         │   │   ├── transactions/TransactionList.tsx
         │   │   ├── analytics/CategoryChart.tsx     # Recharts pie
         │   │   ├── analytics/TrendChart.tsx        # Recharts bar/line
         │   │   ├── analytics/PeriodFilter.tsx
         │   │   ├── budgets/BudgetCard.tsx
         │   │   └── ui/BottomNav.tsx                # mobile nav
         │   ├── context/
         │   │   └── AuthContext.tsx      ← JWT lifecycle, drives ProtectedRoute
         │   └── lib/
         │       ├── api.ts               ← axios instance + 401 interceptor
         │       └── constants.ts         # categories, types, payment methods
         ├── public/
         │   ├── manifest.json
         │   └── icons/icon-192.png, icon-512.png
         ├── next.config.js               # next-pwa config
         └── package.json

     ---
     Data Models

     Transaction

     {
       user: ObjectId (ref: User),
       title: String (required),
       amount: Number (required, > 0),
       type: enum ['income', 'expense', 'investment', 'savings',
                   'rent', 'emi', 'insurance', 'subscription'],
       category: enum ['food', 'travel', 'household', 'medical',
                       'entertainment', 'education', 'rent', 'emi',
                       'insurance', 'subscription', 'salary',
                       'freelance', 'sip', 'fd', 'other'],
       paymentMethod: enum ['cash', 'upi', 'bank', 'card'],
       date: Date (default: now),
       notes: String,
       isRecurring: Boolean (default: false),
       recurringFrequency: enum ['monthly', 'quarterly', 'yearly', null],
       lastApplied: Date     // cron uses this to avoid double-applying
     }

     Budget

     { user, category, limit: Number, month: Number, year: Number }

     ---
     API Routes

     ┌────────┬────────────────────────────────┬──────┬────────────────────────────────────────────────────────────┐
     │ Method │              Path              │ Auth │                        Description                         │
     ├────────┼────────────────────────────────┼──────┼────────────────────────────────────────────────────────────┤
     │ POST   │ /api/auth/register             │ —    │ Create account                                             │
     ├────────┼────────────────────────────────┼──────┼────────────────────────────────────────────────────────────┤
     │ POST   │ /api/auth/login                │ —    │ Return JWT                                                 │
     ├────────┼────────────────────────────────┼──────┼────────────────────────────────────────────────────────────┤
     │ GET    │ /api/auth/me                   │ ✓    │ Current user                                               │
     ├────────┼────────────────────────────────┼──────┼────────────────────────────────────────────────────────────┤
     │ GET    │ /api/transactions              │ ✓    │ List (filters: type, category, period, startDate, endDate) │
     ├────────┼────────────────────────────────┼──────┼────────────────────────────────────────────────────────────┤
     │ POST   │ /api/transactions              │ ✓    │ Add transaction; returns budget warning if exceeded        │
     ├────────┼────────────────────────────────┼──────┼────────────────────────────────────────────────────────────┤
     │ DELETE │ /api/transactions/:id          │ ✓    │ Delete                                                     │
     ├────────┼────────────────────────────────┼──────┼────────────────────────────────────────────────────────────┤
     │ GET    │ /api/transactions/summary      │ ✓    │ Income/expense/investment totals + formulas                │
     ├────────┼────────────────────────────────┼──────┼────────────────────────────────────────────────────────────┤
     │ GET    │ /api/analytics/categories      │ ✓    │ Expense breakdown by category                              │
     ├────────┼────────────────────────────────┼──────┼────────────────────────────────────────────────────────────┤
     │ GET    │ /api/analytics/payment-methods │ ✓    │ All transactions by payment method                         │
     ├────────┼────────────────────────────────┼──────┼────────────────────────────────────────────────────────────┤
     │ GET    │ /api/analytics/daily           │ ✓    │ Daily spend for given month/year                           │
     ├────────┼────────────────────────────────┼──────┼────────────────────────────────────────────────────────────┤
     │ GET    │ /api/budgets                   │ ✓    │ List with current usage %                                  │
     ├────────┼────────────────────────────────┼──────┼────────────────────────────────────────────────────────────┤
     │ POST   │ /api/budgets                   │ ✓    │ Set budget limit                                           │
     ├────────┼────────────────────────────────┼──────┼────────────────────────────────────────────────────────────┤
     │ PUT    │ /api/budgets/:id               │ ✓    │ Update limit                                               │
     └────────┴────────────────────────────────┴──────┴────────────────────────────────────────────────────────────┘

     ---
     Key Formulas (server-side in transaction.service.js)

     - Available Balance = income − expense − investment
     - Net Worth = income − expense + investment  (investments are assets)
     - Types rent, emi, insurance, subscription roll into the expense bucket

     ---
     Budget Warning Logic (budget.service.js)

     - isWarning = usage ≥ 80% and < 100%
     - isExceeded = usage ≥ 100%
     - Only outflow types count against budgets (expense/rent/emi/subscription/insurance)

     ---
     Recurring Cron (jobs/recurringTransactions.js)

     - Runs 0 5 1 * * (00:05 on 1st of each month, Asia/Kolkata)
     - Finds transactions where isRecurring: true and lastApplied < start of current month
     - Clones them as non-recurring copies, updates lastApplied on the template

     ---
     PWA Setup

     - next-pwa package wraps next.config.js
     - NetworkFirst caching strategy, disabled in development
     - manifest.json with start_url: /dashboard, display: standalone
     - Icons at public/icons/icon-192.png and icon-512.png

     ---
     Auth

     - JWT stored in localStorage under finance_token
     - Axios interceptor in lib/api.ts attaches Authorization: Bearer <token> on every request
     - On 401 response → clear storage → redirect to /login

     ---
     Security & Middleware

     - express-rate-limit: auth routes (20 req/15 min), API routes (200 req/15 min)
     - cors({ origin: CLIENT_URL, credentials: true }) — set to Vercel URL in prod
     - helmet for HTTP security headers
     - All routes require JWT middleware; no user can access another user's data

     ---
     Implementation Order

     1. Backend scaffolding (Express, middleware, error handler)
     2. MongoDB models (User, Transaction, Budget)
     3. JWT middleware
     4. Auth routes (register/login/me)
     5. Transaction CRUD + summary + analytics routes + services
     6. Budget CRUD + usage routes + service
     7. Recurring cron job
     8. Backend .env.example + Render deploy config
     9. Frontend scaffolding (Next.js, TypeScript, Tailwind, constants, axios)
     10. AuthContext + ProtectedRoute
     11. Login + Register pages
     12. App layout (Topbar + BottomNav mobile)
     13. Dashboard (SummaryCards + QuickAdd + PeriodFilter)
     14. Transactions page (form + list)
     15. Analytics page (CategoryChart + TrendChart + daily summary)
     16. Settings/Budgets page (BudgetCard + usage bars)
     17. PWA config (next-pwa + manifest + icons)
     18. Root .gitignore + README.md

     ---
     Verification

     1. cd backend && npm run dev → server starts on :5000
     2. POST /api/auth/register → 201 with JWT
     3. POST /api/transactions → 201; test budget warning fires at 80%
     4. GET /api/transactions/summary?period=monthly → correct totals
     5. cd frontend && npm run dev → app opens on :3000
     6. Register → redirected to dashboard, summary cards show 0
     7. Add income → green card updates
     8. Add expense > budget limit → warning banner visible
     9. npm run build → public/sw.js generated (PWA artifact)
     10. Chrome DevTools → Application → Manifest → installable prompt appears