const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  date: { type: Date, required: true },
  category: { type: String, required: true },
});

module.exports = mongoose.model('Transaction', TransactionSchema);