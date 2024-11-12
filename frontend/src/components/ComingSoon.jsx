import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/ComingSoon.css';

export default function ComingSoon() {
  const navigate = useNavigate();

  return (
    <div className="coming-soon-container">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <section className="coming-soon-content">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
          >
            <Rocket className="rocket-icon" size={80} />
          </motion.div>
          
          <h1>Enterprise Plan Coming Soon!</h1>
          <p>We're working hard to bring you advanced enterprise features. Stay tuned for updates!</p>
          
          <div className="features-preview">
            <h2>What to Expect</h2>
            <ul>
              <li>Advanced Team Collaboration</li>
              <li>Custom API Integration</li>
              <li>Dedicated Account Manager</li>
              <li>Enhanced Security Features</li>
            </ul>
          </div>

          <motion.button
            className="back-btn"
            onClick={() => navigate('/premium')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={20} />
            Back to Plans
          </motion.button>
        </section>
      </motion.main>
    </div>
  );
}