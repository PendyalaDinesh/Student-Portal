// Week 2 — Auth routes
const router = require('express').Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { getMe, updateProfile } = require('../controllers/authController');
const { upload } = require('../config/cloudinary');

router.get('/me', protect, getMe);

router.put('/profile', protect, upload.single('avatar'), [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 chars'),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('university').optional().trim().isLength({ max: 150 }),
], validate, updateProfile);

module.exports = router;
