import React, { useState } from 'react';
import { DollarSign, Mail, Lock, User, ArrowRight, Apple, Github } from 'lucide-react';
import '../styles/Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserData } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // Login request
        const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        localStorage.setItem('authToken', response.data.token); // Save the token in localStorage
        const userResponse = await axios.get('http://localhost:5000/api/auth/user', {
          headers: { Authorization: `Bearer ${response.data.token}` }
        });
        setIsAuthenticated(true);
        setUserData(userResponse.data);
        navigate('/'); // Redirect to the homepage after successful login
      } else {
        // Signup request
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        const response = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
        localStorage.setItem('authToken', response.data.token); // Save the token in localStorage
        navigate('/'); // Redirect to the homepage after successful signup
      }
    } catch (err) {
      setError('Authentication failed. Please check your credentials and try again.');
    }
  };

  const handleGoogleAuth = () => {
    console.log('Authenticating with Google...');
  };

  const handleAppleAuth = () => {
    console.log('Authenticating with Apple...');
  };

  const handleGithubAuth = () => {
    console.log('Authenticating with GitHub...');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <DollarSign size={24} />
          <h1>FinTrack</h1>
        </div>
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <User size={20} />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          <div className="input-group">
            <Mail size={20} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <Lock size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {!isLogin && (
            <div className="input-group">
              <Lock size={20} />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit" className="submit-btn">
            {isLogin ? 'Login' : 'Sign Up'} <ArrowRight size={20} />
          </button>
        </form>
        <div className="auth-divider">
          <span>Or continue with</span>
        </div>
        <div className="social-auth">
          <button onClick={handleGoogleAuth} className="google-auth">
            <img src="/google-icon.svg" alt="Google" width="20" height="20" />
            Google
          </button>
          <button onClick={handleAppleAuth} className="apple-auth">
            <Apple size={20} />
            Apple
          </button>
          <button onClick={handleGithubAuth} className="github-auth">
            <Github size={20} />
            GitHub
          </button>
        </div>
        <p className="toggle-form">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}