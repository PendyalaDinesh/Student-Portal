// ============================================
// AUTHENTICATION CONTEXT
// context/AuthContext.js
// ============================================

import React, { createContext, useState, useEffect } from 'react';
import { registerUser, loginUser, getUserProfile } from '../utils/api';

// Create Context
export const AuthContext = createContext();

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        
        if (userInfo) {
          const { user, token } = JSON.parse(userInfo);
          setUser(user);
          setToken(token);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('userInfo');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      const response = await registerUser(userData);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Save to state
        setUser(user);
        setToken(token);
        
        // Save to localStorage
        localStorage.setItem('userInfo', JSON.stringify({ user, token }));
        
        return { success: true, message: response.message };
      }
      
      return { success: false, message: response.message };
      
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed'
      };
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const response = await loginUser(credentials);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Save to state
        setUser(user);
        setToken(token);
        
        // Save to localStorage
        localStorage.setItem('userInfo', JSON.stringify({ user, token }));
        
        return { success: true, message: response.message };
      }
      
      return { success: false, message: response.message };
      
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed'
      };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('userInfo');
  };

  // Update user function
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    
    // Update localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      userInfo.user = updatedUser;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    try {
      const response = await getUserProfile();
      
      if (response.success) {
        updateUser(response.data.user);
        return { success: true };
      }
      
      return { success: false };
      
    } catch (error) {
      console.error('Refresh profile error:', error);
      return { success: false };
    }
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    updateUser,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
