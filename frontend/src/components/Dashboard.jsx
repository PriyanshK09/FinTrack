import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, Settings, DollarSign, Globe, Lock, Mail, 
  Save, AlertCircle, CheckCircle, Crown, Star, X
} from 'lucide-react';
import cc from 'currency-codes';
import countryCodeList from 'country-codes-list';
import { motion, AnimatePresence } from 'framer-motion'; // Add this import
import axios from 'axios';
import '../styles/Dashboard.css';
import { useCurrency } from '../context/CurrencyContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [settings, setSettings] = useState({
    currency: { code: 'INR', symbol: '₹' },
    region: { code: 'IN', name: 'India' },
    notifications: true
  });
  const [updateForm, setUpdateForm] = useState({
    name: '',
    email: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [currencies, setCurrencies] = useState([]);
  const [regions, setRegions] = useState([]);
  const { setCurrency } = useCurrency();

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('http://localhost:5000/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData(response.data);
      setUpdateForm({
        name: response.data.name,
        email: response.data.email
      });
      
      // Update settings state with user's saved settings
      if (response.data.settings) {
        setSettings(response.data.settings);
        if (response.data.settings.currency) {
          setCurrency(response.data.settings.currency); // Update global currency context
        }
      }
      
      setLoading(false);
    } catch (error) {
      setMessage({ text: 'Failed to fetch user data', type: 'error' });
      setLoading(false);
    }
  }, [setCurrency]);

  useEffect(() => {
    const allCurrencies = cc.data.map(currency => ({
      code: currency.code,
      symbol: currency.symbol || currency.code,
      name: currency.currency
    }));
    
    // Move INR to top of list
    const inr = allCurrencies.find(c => c.code === 'INR');
    const otherCurrencies = allCurrencies.filter(c => c.code !== 'INR');
    setCurrencies([inr, ...otherCurrencies]);

    // Move India to top of regions list  
    const countryData = countryCodeList.customList('countryCode', '{countryNameEn}');
    const allRegions = Object.entries(countryData).map(([code, name]) => ({
      code,
      name
    }));
    const india = allRegions.find(r => r.code === 'IN');
    const otherRegions = allRegions.filter(r => r.code !== 'IN');
    setRegions([india, ...otherRegions]);

    fetchUserData();
  }, [fetchUserData]);

  // Add this useEffect after other useEffects
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  // Update handleSettingsUpdate function
  const handleSettingsUpdate = async (setting, value, additionalData = {}) => {
    try {
      const token = localStorage.getItem('authToken');
      let updateData = { [setting]: value };

      if (setting === 'currency') {
        const currencyData = currencies.find(c => c.code === value);
        updateData = {
          currency: {
            code: value,
            symbol: currencyData.symbol || value
          }
        };
        setCurrency(updateData.currency); // Update global currency context
      }

      // Handle region update
      if (setting === 'region') {
        const regionData = regions.find(r => r.code === value);
        updateData = {
          region: {
            code: value,
            name: regionData.name
          }
        };
      }

      await axios.put(
        'http://localhost:5000/api/users/settings',
        updateData,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      setSettings(prev => ({
        ...prev,
        ...updateData
      }));
      setMessage({ text: 'Settings updated successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to update settings', type: 'error' });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        'http://localhost:5000/api/users/profile',
        updateForm,
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setUserData(prev => ({ ...prev, ...updateForm }));
      setMessage({ text: 'Profile updated successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to update profile', type: 'error' });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        'http://localhost:5000/api/users/password',
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ text: 'Password updated successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to update password', type: 'error' });
    }
  };

  // Add to the existing handlers in Dashboard.jsx
  const handleCancelMembership = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:5000/api/users/cancel-premium',
        {},
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Update local user data
      const updatedUserData = {
        ...userData,
        isPremium: false,
        subscription: {
          status: 'inactive',
          plan: 'basic',
          endDate: null
        }
      };
      setUserData(updatedUserData);
      setMessage({ text: 'Premium membership cancelled successfully', type: 'success' });
    } catch (error) {
      setMessage({ text: 'Failed to cancel membership', type: 'error' });
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <motion.main 
        className="dashboard-main"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="dashboard-title">Account Dashboard</h1>
        
        {message.text && (
          <AnimatePresence>
            <motion.div 
              className={`message ${message.type}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {message.type === 'error' ? <AlertCircle /> : <CheckCircle />}
              {message.text}
            </motion.div>
          </AnimatePresence>
        )}

        <div className="dashboard-grid">
          <section className="profile-section card">
            <h2><User size={20} /> Profile Information</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="input-group">
                <label>Name</label>
                <input
                  type="text"
                  value={updateForm.name}
                  onChange={e => setUpdateForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input
                  type="email"
                  value={updateForm.email}
                  onChange={e => setUpdateForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <button type="submit" className="update-btn">
                <Save size={16} /> Update Profile
              </button>
            </form>
          </section>

          <section className="settings-section card">
            <h2><Settings size={20} /> Preferences</h2>
            <div className="setting-item">
              <div className="setting-label">
                <DollarSign size={16} />
                <label>Currency</label>
              </div>
              <select
                value={settings.currency?.code || 'USD'}
                onChange={e => handleSettingsUpdate('currency', e.target.value)}
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} ({currency.symbol}) - {currency.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="setting-item">
              <div className="setting-label">
                <Globe size={16} />
                <label>Region</label>
              </div>
              <select
                value={settings.region?.code || 'US'}
                onChange={e => handleSettingsUpdate('region', e.target.value)}
              >
                {regions.map(region => (
                  <option key={region.code} value={region.code}>
                    {region.name} ({region.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="setting-item">
              <div className="setting-label">
                <Mail size={16} />
                <label>Notifications</label>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={e => handleSettingsUpdate('notifications', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </section>

          <section className="security-section card">
            <h2><Lock size={20} /> Security</h2>
            <form onSubmit={handlePasswordUpdate}>
              <div className="input-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={e => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                />
              </div>
              <div className="input-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </div>
              <button type="submit" className="update-btn">
                <Save size={16} /> Update Password
              </button>
            </form>
          </section>

          <section className="premium-status-section card">
            <h2><Crown size={20} /> Account Status</h2>
            <div className="status-info">
              <div className="status-badge">
                {userData?.isPremium ? (
                  <div className="premium-active">
                    <Crown size={24} />
                    <span>Premium Active</span>
                  </div>
                ) : (
                  <div className="premium-inactive">
                    <Star size={24} />
                    <span>Basic Plan</span>
                  </div>
                )}
              </div>
              {userData?.isPremium && (
                <>
                  <div className="subscription-details">
                    <p><strong>Plan:</strong> Pro</p>
                    <p><strong>Status:</strong> Active</p>
                    <p><strong>Next billing:</strong> {new Date(userData?.subscription?.endDate).toLocaleDateString()}</p>
                  </div>
                  <button 
                    className="cancel-btn"
                    onClick={() => {
                      if (window.confirm('Warning: Canceling your premium membership is permanent and no refund will be provided. Do you want to continue?')) {
                        handleCancelMembership();
                      }
                    }}
                  >
                    <X size={16} /> Cancel Membership
                  </button>
                </>
              )}
              {!userData?.isPremium && (
                <button 
                  className="upgrade-btn"
                  onClick={() => navigate('/premium')}
                >
                  <Crown size={16} /> Upgrade to Premium
                </button>
              )}
            </div>
          </section>
        </div>
      </motion.main>
    </div>
  );
}