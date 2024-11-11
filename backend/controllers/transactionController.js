const Transaction = require('../models/Transaction');

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addTransaction = async (req, res) => {
  const { description, amount, type, date, category } = req.body;

  try {
    const newTransaction = new Transaction({
      user: req.user.id,
      description,
      amount,
      type,
      date,
      category,
    });

    const transaction = await newTransaction.save();
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await transaction.remove();
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};