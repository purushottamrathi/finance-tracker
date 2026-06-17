const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  current: { type: Number, default: 0 },
  best: { type: Number, default: 0 },
  lastDate: { type: Date, default: null },
}, { timestamps: true });

streakSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Streak', streakSchema);
