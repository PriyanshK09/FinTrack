const User = require('../models/User');

exports.updateSettings = async (req, res) => {
  try {
    const { currency, region, notifications } = req.body;
    const updateData = {};

    if (currency) {
      updateData['settings.currency'] = currency;
    }
    if (region) {
      updateData['settings.region'] = region;
    }
    if (notifications !== undefined) {
      updateData['settings.notifications'] = notifications;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      ...user.toObject(),
      isPremium: user.isPremium || false
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data' });
  }
};