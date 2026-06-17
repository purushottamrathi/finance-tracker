export const TRANSACTION_TYPES = [
  { value: 'income', label: 'Income', color: '#22c55e', bg: 'bg-green-100', text: 'text-green-700' },
  { value: 'expense', label: 'Expense', color: '#ef4444', bg: 'bg-red-100', text: 'text-red-700' },
  { value: 'investment', label: 'Investment', color: '#3b82f6', bg: 'bg-blue-100', text: 'text-blue-700' },
  { value: 'savings', label: 'Savings', color: '#8b5cf6', bg: 'bg-violet-100', text: 'text-violet-700' },
  { value: 'rent', label: 'Rent', color: '#f97316', bg: 'bg-orange-100', text: 'text-orange-700' },
  { value: 'emi', label: 'EMI', color: '#f59e0b', bg: 'bg-amber-100', text: 'text-amber-700' },
  { value: 'insurance', label: 'Insurance', color: '#06b6d4', bg: 'bg-cyan-100', text: 'text-cyan-700' },
  { value: 'subscription', label: 'Subscription', color: '#ec4899', bg: 'bg-pink-100', text: 'text-pink-700' },
];

export const CATEGORIES = [
  { value: 'food', label: 'Food & Dining', emoji: '🍔' },
  { value: 'travel', label: 'Travel', emoji: '✈️' },
  { value: 'household', label: 'Household', emoji: '🏠' },
  { value: 'medical', label: 'Medical', emoji: '💊' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { value: 'education', label: 'Education', emoji: '📚' },
  { value: 'rent', label: 'Rent', emoji: '🏘️' },
  { value: 'emi', label: 'EMI', emoji: '🏦' },
  { value: 'insurance', label: 'Insurance', emoji: '🛡️' },
  { value: 'subscription', label: 'Subscription', emoji: '📱' },
  { value: 'salary', label: 'Salary', emoji: '💼' },
  { value: 'freelance', label: 'Freelance', emoji: '💻' },
  { value: 'sip', label: 'SIP', emoji: '📈' },
  { value: 'fd', label: 'Fixed Deposit', emoji: '🏧' },
  { value: 'other', label: 'Other', emoji: '📦' },
];

export const PAYMENT_METHODS = [
  { value: 'upi', label: 'UPI', emoji: '📲' },
  { value: 'cash', label: 'Cash', emoji: '💵' },
  { value: 'bank', label: 'Bank Transfer', emoji: '🏦' },
  { value: 'card', label: 'Card', emoji: '💳' },
];

export const PERIODS = [
  { value: 'monthly', label: 'This Month' },
  { value: 'quarterly', label: 'This Quarter' },
  { value: 'yearly', label: 'This Year' },
  { value: 'lifetime', label: 'All Time' },
];

export const INCOME_TYPES = ['income'];
export const EXPENSE_TYPES = ['expense', 'rent', 'emi', 'insurance', 'subscription'];
export const INVESTMENT_TYPES = ['investment', 'savings'];

export const getTypeConfig = (type: string) =>
  TRANSACTION_TYPES.find((t) => t.value === type) || TRANSACTION_TYPES[1];

export const getCategoryConfig = (cat: string) =>
  CATEGORIES.find((c) => c.value === cat) || CATEGORIES[14];

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const todayISO = () => new Date().toISOString().split('T')[0];
