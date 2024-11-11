const Investment = require('../models/Investment');

exports.getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.id });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addInvestment = async (req, res) => {
  const { name, type, amount, currentValue, returns } = req.body;

  try {
    const newInvestment = new Investment({
      user: req.user.id,
      name,
      type,
      amount,
      currentValue,
      returns,
    });

    const investment = await newInvestment.save();
    res.json(investment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};