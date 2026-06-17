const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  targetAmount: { type: Number, required: true },
  monthlyTarget: { type: Number, default: 0 },
  targetDate: { type: Date },
  isActive: { type: Boolean, default: true },
  linkedAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', default: null },
  metadata: { type: Object, default: {} },
}, { timestamps: true });

goalSchema.index({ user: 1 });

module.exports = mongoose.model('Goal', goalSchema);
