const mongoose = require('mongoose');

const ACCOUNT_TYPES = ['savings', 'checking', 'wallet', 'investment', 'credit'];

const accountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ACCOUNT_TYPES, default: 'savings' },
  balance: { type: Number, default: 0 },
  currency: { type: String, default: 'INR' },
  metadata: { type: Object, default: {} },
}, { timestamps: true });

accountSchema.index({ user: 1 });

module.exports = mongoose.model('Account', accountSchema);
module.exports.ACCOUNT_TYPES = ACCOUNT_TYPES;
