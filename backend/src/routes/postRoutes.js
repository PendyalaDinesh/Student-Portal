// Week 3 & 4 — Post CRUD routes
const router = require('express').Router();
const { body, param } = require('express-validator');
const { protect, optionalAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { upload } = require('../config/cloudinary');
const {
  getPosts, getPost, createPost, updatePost,
  deletePost, toggleSave, addReview,
} = require('../controllers/postController');

const postValidation = [
  body('title').trim().notEmpty().isLength({ max: 150 }).withMessage('Title is required (max 150)'),
  body('description').trim().notEmpty().isLength({ max: 3000 }).withMessage('Description is required'),
  body('category').isIn(['housing', 'rides', 'jobs', 'community']).withMessage('Invalid category'),
];

router.get('/',        optionalAuth, getPosts);
router.get('/:id',     optionalAuth, getPost);
router.post('/',       protect, upload.array('images', 5), postValidation, validate, createPost);
router.put('/:id',     protect, upload.array('images', 5), updatePost);
router.delete('/:id',  protect, deletePost);
router.post('/:id/save',   protect, toggleSave);
router.post('/:id/review', protect, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5'),
  body('comment').optional().trim().isLength({ max: 500 }),
], validate, addReview);

module.exports = router;
