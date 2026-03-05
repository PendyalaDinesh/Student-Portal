/**
 * Post.js — Unified post model for all 4 categories
 * Week 1: schema design
 * Week 3: core fields
 * Week 4: category field
 * Week 5: category-specific sub-documents
 */
const mongoose = require('mongoose');

// ── Review sub-document (Week 8) ────────────────────────────
const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating:  { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 500, default: '' },
}, { timestamps: true });

const postSchema = new mongoose.Schema({

  // ── Core fields (Week 3) ────────────────────────────────────
  title:       { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String, required: true, trim: true, maxlength: 3000 },
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  images:      [{ url: String, publicId: String }],
  location:    { type: String, trim: true, maxlength: 200, default: '' },
  contactEmail:{ type: String, default: '' },
  isActive:    { type: Boolean, default: true },
  views:       { type: Number, default: 0 },
  savedBy:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reviews:     [reviewSchema],

  // ── Category (Week 4) ───────────────────────────────────────
  category: {
    type: String,
    required: true,
    enum: ['housing', 'rides', 'jobs', 'community'],
    index: true,
  },

  // ── Housing-specific fields (Week 5) ─────────────────────────
  housing: {
    type:        { type: String, enum: ['Room', 'Apartment', 'House', 'Studio', 'Other', ''], default: '' },
    rent:        { type: Number, min: 0, default: null },
    deposit:     { type: Number, min: 0, default: null },
    bedrooms:    { type: Number, min: 0, default: null },
    bathrooms:   { type: Number, min: 0, default: null },
    availableFrom: { type: Date, default: null },
    utilities:   { type: Boolean, default: false },
    petFriendly: { type: Boolean, default: false },
    furnished:   { type: Boolean, default: false },
  },

  // ── Ride-specific fields (Week 5) ────────────────────────────
  rides: {
    from:           { type: String, default: '' },
    to:             { type: String, default: '' },
    departureDate:  { type: Date, default: null },
    departureTime:  { type: String, default: '' },
    seats:          { type: Number, min: 1, default: null },
    costPerPerson:  { type: Number, min: 0, default: null },
    recurring:      { type: Boolean, default: false },
  },

  // ── Job-specific fields (Week 5) ─────────────────────────────
  jobs: {
    jobType:          { type: String, enum: ['On-campus', 'Off-campus', 'Remote', 'Hybrid', ''], default: '' },
    hoursPerWeek:     { type: Number, min: 1, default: null },
    payRate:          { type: Number, min: 0, default: null },
    requiredSkills:   [String],
    workAuthRequired: { type: Boolean, default: false },
    applicationUrl:   { type: String, default: '' },
    deadline:         { type: Date, default: null },
  },

  // ── Community-specific fields (Week 5) ───────────────────────
  community: {
    subCategory: { type: String, enum: ['Buy/Sell', 'Events', 'Q&A', 'General', ''], default: '' },
    price:       { type: Number, min: 0, default: null },
    eventDate:   { type: Date, default: null },
    condition:   { type: String, enum: ['New', 'Like New', 'Good', 'Fair', 'Poor', ''], default: '' },
    negotiable:  { type: Boolean, default: false },
  },

}, { timestamps: true });

// Full-text search index (Week 6)
postSchema.index({ title: 'text', description: 'text', location: 'text' });
// Compound index for common queries
postSchema.index({ category: 1, isActive: 1, createdAt: -1 });

// Virtual: average rating
postSchema.virtual('avgRating').get(function () {
  if (!this.reviews.length) return 0;
  const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
  return Math.round((sum / this.reviews.length) * 10) / 10;
});
postSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);
