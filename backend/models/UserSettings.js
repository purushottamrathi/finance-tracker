const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  startingBalance: { type: Number, default: 0, min: 0 },
  monthlyBudget: { type: Number, default: 0, min: 0 },
  dashboardLayout: { type: [String], default: ['recommendations','simulator','accounts','milestones','reminders'] },
}, { timestamps: true });

module.exports = mongoose.model('UserSettings', userSettingsSchema);
