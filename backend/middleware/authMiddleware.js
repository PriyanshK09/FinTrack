const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      console.error('No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log('Token decoded for user:', decoded.id);
      
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        console.error('User not found for token');
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = authMiddleware;