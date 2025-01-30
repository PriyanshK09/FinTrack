// backend/models/Investment.js
const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, default: 'Stock' },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  change: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Investment', InvestmentSchema);