// ============================================
// VALIDATION MIDDLEWARE
// middleware/validation.js
// ============================================

const { body, validationResult } = require('express-validator');

// ============================================
// VALIDATION RULES
// ============================================

// Register Validation
exports.registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  
  body('university')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('University name is too long'),
  
  body('major')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Major name is too long'),
  
  body('country')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Country name is too long')
];

// Login Validation
exports.loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

// Update Profile Validation
exports.updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('university')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('University name is too long'),
  
  body('major')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Major name is too long'),
  
  body('yearOfStudy')
    .optional()
    .isIn(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Other'])
    .withMessage('Invalid year of study'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format')
];

// ============================================
// CHECK VALIDATION RESULTS
// ============================================

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};
