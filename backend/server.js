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

const app = express();

const isProd = process.env.NODE_ENV === 'production';
if (isProd) {
  // When behind a reverse proxy (nginx, load balancer), enable trust proxy
  app.set('trust proxy', 1);
}

console.log('Starting server in', process.env.NODE_ENV || 'development', 'mode');

app.use(helmet());
app.use(express.json());
const clientOrigins = (process.env.CLIENT_URL || 'http://localhost:3000').split(',').map(s => s.trim());
app.use(cors({
  origin: (origin, callback) => {
    // allow server-to-server or tools with no origin
    if (!origin) return callback(null, true);
    if (clientOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy: origin not allowed'));
  },
  credentials: true,
}));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true, legacyHeaders: false });

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/transactions', apiLimiter, transactionRoutes);
app.use('/api/analytics', apiLimiter, transactionRoutes);
app.use('/api/budgets', apiLimiter, budgetRoutes);
app.use('/api/settings', apiLimiter, settingsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    startRecurringJob();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => { console.error('DB connection failed:', err); process.exit(1); });
