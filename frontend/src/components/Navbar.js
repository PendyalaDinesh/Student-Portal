// ============================================
// NAVBAR COMPONENT
// components/Navbar.js
// ============================================

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <div className="navbar-brand">
            Student Portal
          </div>
          
          {user && (
            <div className="navbar-user">
              <div className="navbar-avatar">
                {getInitials(user.name)}
              </div>
              <div className="navbar-name">
                {user.name}
              </div>
              <button 
                onClick={handleLogout}
                className="btn-logout"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
