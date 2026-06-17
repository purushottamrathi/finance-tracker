const express = require('express');
const Budget = require('../models/Budget');
const protect = require('../middleware/auth');
const { getAllBudgetsWithUsage } = require('../services/budget.service');

const router = express.Router();
router.use(protect);

// GET /api/budgets
router.get('/', async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const m = month !== undefined ? parseInt(month) : now.getMonth();
    const y = year ? parseInt(year) : now.getFullYear();
    const budgets = await getAllBudgetsWithUsage(req.user._id, m, y);
    res.json(budgets.filter(Boolean));
  } catch (err) { next(err); }
});

// POST /api/budgets
router.post('/', async (req, res, next) => {
  try {
    const { category, limit, month, year } = req.body;
    const now = new Date();
    const budget = await Budget.findOneAndUpdate(
      {
        user: req.user._id,
        category,
        month: month || now.getMonth() + 1,
        year: year || now.getFullYear(),
      },
      { limit },
      { upsert: true, new: true }
    );
    res.status(201).json(budget);
  } catch (err) { next(err); }
});

// PUT /api/budgets/:id
router.put('/:id', async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { limit: req.body.limit },
      { new: true }
    );
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json(budget);
  } catch (err) { next(err); }
});

// DELETE /api/budgets/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json({ message: 'Budget deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
