require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const startRecurringJob = require('./jobs/recurringTransactions');

const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');
const settingsRoutes = require('./routes/settings');
const healthRoutes = require('./routes/health');

const app = express();

const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
  // When behind a reverse proxy (nginx, load balancer), enable trust proxy
  app.set('trust proxy', 1);
}

console.log('Starting server in', process.env.NODE_ENV || 'development', 'mode');

app.use(helmet());
app.use(express.json());
const clientOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function isOriginAllowed(origin) {
  if (!origin) return true; // allow server-to-server requests
  if (clientOrigins.includes(origin)) return true;
  for (const o of clientOrigins) {
    if (o === '*') return true;
    // support entries like '.vercel.app' or '*.vercel.app' to match subdomains
    if (o.startsWith('*.') && origin.endsWith(o.slice(1))) return true;
    if (o.startsWith('.') && origin.endsWith(o)) return true;
  }
  return false;
}

app.use(cors({
  origin: true,
  credentials: true
}));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/transactions', apiLimiter, transactionRoutes);
app.use('/api/analytics', apiLimiter, transactionRoutes);
app.use('/api/budgets', apiLimiter, budgetRoutes);
app.use('/api/settings', apiLimiter, settingsRoutes);
app.use('/api/health', healthRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    startRecurringJob();
  })
  .catch(err => { console.error('DB connection failed:', err); process.exit(1); });
