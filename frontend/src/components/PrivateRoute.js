// ============================================
// PRIVATE ROUTE COMPONENT
// components/PrivateRoute.js
// ============================================

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  
  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user exists, render children (protected component)
  return children;
};

export default PrivateRoute;
