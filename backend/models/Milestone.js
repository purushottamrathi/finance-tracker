const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  key: { type: String, required: true },
  description: { type: String, default: '' },
  thresholdAmount: { type: Number, required: true },
  achievedAt: { type: Date, default: null },
  reward: { type: String, default: '' },
}, { timestamps: true });

milestoneSchema.index({ user: 1, key: 1 }, { unique: true });

module.exports = mongoose.model('Milestone', milestoneSchema);
