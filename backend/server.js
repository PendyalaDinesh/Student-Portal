require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const userRoutes = require('./routes/userRoutes');

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// MIDDLEWARE

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Middleware - Allow frontend to make requests
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Request Logger Middleware (Development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============================================
// ROUTES
// ============================================

// Health Check Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Student Portal API - Week 1: Authentication System',
    version: '1.0.0',
    endpoints: {
      register: 'POST /api/users/register',
      login: 'POST /api/users/login',
      profile: 'GET /api/users/profile (Protected)',
      updateProfile: 'PUT /api/users/profile (Protected)'
    }
  });
});

// User Routes
app.use('/api/users', userRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler - Route Not Found
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('');
  console.log('================================================');
  console.log('  STUDENT PORTAL - WEEK 1: AUTHENTICATION');
  console.log('================================================');
  console.log(`  Server running on port ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV}`);
  console.log(`  Database: MongoDB`);
  console.log('================================================');
  console.log('');
  console.log('  Available Endpoints:');
  console.log('  - POST /api/users/register');
  console.log('  - POST /api/users/login');
  console.log('  - GET  /api/users/profile');
  console.log('  - PUT  /api/users/profile');
  console.log('');
  console.log('  Frontend URL: ' + process.env.CLIENT_URL);
  console.log('================================================');
  console.log('');
});

module.exports = app;
