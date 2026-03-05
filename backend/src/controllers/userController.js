// Week 8 — User controller (profiles, saved posts, my listings)
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Post = require('../models/Post');

// GET /api/users/:id — public profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-firebaseUid');
  if (!user || !user.isActive) { res.status(404); throw new Error('User not found'); }

  const posts = await Post.find({ author: req.params.id, isActive: true })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('title category images location createdAt views');

  res.json({ user, posts });
});

// GET /api/users/me/saved — saved posts
const getSavedPosts = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate({
      path: 'savedPosts',
      match: { isActive: true },
      populate: { path: 'author', select: 'name avatar' },
    });
  res.json(user.savedPosts);
});

// GET /api/users/me/posts — my listings
const getMyPosts = asyncHandler(async (req, res) => {
  const { category, active } = req.query;
  const query = { author: req.user._id };
  if (category) query.category = category;
  if (active !== undefined) query.isActive = active === 'true';

  const posts = await Post.find(query).sort({ createdAt: -1 });
  res.json(posts);
});

// PATCH /api/users/me/posts/:id/toggle — activate/deactivate listing
const togglePostActive = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, author: req.user._id });
  if (!post) { res.status(404); throw new Error('Post not found'); }
  post.isActive = !post.isActive;
  await post.save();
  res.json({ isActive: post.isActive });
});

module.exports = { getUserProfile, getSavedPosts, getMyPosts, togglePostActive };
