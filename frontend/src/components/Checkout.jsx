import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, CreditCard, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const { userData, fetchUser } = useAuth();  // Add fetchUser
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Update key to match .env
  const razorpayKeyId = 'rzp_test_jd2dAzgC3rQ5u3'; // From .env file

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to continue');
        navigate('/login');
        return;
      }

      // Create order with amount in paise (499 * 100)
      const response = await axios.post(
        'http://localhost:5000/api/payment/create-order',
        { amount: 49900 }, // Amount in paise
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      const options = {
        key: razorpayKeyId,
        amount: response.data.amount,
        currency: "INR",
        name: "FinTrack", // Changed from FinanceTrack
        description: "Premium Plan Subscription",
        order_id: response.data.id,
        prefill: {
          name: userData?.name || "User",
          email: userData?.email || "",
        },
        theme: {
          color: "#e67e22"
        },
        handler: async (response) => {
          try {
            await axios.post(
              'http://localhost:5000/api/payment/verify',
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              },
              { headers: { Authorization: `Bearer ${token}` }}
            );

            // Add this: Refresh user data to get updated premium status
            await fetchUser();

            setSuccess(true);
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          } catch (error) {
            setError('Payment verification failed. Please contact support.');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      setError('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="checkout-container">
        <motion.div 
          className="success-message"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <Check size={48} className="success-icon" />
          <h2>Payment Successful!</h2>
          <p>Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <section className="checkout-hero">
          <h1>Complete Your Purchase</h1>
          <p>You're just one step away from unlocking premium features</p>
        </section>

        <div className="checkout-content">
          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="plan-details">
              <span className="plan-name">Pro Plan</span>
              <span className="plan-price">{currency.symbol}499/month</span>
            </div>
            <div className="features-summary">
              <h3>What's included:</h3>
              <ul>
                <li><Check size={16} /> Investment Tracking</li>
                <li><Check size={16} /> Advanced Analytics</li>
                <li><Check size={16} /> Personalized Insights</li>
                <li><Check size={16} /> Priority Support</li>
              </ul>
            </div>
          </div>

          <div className="payment-section">
            {error && <div className="error-message">{error}</div>}
            <motion.button
              className="payment-button"
              onClick={handlePayment}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <CreditCard size={20} />
                  Pay {currency.symbol}499
                </>
              )}
            </motion.button>
            <div className="secure-badge">
              <Shield size={16} />
              Secure Payment via Razorpay
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}