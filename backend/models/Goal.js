const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  target: { type: Number, required: true },
  current: { type: Number, required: true },
});

module.exports = mongoose.model('Goal', GoalSchema);