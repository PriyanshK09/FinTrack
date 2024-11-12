import React, { useState, useContext } from 'react';
import { 
  TrendingUp, Shield, Gift, Bell, ChevronRight, ArrowRight, Crown, Check
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/PremiumFeatures.css';

export default function PremiumFeatures() {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(0);
  const { userData } = useContext(AuthContext);

  const features = [
    {
      title: "Advanced Analytics",
      icon: TrendingUp,
      description: "Get deep insights into your financial health",
      details: [
        "Customizable dashboards",
        "Trend analysis",
        "Predictive insights",
        "Export capabilities"
      ]
    },
    {
      title: "Smart Alerts",
      icon: Bell,
      description: "Stay informed about your finances",
      details: [
        "Bill payment reminders",
        "Unusual activity detection",
        "Investment opportunities",
        "Budget alerts"
      ]
    },
    {
      title: "Exclusive Rewards",
      icon: Gift,
      description: "Earn rewards for good financial habits",
      details: [
        "Cashback offers",
        "Premium partner deals",
        "Achievement badges",
        "Loyalty points"
      ]
    },
    {
      title: "Enhanced Security",
      icon: Shield,
      description: "Bank-grade security for your data",
      details: [
        "Two-factor authentication",
        "Biometric login",
        "Encryption",
        "Secure backup"
      ]
    }
  ];

  return (
    <div className="premium-features-container">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        {userData?.isPremium ? (
          <motion.section 
            className="premium-achievement-features"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="achievement-content">
              <Crown className="achievement-icon" size={64} />
              <h1>Premium Features Unlocked!</h1>
              <p>You have access to all premium features. Explore them below!</p>
            </div>
          </motion.section>
        ) : (
          <motion.section 
            className="features-hero"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotateZ: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Crown className="hero-icon" />
            </motion.div>
            <h1>Premium Features</h1>
            <p>Unlock the full potential of your financial journey</p>
          </motion.section>
        )}

        {/* Rest of the sections with enhanced animations */}
        <section className="features-showcase">
          <div className="features-nav">
            {features.map((feature, index) => (
              <motion.button
                key={index}
                className={`feature-nav-item ${index === activeFeature ? 'active' : ''}`}
                onClick={() => setActiveFeature(index)}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.05,
                  x: 10,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <feature.icon size={24} />
                <span>{feature.title}</span>
              </motion.button>
            ))}
          </div>

          <motion.div 
            className="feature-detail"
            key={activeFeature}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            {React.createElement(features[activeFeature].icon, {
              size: 48,
              className: "feature-icon"
            })}
            <h2>{features[activeFeature].title}</h2>
            <p>{features[activeFeature].description}</p>
            <ul className="feature-list">
              {features[activeFeature].details.map((detail, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    backgroundColor: "var(--card-background)",
                    transition: { duration: 0.2 }
                  }}
                >
                  <Check size={16} />
                  {detail}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </section>

        <motion.section 
          className="cta-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="cta-content">
            {userData?.isPremium ? (
              <>
                <h2>Explore Your Premium Benefits</h2>
                <p>Make the most of your premium membership by exploring all available features</p>
                <div className="cta-buttons">
                  <motion.button
                    className="primary-btn"
                    onClick={() => navigate('/dashboard')}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 20px rgba(230,126,34,0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Go to Dashboard <ArrowRight size={20} />
                  </motion.button>
                </div>
              </>
            ) : (
              <>
                <h2>Ready to Get Started?</h2>
                <p>Join our premium members and take control of your finances today!</p>
                <div className="cta-buttons">
                  <motion.button
                    className="primary-btn"
                    onClick={() => navigate('/checkout')}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 20px rgba(230,126,34,0.3)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Upgrade Now <ChevronRight size={20} />
                  </motion.button>
                  <motion.button
                    className="secondary-btn"
                    onClick={() => navigate('/contact')}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "var(--card-shadow)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Contact Sales
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}