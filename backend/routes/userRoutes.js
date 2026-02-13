// ============================================
// USER ROUTES
// routes/userRoutes.js
// ============================================

const express = require('express');
const router = express.Router();

// Import controllers
const {
  register,
  login,
  getProfile,
  updateProfile,
  getUsers,
  deleteAccount
} = require('../controllers/userController');

// Import middleware
const { protect } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  validate
} = require('../middleware/validation');

// ============================================
// PUBLIC ROUTES
// ============================================

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, validate, register);

// @route   POST /api/users/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, validate, login);

// @route   GET /api/users
// @desc    Get all users (for testing - should be protected in production)
// @access  Public
router.get('/', getUsers);

// ============================================
// PROTECTED ROUTES (Require Authentication)
// ============================================

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateProfileValidation, validate, updateProfile);

// @route   DELETE /api/users/profile
// @desc    Delete user account
// @access  Private
router.delete('/profile', protect, deleteAccount);

module.exports = router;
