import React, { useState, useRef } from 'react';
import { 
  Mail, Phone, MessageSquare, Send, User, Check 
} from 'lucide-react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import '../styles/ContactSales.css';

export default function ContactSales() {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await emailjs.sendForm(
        'FinTrack', // Replace with your EmailJS service ID
        'FinTrack-EmailTemplate', // Replace with your EmailJS template ID
        form.current,
        '0Grk16X_W_zWEc8th' // Replace with your EmailJS public key
      );
      setSubmitted(true);
    } catch (error) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        className="contact-success"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="success-content">
          <Check size={48} className="success-icon" />
          <h2>Message Sent Successfully!</h2>
          <p>Thank you for contacting our sales team. We'll get back to you within 24 hours.</p>
          <motion.button
            className="back-button"
            onClick={() => setSubmitted(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Send Another Message
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="contact-sales-container">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <section className="contact-hero">
          <h1>Contact Sales Team</h1>
          <p>Get in touch with our sales team to discuss premium features and enterprise solutions</p>
        </section>

        <div className="contact-content">
          <motion.div 
            className="contact-info"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="info-card">
              <Mail className="info-icon" />
              <h3>Email Us</h3>
              <p>sales@financetrack.com</p>
            </div>
            <div className="info-card">
              <Phone className="info-icon" />
              <h3>Call Us</h3>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="info-card">
              <MessageSquare className="info-icon" />
              <h3>Live Chat</h3>
              <p>Available 24/7</p>
            </div>
          </motion.div>

          <motion.form
            ref={form}
            className="contact-form"
            onSubmit={sendEmail}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="form-group">
              <label>
                <User size={16} />
                Full Name
              </label>
              <input
                type="text"
                name="user_name"
                required
                placeholder="John Doe"
              />
            </div>

            <div className="form-group">
              <label>
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                name="user_email"
                required
                placeholder="john@example.com"
              />
            </div>

            <div className="form-group">
              <label>
                <MessageSquare size={16} />
                Subject
              </label>
              <select 
                name="subject"
                required
                defaultValue=""
              >
                <option value="" disabled>Select a topic</option>
                <option value="premium">Premium Features</option>
                <option value="enterprise">Enterprise Solutions</option>
                <option value="support">Technical Support</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group message-group">
              <label>
                <MessageSquare size={16} />
                Message
              </label>
              <textarea
                name="message"
                required
                placeholder="How can we help you today?"
                rows={5}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <motion.button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
              <Send size={16} />
            </motion.button>
          </motion.form>
        </div>
      </motion.main>
    </div>
  );
}