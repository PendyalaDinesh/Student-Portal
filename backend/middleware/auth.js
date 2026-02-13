// ============================================
// AUTHENTICATION MIDDLEWARE
// middleware/auth.js
// ============================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ============================================
// PROTECT ROUTES - Verify JWT Token
// ============================================

exports.protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      // Format: Bearer <token>
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if user account is active
      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated'
        });
      }

      next();

    } catch (error) {
      console.error('Token verification failed:', error.message);
      
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  // If no token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// ============================================
// GENERATE JWT TOKEN
// ============================================

exports.generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    }
  );
};

// ============================================
// OPTIONAL: ROLE-BASED AUTHORIZATION
// (Will be useful in later weeks)
// ============================================

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};
