const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');
const { EXPENSE_TYPES } = require('../models/Transaction');

async function getBudgetUsage(userId, category, month, year) {
  const budget = await Budget.findOne({ user: userId, category, month: month + 1, year });
  if (!budget) return null;

  const now = new Date();
  const y = year || now.getFullYear();
  const m = month !== undefined ? month : now.getMonth();

  const result = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        category,
        type: { $in: EXPENSE_TYPES },
        date: { $gte: new Date(y, m, 1), $lte: new Date(y, m + 1, 0, 23, 59, 59) },
      },
    },
    { $group: { _id: null, spent: { $sum: '$amount' } } },
  ]);

  const spent = result[0]?.spent || 0;
  const percentage = (spent / budget.limit) * 100;

  return {
    category,
    limit: budget.limit,
    spent,
    percentage: Math.round(percentage * 10) / 10,
    isWarning: percentage >= 80 && percentage < 100,
    isExceeded: percentage >= 100,
  };
}

async function getAllBudgetsWithUsage(userId, month, year) {
  const now = new Date();
  const y = year || now.getFullYear();
  const m = month !== undefined ? month : now.getMonth();

  const budgets = await Budget.find({ user: userId, month: m + 1, year: y }).lean();

  return Promise.all(
    budgets.map((b) => getBudgetUsage(userId, b.category, m, y))
  );
}

module.exports = { getBudgetUsage, getAllBudgetsWithUsage };
