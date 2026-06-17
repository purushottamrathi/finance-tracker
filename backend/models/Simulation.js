const mongoose = require('mongoose');

const simulationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  params: { type: Object, default: {} },
  results: { type: Object, default: {} },
}, { timestamps: true });

simulationSchema.index({ user: 1 });

module.exports = mongoose.model('Simulation', simulationSchema);
