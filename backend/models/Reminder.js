const mongoose = require('mongoose');

const REMINDER_TYPES = ['bill', 'sip', 'tax', 'custom'];

const reminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: REMINDER_TYPES, default: 'custom' },
  date: { type: Date, required: true },
  repeat: { type: String, enum: ['none','daily','weekly','monthly','yearly'], default: 'none' },
  isActive: { type: Boolean, default: true },
  metadata: { type: Object, default: {} },
}, { timestamps: true });

reminderSchema.index({ user: 1, date: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);
module.exports.REMINDER_TYPES = REMINDER_TYPES;
