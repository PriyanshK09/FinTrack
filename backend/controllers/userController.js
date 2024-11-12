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

exports.cancelPremium = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          isPremium: false,
          'subscription.status': 'inactive',
          'subscription.plan': 'basic',
          'subscription.endDate': null
        }
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Premium membership cancelled successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error cancelling premium:', error);
    res.status(500).json({ message: 'Error cancelling premium membership' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};