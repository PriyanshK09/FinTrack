const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  settings: {
    currency: {
      code: { type: String, default: 'INR' },
      symbol: { type: String, default: '₹' }
    },
    region: {
      code: { type: String, default: 'IN' },
      name: { type: String, default: 'India' }
    },
    notifications: {
      type: Boolean,
      default: true
    }
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  subscription: {
    status: {
      type: String,
      enum: ['inactive', 'active'],
      default: 'inactive'
    },
    plan: {
      type: String,
      enum: ['basic', 'pro', 'enterprise'],
      default: 'basic'
    },
    startDate: Date,
    endDate: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);