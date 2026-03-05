// Week 2 — Firebase token verification middleware
const admin = require('../config/firebase');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(token);

    // Auto-create user in MongoDB on first login
    let user = await User.findOne({ firebaseUid: decoded.uid });
    if (!user) {
      user = await User.create({
        firebaseUid:   decoded.uid,
        email:         decoded.email,
        name:          decoded.name || decoded.email.split('@')[0],
        avatar:        decoded.picture || '',
        emailVerified: decoded.email_verified || false,
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expired, please log in again' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Optional auth — attaches user if token present but doesn't block
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next();
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = await User.findOne({ firebaseUid: decoded.uid });
    next();
  } catch {
    next(); // silently continue without user
  }
};

module.exports = { protect, optionalAuth };
