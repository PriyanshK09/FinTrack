const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

// Initialize Razorpay with console logging
console.log('Initializing Razorpay with:', {
  keyId: process.env.RAZORPAY_KEY_ID?.slice(0,5) + '...',  // Log partial key for security
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

exports.createOrder = async (req, res) => {
  try {
    // Verify user authentication
    if (!req.user || !req.user.id) {
      console.error('User not authenticated');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const options = {
      amount: req.body.amount, // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1 // Auto capture payment
    };

    console.log('Creating order:', options);
    const order = await razorpay.orders.create(options);
    console.log('Order created:', order);

    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ 
      message: 'Error creating order',
      error: error.message 
    });
  }
};

exports.verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id });

  try {
    // Verify signature
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
      console.log('Payment signature verified');

      // Update user's premium status
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            isPremium: true,
            'subscription.status': 'active',
            'subscription.plan': 'pro',
            'subscription.startDate': new Date(),
            'subscription.endDate': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        },
        { new: true } // Return updated document
      );

      console.log('User updated:', updatedUser);

      // Verify the update was successful
      if (!updatedUser) {
        throw new Error('User not found');
      }

      if (!updatedUser.isPremium) {
        throw new Error('Failed to update premium status');
      }

      res.json({ 
        message: 'Payment verified successfully',
        isPremium: true 
      });
    } else {
      console.log('Invalid payment signature');
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      message: 'Error verifying payment',
      error: error.message
    });
  }
};

const handlePaymentSuccess = async (req, res) => {
  try {
    const { paymentId, userId } = req.body;
    
    // Verify payment success logic here...
    
    if (paymentSuccess) {
      // Update subscription status
      await Subscription.create({
        user: userId,
        paymentId,
        status: 'active'
      });

      // Update user's premium status
      await User.findByIdAndUpdate(userId, {
        isPremium: true
      });

      res.json({ message: 'Payment successful' });
    } else {
      res.status(400).json({ message: 'Invalid payment verification' });
    }
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ message: 'Error processing payment' });
  }
};