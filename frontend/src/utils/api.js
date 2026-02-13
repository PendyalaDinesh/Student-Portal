// ============================================
// API UTILITY FUNCTIONS
// utils/api.js
// ============================================

import axios from 'axios';

// Base API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get authentication token from localStorage
const getAuthToken = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    return token;
  }
  return null;
};

// Get config with authentication headers
const getAuthConfig = () => {
  const token = getAuthToken();
  return {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  };
};

// ============================================
// USER / AUTHENTICATION APIs
// ============================================

// Register new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/register`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_URL}/users/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/users/profile`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/profile`,
      profileData,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Delete user account
export const deleteUserAccount = async () => {
  try {
    const response = await axios.delete(
      `${API_URL}/users/profile`,
      getAuthConfig()
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete account' };
  }
};

// Get all users (for testing)
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch users' };
  }
};
