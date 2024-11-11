const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  currentValue: { type: Number, required: true },
  returns: { type: Number, required: true },
});

module.exports = mongoose.model('Investment', InvestmentSchema);