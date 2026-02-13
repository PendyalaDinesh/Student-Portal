// ============================================
// HOME PAGE
// pages/Home.js
// ============================================

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white',
        maxWidth: '800px'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          marginBottom: '16px',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}>
          Student Portal
        </h1>
        
        <p style={{
          fontSize: '20px',
          marginBottom: '12px',
          opacity: '0.9'
        }}>
          Connecting International and Domestic Students
        </p>
        
        <p style={{
          fontSize: '16px',
          marginBottom: '40px',
          opacity: '0.8'
        }}>
          Find housing, share rides, discover jobs, and build your community
        </p>

        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link 
            to="/register"
            style={{
              padding: '14px 32px',
              background: 'white',
              color: '#667eea',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}
          >
            Get Started
          </Link>
          
          <Link 
            to="/login"
            style={{
              padding: '14px 32px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '16px',
              border: '2px solid white',
              transition: 'transform 0.2s'
            }}
          >
            Sign In
          </Link>
        </div>

        <div style={{
          marginTop: '60px',
          padding: '30px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '10px',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            fontSize: '24px',
            marginBottom: '20px',
            fontWeight: '600'
          }}>
            Week 1: Authentication System ✅
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            textAlign: 'left'
          }}>
            {[
              { icon: '✅', text: 'User Registration' },
              { icon: '✅', text: 'Secure Login with JWT' },
              { icon: '✅', text: 'Password Encryption' },
              { icon: '✅', text: 'Protected Routes' },
              { icon: '✅', text: 'User Profile View' },
              { icon: '✅', text: 'Session Management' }
            ].map((item, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px'
                }}
              >
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
