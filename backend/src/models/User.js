// Week 1 schema design | Week 2 Firebase fields | Week 8 profile fields
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid:   { type: String, required: true, unique: true, index: true },
  email:         { type: String, required: true, unique: true, lowercase: true, trim: true },
  name:          { type: String, required: true, trim: true, maxlength: 100 },
  avatar:        { type: String, default: '' },
  avatarPublicId:{ type: String, default: '' },
  bio:           { type: String, maxlength: 500, default: '' },
  university:    { type: String, maxlength: 150, default: '' },
  country:       { type: String, maxlength: 100, default: '' },
  phone:         { type: String, maxlength: 20, default: '' },
  emailVerified: { type: Boolean, default: false },
  savedPosts:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
