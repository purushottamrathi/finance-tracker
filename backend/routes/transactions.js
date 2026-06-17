const express = require('express');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const protect = require('../middleware/auth');
const { getBudgetUsage } = require('../services/budget.service');
const {
  getSummary,
  getTransactions,
  getCategoryBreakdown,
  getPaymentMethodBreakdown,
  getDailySpending,
} = require('../services/transaction.service');

const router = express.Router();
router.use(protect);

// GET /api/transactions/summary
router.get('/summary', async (req, res, next) => {
  try {
    const { period, year, month } = req.query;
    const summary = await getSummary(
      req.user._id,
      period,
      year ? parseInt(year) : undefined,
      month !== undefined ? parseInt(month) : undefined
    );
    res.json(summary);
  } catch (err) { next(err); }
});

// GET /api/analytics/categories
router.get('/categories', async (req, res, next) => {
  try {
    const { period, year, month } = req.query;
    const data = await getCategoryBreakdown(
      req.user._id,
      period,
      year ? parseInt(year) : undefined,
      month !== undefined ? parseInt(month) : undefined
    );
    res.json(data);
  } catch (err) { next(err); }
});

// GET /api/analytics/payment-methods
router.get('/payment-methods', async (req, res, next) => {
  try {
    const { period, year, month } = req.query;
    const data = await getPaymentMethodBreakdown(
      req.user._id,
      period,
      year ? parseInt(year) : undefined,
      month !== undefined ? parseInt(month) : undefined
    );
    res.json(data);
  } catch (err) { next(err); }
});

// GET /api/analytics/daily
router.get('/daily', async (req, res, next) => {
  try {
    const { year, month } = req.query;
    const data = await getDailySpending(
      req.user._id,
      year ? parseInt(year) : undefined,
      month !== undefined ? parseInt(month) : undefined
    );
    res.json(data);
  } catch (err) { next(err); }
});

// GET /api/transactions
router.get('/', async (req, res, next) => {
  try {
    const transactions = await getTransactions(req.user._id, req.query);
    res.json(transactions);
  } catch (err) { next(err); }
});

// POST /api/transactions
router.post('/', async (req, res, next) => {
  try {
    const { title, amount, type, category, paymentMethod, date, notes, isRecurring, recurringFrequency } = req.body;
    const transaction = await Transaction.create({
      user: req.user._id,
      title, amount, type, category, paymentMethod,
      account: req.body.account || null,
      date: date || new Date(),
      notes,
      isRecurring: isRecurring || false,
      recurringFrequency: isRecurring ? recurringFrequency : null,
      lastApplied: isRecurring ? new Date() : null,
    });

    // Check budget warning after adding expense-type transaction
    let budgetWarning = null;
    const now = new Date();
    const budgetUsage = await getBudgetUsage(req.user._id, category, now.getMonth(), now.getFullYear());
    if (budgetUsage) budgetWarning = budgetUsage;

    // Update account balance if provided
    try {
      if (transaction.account) {
        const Account = require('../models/Account');
        const acc = await Account.findById(transaction.account);
        if (acc) {
          // income increases, expenses decrease; investments treated as outflow (money moved to investment account assumed separate)
          const sign = ['income'].includes(transaction.type) ? 1 : -1;
          acc.balance = (acc.balance || 0) + sign * transaction.amount;
          await acc.save();
        }
      }
    } catch (e) { console.warn('Account update failed', e); }

    // Update investment streaks
    try {
      const Streak = require('../models/Streak');
      if (['investment','savings'].includes(transaction.type)) {
        const name = 'monthly-invest';
        const now = new Date();
        let s = await Streak.findOne({ user: req.user._id, name });
        if (!s) s = await Streak.create({ user: req.user._id, name, current: 0, best: 0, lastDate: null });
        // if lastDate is previous month (or same month) increment, else reset
        const last = s.lastDate ? new Date(s.lastDate) : null;
        const isSameOrPrevMonth = last && ( (now.getFullYear() === last.getFullYear() && now.getMonth() === last.getMonth()) || (now.getFullYear() === last.getFullYear() && now.getMonth() === last.getMonth() + 1) || (now.getFullYear() === last.getFullYear()+1 && last.getMonth()===11 && now.getMonth()===0) );
        if (isSameOrPrevMonth) s.current = s.current + 1; else s.current = 1;
        s.lastDate = now;
        if (s.current > s.best) s.best = s.current;
        await s.save();
      }
    } catch (e) { console.warn('Streak update failed', e); }

    res.status(201).json({ transaction, budgetWarning });
  } catch (err) { next(err); }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).json({ message: 'Invalid transaction ID' });

    const tx = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
