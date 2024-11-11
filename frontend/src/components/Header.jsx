import React, { useState, useEffect } from 'react';
import { DollarSign, Menu, X } from 'lucide-react';
import '../styles/Header.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollState, setScrollState] = useState('top');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on mount and token changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const handleScroll = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      if (scrollY === 0) {
        setScrollState('top');
      } else if (direction !== scrollState) {
        setScrollState(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollState]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      await axios.post('http://localhost:5000/api/auth/logout', {}, { 
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <header className={`header ${scrollState}`}>
      <div className="header-content">
        <div className="logo" onClick={() => navigate('/')}>
          <DollarSign size={28} />
          <h1>FinanceTrack</h1>
        </div>
        
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul>
            {!isAuthenticated ? (
              // Public navigation items
              <>
                <li><a href="#features">Features</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
                <li><a href="#pricing">Pricing</a></li>
                <li><a href="#contact">Contact</a></li>
              </>
            ) : (
              // Authenticated navigation items
              <>
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/reports">Reports</a></li>
                <li><a href="/settings">Settings</a></li>
              </>
            )}
          </ul>
        </nav>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <button className="cta-button header-cta" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <button className="cta-button header-cta" onClick={handleLogin}>
              Login
            </button>
          )}
        </div>

        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}