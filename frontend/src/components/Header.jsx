import React, { useState, useEffect, useRef } from 'react';
import { 
  DollarSign, 
  Menu, 
  X, 
  User,
  LogOut,
  ChevronDown,
  PieChart,
  BarChart2,
  BookOpen,
  Crown
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles/Header.css';
import { useAuth } from '../context/AuthContext';
import { useScrollNavigation } from '../hooks/useScrollNavigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollState, setScrollState] = useState('top');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const { isAuthenticated, setIsAuthenticated, userData, setUserData, fetchUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { handleNavigation } = useScrollNavigation();

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUser(); // Fetch fresh user data when header mounts
    }
  }, [isAuthenticated, fetchUser]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUserData(null);
      setShowUserMenu(false);
      navigate('/');
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
          <h1>
            FinTrack
            {userData?.isPremium && (
              <span className="pro-badge">PRO</span>
            )}
          </h1>
        </div>
        
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul>
            {!isAuthenticated ? (
              <>
                <li>
                  <button 
                    className="nav-link-button" 
                    onClick={() => handleNavigation('features')}
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    className="nav-link-button" 
                    onClick={() => handleNavigation('testimonials')}
                  >
                    Testimonials
                  </button>
                </li>
                <li>
                  <Link to="/premium" className="premium-link">
                    <Crown size={16} />Premium
                  </Link>
                </li>
                <li>
                  <button 
                    className="nav-link-button" 
                    onClick={() => navigate('/contact')} // Changed from handleNavigation to direct navigation
                  >
                    Contact
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/tracker" className={location.pathname === '/tracker' ? 'active' : ''}>
                  <PieChart size={16} />Tracker
                </Link></li>
                <li><Link to="/reports" className={location.pathname === '/reports' ? 'active' : ''}>
                  <BarChart2 size={16} />Reports
                </Link></li>
                <li><Link to="/financial-education" className={location.pathname === '/financial-education' ? 'active' : ''}>
                  <BookOpen size={16} />Learn
                </Link></li>
                <li><Link to="/premium" className="premium-link">
                  <Crown size={16} />Premium
                </Link></li>
              </>
            )}
          </ul>
        </nav>

        <div className="auth-buttons">
          {isAuthenticated ? (
            <div className="user-menu" ref={userMenuRef}>
              <button 
                className="user-menu-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User size={20} />
                <span>{userData?.name || 'User'}</span>
                <ChevronDown size={16} />
              </button>
              
              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-greeting">
                    Hello, {userData?.name || 'User'}!
                  </div>
                  <Link to="/dashboard" className="dropdown-item">
                    <User size={16} />Profile
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <LogOut size={16} />Logout
                  </button>
                </div>
              )}
            </div>
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