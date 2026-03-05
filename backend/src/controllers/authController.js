// Week 2 — Auth controller (Firebase tokens → MongoDB user)
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// GET /api/auth/me — get current user profile
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// PUT /api/auth/profile — update name, bio, university, country, phone
const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, university, country, phone } = req.body;

  const updates = {};
  if (name       !== undefined) updates.name       = name;
  if (bio        !== undefined) updates.bio        = bio;
  if (university !== undefined) updates.university = university;
  if (country    !== undefined) updates.country    = country;
  if (phone      !== undefined) updates.phone      = phone;

  // Avatar upload
  if (req.file) {
    // Delete old avatar from Cloudinary
    if (req.user.avatarPublicId) {
      await cloudinary.uploader.destroy(req.user.avatarPublicId);
    }
    updates.avatar         = req.file.path;
    updates.avatarPublicId = req.file.filename;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true, runValidators: true,
  });
  res.json(user);
});

module.exports = { getMe, updateProfile };
