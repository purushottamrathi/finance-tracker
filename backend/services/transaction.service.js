const Transaction = require('../models/Transaction');
const { EXPENSE_TYPES, INCOME_TYPES, INVESTMENT_TYPES } = require('../models/Transaction');

function getDateRange(period, year, month) {
  const now = new Date();
  const y = year || now.getFullYear();
  const m = month !== undefined ? month : now.getMonth(); // 0-indexed

  switch (period) {
    case 'monthly':
      return {
        $gte: new Date(y, m, 1),
        $lte: new Date(y, m + 1, 0, 23, 59, 59),
      };
    case 'quarterly': {
      const q = Math.floor(m / 3);
      return {
        $gte: new Date(y, q * 3, 1),
        $lte: new Date(y, q * 3 + 3, 0, 23, 59, 59),
      };
    }
    case 'yearly':
      return {
        $gte: new Date(y, 0, 1),
        $lte: new Date(y, 11, 31, 23, 59, 59),
      };
    default:
      return null; // lifetime
  }
}

async function getSummary(userId, period, year, month) {
  const dateRange = getDateRange(period, year, month);
  const match = { user: userId, ...(dateRange ? { date: dateRange } : {}) };

  const result = await Transaction.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        income: {
          $sum: { $cond: [{ $in: ['$type', INCOME_TYPES] }, '$amount', 0] },
        },
        expense: {
          $sum: { $cond: [{ $in: ['$type', EXPENSE_TYPES] }, '$amount', 0] },
        },
        investment: {
          $sum: { $cond: [{ $in: ['$type', INVESTMENT_TYPES] }, '$amount', 0] },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  const { income = 0, expense = 0, investment = 0, count = 0 } = result[0] || {};
  return {
    income,
    expense,
    investment,
    availableBalance: income - expense - investment,
    netWorth: income - expense + investment,
    count,
  };
}

async function getTransactions(userId, filters) {
  const { type, category, period, year, month, startDate, endDate } = filters;
  const match = { user: userId };

  if (type) match.type = type;
  if (category) match.category = category;

  if (startDate || endDate) {
    match.date = {};
    if (startDate) match.date.$gte = new Date(startDate);
    if (endDate) match.date.$lte = new Date(endDate);
  } else {
    const dateRange = getDateRange(period, year, month);
    if (dateRange) match.date = dateRange;
  }

  return Transaction.find(match).sort({ date: -1 }).lean();
}

async function getCategoryBreakdown(userId, period, year, month) {
  const dateRange = getDateRange(period, year, month);
  const match = {
    user: userId,
    type: { $in: EXPENSE_TYPES },
    ...(dateRange ? { date: dateRange } : {}),
  };

  return Transaction.aggregate([
    { $match: match },
    { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
  ]);
}

async function getPaymentMethodBreakdown(userId, period, year, month) {
  const dateRange = getDateRange(period, year, month);
  const match = {
    user: userId,
    ...(dateRange ? { date: dateRange } : {}),
  };

  return Transaction.aggregate([
    { $match: match },
    { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    { $sort: { total: -1 } },
  ]);
}

async function getDailySpending(userId, year, month) {
  const now = new Date();
  const y = year || now.getFullYear();
  const m = month !== undefined ? month : now.getMonth();

  return Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: { $in: EXPENSE_TYPES },
        date: { $gte: new Date(y, m, 1), $lte: new Date(y, m + 1, 0, 23, 59, 59) },
      },
    },
    {
      $group: {
        _id: { $dayOfMonth: '$date' },
        total: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
}

module.exports = { getSummary, getTransactions, getCategoryBreakdown, getPaymentMethodBreakdown, getDailySpending };
