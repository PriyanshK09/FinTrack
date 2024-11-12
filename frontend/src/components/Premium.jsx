import React from 'react';
import { 
  Check, Star, Shield, Zap, Crown, Gift, ChevronRight, DollarSign, 
  TrendingUp, Users, Bell 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import '../styles/Premium.css';

export default function Premium() {
  const navigate = useNavigate();
  const { currency } = useCurrency();

  const plans = [
    {
      name: 'Basic',
      price: '0',
      period: 'Forever',
      icon: Star,
      features: [
        'Basic expense tracking',
        'Simple budgeting tools',
        'Monthly reports',
        'Mobile app access'
      ],
      recommended: false
    },
    {
      name: 'Pro',
      price: '499',
      period: 'per month',
      icon: Crown,
      features: [
        'Everything in Basic',
        'Investment tracking',
        'Advanced analytics',
        'Personalized insights',
        'Priority support'
      ],
      recommended: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'per year',
      icon: Shield,
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'Custom integrations',
        'Team collaboration',
        'API access'
      ],
      recommended: false
    }
  ];

  return (
    <div className="premium-container">
      <motion.main 
        className="premium-main"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <section className="premium-hero">
          <h1>Upgrade to Premium</h1>
          <p>Take your financial management to the next level</p>
        </section>

        <section className="pricing-section">
          <div className="pricing-grid">
            {plans.map((plan, index) => (
              <motion.div 
                key={plan.name}
                className={`pricing-card ${plan.recommended ? 'recommended' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {plan.recommended && (
                  <div className="recommended-badge">
                    <Crown size={16} /> Most Popular
                  </div>
                )}
                <plan.icon className="plan-icon" size={32} />
                <h2>{plan.name}</h2>
                <div className="price">
                  <span className="amount">
                    {plan.price === 'Custom' ? plan.price : `${currency.symbol}${plan.price}`}
                  </span>
                  <span className="period">{plan.period}</span>
                </div>
                <ul className="features-list">
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <Check size={16} className="check-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  className={`upgrade-btn ${plan.recommended ? 'recommended' : ''}`}
                  onClick={() => navigate('/premium-features')}
                >
                  Get Started <ChevronRight size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="premium-features">
          <h2>Premium Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <TrendingUp className="feature-icon" />
              <h3>Advanced Analytics</h3>
              <p>Deep insights into your spending patterns and financial health</p>
            </div>
            <div className="feature-card">
              <Bell className="feature-icon" />
              <h3>Smart Alerts</h3>
              <p>Get notified about important financial events and opportunities</p>
            </div>
            <div className="feature-card">
              <Gift className="feature-icon" />
              <h3>Exclusive Rewards</h3>
              <p>Earn points and get access to special financial tools</p>
            </div>
            <div className="feature-card">
              <Shield className="feature-icon" />
              <h3>Enhanced Security</h3>
              <p>Additional security features to protect your financial data</p>
            </div>
          </div>
        </section>
      </motion.main>
    </div>
  );
}