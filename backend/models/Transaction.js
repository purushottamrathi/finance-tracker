const mongoose = require('mongoose');

const TYPES = ['income', 'expense', 'investment', 'savings', 'rent', 'emi', 'insurance', 'subscription'];
const CATEGORIES = [
  'food', 'travel', 'household', 'medical', 'entertainment', 'education',
  'rent', 'emi', 'insurance', 'subscription', 'salary', 'freelance',
  'sip', 'fd', 'other',
];
const PAYMENT_METHODS = ['cash', 'upi', 'bank', 'card'];
const RECURRING_FREQUENCIES = ['monthly', 'quarterly', 'yearly'];

// Types considered as outflows for budgeting
const EXPENSE_TYPES = ['expense', 'rent', 'emi', 'insurance', 'subscription'];
// Types considered as income
const INCOME_TYPES = ['income'];
// Types considered as investments (assets)
const INVESTMENT_TYPES = ['investment', 'savings'];

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0.01 },
  type: { type: String, enum: TYPES, required: true },
  category: { type: String, enum: CATEGORIES, required: true },
  paymentMethod: { type: String, enum: PAYMENT_METHODS, required: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', default: null },
  date: { type: Date, default: Date.now },
  notes: { type: String, trim: true, default: '' },
  isRecurring: { type: Boolean, default: false },
  recurringFrequency: { type: String, enum: RECURRING_FREQUENCIES, default: null },
  lastApplied: { type: Date, default: null },
}, { timestamps: true });

transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
module.exports.TYPES = TYPES;
module.exports.CATEGORIES = CATEGORIES;
module.exports.PAYMENT_METHODS = PAYMENT_METHODS;
module.exports.EXPENSE_TYPES = EXPENSE_TYPES;
module.exports.INCOME_TYPES = INCOME_TYPES;
module.exports.INVESTMENT_TYPES = INVESTMENT_TYPES;
