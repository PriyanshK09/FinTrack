import React, { useEffect, useState } from 'react'
import { PieChart, Wallet, TrendingUp, Shield, Users, Gift, ChevronRight } from 'lucide-react'
import '../styles/Home.css'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Home() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await axios.get('http://localhost:5000/api/auth/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Check for scroll target in navigation state
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Clean up the state
        navigate('/', {}, { replace: true });
      }
    }
  }, [location, navigate]);

  const handleStartTrial = () => {
    if (userData) {
      // User is authenticated, navigate to the trial page or start the trial
      navigate('/tracker');
    } else {
      // User is not authenticated, navigate to the login page
      navigate('/login');
    }
  };

  return (
    <main className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Master Your Finances</h1>
          <p>Empower your financial journey with FinTrack - Your all-in-one solution for budgeting, tracking, and growing your wealth.</p>
          <button className="cta-button" onClick={handleStartTrial}>
            Get Started
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="hero-image">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="200" fill="#3498db" fillOpacity="0.1"/>
            <circle cx="200" cy="200" r="150" fill="#3498db" fillOpacity="0.2"/>
            <circle cx="200" cy="200" r="100" fill="#3498db" fillOpacity="0.3"/>
            <path d="M200 100V300M100 200H300" stroke="#2c3e50" strokeWidth="10" strokeLinecap="round"/>
            <circle cx="200" cy="200" r="50" fill="#27ae60"/>
            <path d="M180 200L200 220L220 180" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </section>

      <section className="features" id="features">
        <h2>Powerful Features for Your Financial Success</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <PieChart size={48} />
            <h3>Smart Expense Tracking</h3>
            <p>Automatically categorize and visualize your spending patterns</p>
          </div>
          <div className="feature-card">
            <Wallet size={48} />
            <h3>Intelligent Budgeting</h3>
            <p>Create and manage budgets that adapt to your lifestyle</p>
          </div>
          <div className="feature-card">
            <TrendingUp size={48} />
            <h3>Investment Insights</h3>
            <p>Track and analyze your investments for optimal growth</p>
          </div>
          <div className="feature-card">
            <Shield size={48} />
            <h3>Bank-Level Security</h3>
            <p>Your financial data is protected with state-of-the-art encryption</p>
          </div>
          <div className="feature-card">
            <Users size={48} />
            <h3>Financial Coaching</h3>
            <p>Get personalized advice from our team of financial experts</p>
          </div>
          <div className="feature-card">
            <Gift size={48} />
            <h3>Rewards Program</h3>
            <p>Earn points and unlock exclusive financial tools as you progress</p>
          </div>
        </div>
      </section>

      <section className="testimonials" id="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial-card">
            <div className="quote">"</div>
            <p>FinTrack has completely transformed how I manage my money. I've never felt more in control of my finances!</p>
            <div className="testimonial-author">
              <img src="/placeholder.svg?height=50&width=50" alt="Sarah J." className="author-image" />
              <div>
                <h4>Sarah J.</h4>
                <span>Small Business Owner</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote">"</div>
            <p>The investment tracking feature is a game-changer. I've optimized my portfolio and seen real growth.</p>
            <div className="testimonial-author">
              <img src="/placeholder.svg?height=50&width=50" alt="Michael R." className="author-image" />
              <div>
                <h4>Michael R.</h4>
                <span>Investment Analyst</span>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="quote">"</div>
            <p>As a freelancer, budgeting was always a challenge. FinTrack made it simple and even enjoyable!</p>
            <div className="testimonial-author">
              <img src="/placeholder.svg?height=50&width=50" alt="Emily T." className="author-image" />
              <div>
                <h4>Emily T.</h4>
                <span>Freelance Designer</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <h2>Ready to Transform Your Financial Life?</h2>
        <p>Join over 100,000 users who have taken control of their finances with FinTrack</p>
        <button className="cta-button" onClick={handleStartTrial}>
          Start Your Free 30-Day Trial
          <ChevronRight size={20} />
        </button>
      </section>
    </main>
  )
}
