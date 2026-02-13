// ============================================
// USER CONTROLLER
// controllers/userController.js
// ============================================

const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// ============================================
// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
// ============================================

exports.register = async (req, res) => {
  try {
    const { name, email, password, university, major, yearOfStudy, country, isInternational } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by pre-save middleware
      university,
      major,
      yearOfStudy,
      country,
      isInternational
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// ============================================
// @desc    Login user
// @route   POST /api/users/login
// @access  Public
// ============================================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email (include password field)
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.'
      });
    }

    // Verify password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// ============================================
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
// ============================================

exports.getProfile = async (req, res) => {
  try {
    // User is already attached to req by auth middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error retrieving profile'
    });
  }
};

// ============================================
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
// ============================================

exports.updateProfile = async (req, res) => {
  try {
    const { name, university, major, yearOfStudy, country, isInternational, bio, phone } = req.body;

    // Find user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (university) user.university = university;
    if (major) user.major = major;
    if (yearOfStudy) user.yearOfStudy = yearOfStudy;
    if (country) user.country = country;
    if (typeof isInternational !== 'undefined') user.isInternational = isInternational;
    if (bio) user.bio = bio;
    if (phone) user.phone = phone;

    // Save updated user
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

// ============================================
// @desc    Get all users (for testing)
// @route   GET /api/users
// @access  Public (should be private in production)
// ============================================

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      data: {
        users
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error retrieving users'
    });
  }
};

// ============================================
// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
// ============================================

exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - deactivate account
    user.isActive = false;
    await user.save();

    // Or hard delete (uncomment if you want permanent deletion)
    // await user.remove();

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Delete account error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Server error deleting account'
    });
  }
};
