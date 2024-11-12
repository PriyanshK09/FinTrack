import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Export the context so it can be imported directly
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setUserData(null);
      }
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await axios.get('http://localhost:5000/api/auth/user', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      setIsAuthenticated, 
      userData, 
      setUserData, 
      checkAuth,
      user,
      setUser,
      fetchUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);