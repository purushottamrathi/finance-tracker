require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const UserSettings = require('../models/UserSettings');
const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set in env. Aborting.');
    process.exit(1);
  }

  if (process.env.NODE_ENV === 'production') {
    console.error('Refusing to seed production database. Set NODE_ENV!=production to proceed.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  // clear test user if exists
  const email = 'demo+user@example.com';
  await User.deleteOne({ email });
  const user = await User.create({ name: 'Demo User', email, password: 'password123' });
  console.log('Created user:', user.email);

  // create settings
  await UserSettings.deleteMany({ user: user._id });
  const settings = await UserSettings.create({ user: user._id, startingBalance: 1000, monthlyBudget: 2000 });
  console.log('Created settings');

  // create budgets
  await Budget.deleteMany({ user: user._id });
  const budgets = [
    { user: user._id, category: 'food', limit: 300, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
    { user: user._id, category: 'rent', limit: 800, month: new Date().getMonth() + 1, year: new Date().getFullYear() },
  ];
  await Budget.insertMany(budgets);
  console.log('Inserted budgets');

  // create transactions
  await Transaction.deleteMany({ user: user._id });
  const now = new Date();
  const transactions = [
    { user: user._id, title: 'Salary', amount: 3000, type: 'income', category: 'salary', paymentMethod: 'bank', date: now },
    { user: user._id, title: 'Grocery', amount: 45.5, type: 'expense', category: 'food', paymentMethod: 'card', date: now },
    { user: user._id, title: 'Movie', amount: 12, type: 'expense', category: 'entertainment', paymentMethod: 'upi', date: now },
    { user: user._id, title: 'Rent Payment', amount: 800, type: 'rent', category: 'rent', paymentMethod: 'bank', date: now },
  ];
  await Transaction.insertMany(transactions);
  console.log('Inserted transactions');

  console.log('Seed completed. Demo user credentials: demo+user@example.com / password123');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
