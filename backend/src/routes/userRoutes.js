// Week 8 — User routes
const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getUserProfile, getSavedPosts, getMyPosts, togglePostActive } = require('../controllers/userController');

// ORDER MATTERS: specific routes before /:id
router.get('/me/saved',           protect, getSavedPosts);
router.get('/me/posts',           protect, getMyPosts);
router.patch('/me/posts/:id/toggle', protect, togglePostActive);
router.get('/:id',                getUserProfile);

module.exports = router;
