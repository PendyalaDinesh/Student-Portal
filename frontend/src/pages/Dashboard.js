// ============================================
// DASHBOARD PAGE
// pages/Dashboard.js
// ============================================

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();

  const features = [
    { icon: '👤', name: 'Profile Management' },
    { icon: '🏠', name: 'Housing Marketplace' },
    { icon: '🚗', name: 'Ride Sharing' },
    { icon: '💼', name: 'Job Board' },
    { icon: '💬', name: 'Messaging System' }
  ];

  return (
    <div className="dashboard">
      <Navbar />

      <div className="container">
        <div className="dashboard-content">
          <div className="profile-card">

            {/* Header */}
            <div className="profile-header">
              <h1 className="profile-title">Dashboard</h1>
              <p className="profile-subtitle">
                Welcome back, {user?.name || 'Student'}.
              </p>
            </div>

            {/* Profile Section */}
            <div className="profile-section">
              <h2 className="profile-section-title">Profile Information</h2>

              <div className="profile-grid">
                <div className="profile-field">
                  <div className="profile-field-label">Full Name</div>
                  <div className="profile-field-value">
                    {user?.name || 'Not provided'}
                  </div>
                </div>

                <div className="profile-field">
                  <div className="profile-field-label">Email</div>
                  <div className="profile-field-value">
                    {user?.email || 'Not provided'}
                  </div>
                </div>

                <div className="profile-field">
                  <div className="profile-field-label">University</div>
                  <div className="profile-field-value">
                    {user?.university || 'Not provided'}
                  </div>
                </div>

                <div className="profile-field">
                  <div className="profile-field-label">Major</div>
                  <div className="profile-field-value">
                    {user?.major || 'Not provided'}
                  </div>
                </div>

                <div className="profile-field">
                  <div className="profile-field-label">Year of Study</div>
                  <div className="profile-field-value">
                    {user?.yearOfStudy || 'Not specified'}
                  </div>
                </div>

                <div className="profile-field">
                  <div className="profile-field-label">Country</div>
                  <div className="profile-field-value">
                    {user?.country || 'Not provided'}
                  </div>
                </div>

                <div className="profile-field">
                  <div className="profile-field-label">Student Type</div>
                  <div className="profile-field-value">
                    {user?.isInternational
                      ? 'International Student'
                      : 'Domestic Student'}
                  </div>
                </div>

                <div className="profile-field">
                  <div className="profile-field-label">Member Since</div>
                  <div className="profile-field-value">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Features */}
            <div className="profile-section">
              <h2 className="profile-section-title">Platform Features</h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px'
                }}
              >
                {features.map((feature, index) => (
                  <div
                    key={index}
                    style={{
                      background: '#F9FAFB',
                      padding: '18px',
                      borderRadius: '10px',
                      textAlign: 'center',
                      border: '1px solid #E5E7EB'
                    }}
                  >
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>
                      {feature.icon}
                    </div>
                    <div
                      style={{
                        fontWeight: '600',
                        color: '#2C3E50'
                      }}
                    >
                      {feature.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          marginTop: '40px',
          padding: '20px 0',
          textAlign: 'center',
          backgroundColor: '#F3F4F6',
          borderTop: '1px solid #E5E7EB',
          fontSize: '14px',
          color: '#6B7280'
        }}
      >
        © {new Date().getFullYear()} Student Club. All rights reserved.
      </footer>

    </div>
  );
};

export default Dashboard;
