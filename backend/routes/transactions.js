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
