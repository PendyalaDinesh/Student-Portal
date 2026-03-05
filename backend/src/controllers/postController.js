/**
 * postController.js
 * Week 3: create, read, update, delete posts
 * Week 4: category filtering
 * Week 5: category-specific fields
 * Week 6: search & filter
 * Week 7: save/unsave
 * Week 8: reviews/ratings
 */
const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');
const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// ── GET /api/posts — list with search, filter, pagination ────
const getPosts = asyncHandler(async (req, res) => {
  const {
    category, search, location,
    minPrice, maxPrice,
    sortBy = 'newest',
    page = 1, limit = 12,
    author,
  } = req.query;

  const query = { isActive: true };

  if (category) query.category = category;
  if (author)   query.author   = author;
  if (location) query.location = { $regex: location, $options: 'i' };

  // Full-text search (Week 6)
  if (search) query.$text = { $search: search };

  // Price range filter based on category (Week 6)
  if (minPrice || maxPrice) {
    const priceField = {
      housing:   'housing.rent',
      rides:     'rides.costPerPerson',
      jobs:      'jobs.payRate',
      community: 'community.price',
    }[category];
    if (priceField) {
      query[priceField] = {};
      if (minPrice) query[priceField].$gte = Number(minPrice);
      if (maxPrice) query[priceField].$lte = Number(maxPrice);
    }
  }

  const sortOptions = {
    newest:     { createdAt: -1 },
    oldest:     { createdAt:  1 },
    popular:    { views:     -1 },
    priceLow:   { 'housing.rent': 1, 'rides.costPerPerson': 1, 'jobs.payRate': 1, 'community.price': 1 },
    priceHigh:  { 'housing.rent': -1 },
  };

  const skip  = (Number(page) - 1) * Number(limit);
  const total = await Post.countDocuments(query);

  const posts = await Post.find(query)
    .sort(sortOptions[sortBy] || sortOptions.newest)
    .skip(skip)
    .limit(Number(limit))
    .populate('author', 'name avatar university');

  res.json({
    posts,
    pagination: {
      total,
      page:     Number(page),
      limit:    Number(limit),
      pages:    Math.ceil(total / Number(limit)),
      hasMore:  skip + posts.length < total,
    },
  });
});

// ── GET /api/posts/:id — single post ─────────────────────────
const getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'name avatar bio university email phone createdAt')
    .populate('reviews.user', 'name avatar');

  if (!post || !post.isActive) {
    res.status(404); throw new Error('Post not found');
  }

  // Increment view count
  post.views += 1;
  await post.save();

  res.json(post);
});

// ── POST /api/posts — create post ────────────────────────────
const createPost = asyncHandler(async (req, res) => {
  const { category } = req.body;

  const images = req.files?.map(f => ({ url: f.path, publicId: f.filename })) || [];

  // Build category-specific data from request body
  const categoryData = buildCategoryData(category, req.body);

  const post = await Post.create({
    ...req.body,
    ...categoryData,
    author: req.user._id,
    images,
    contactEmail: req.user.email,
  });

  await post.populate('author', 'name avatar university');
  res.status(201).json(post);
});

// ── PUT /api/posts/:id — update post ─────────────────────────
const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) { res.status(404); throw new Error('Post not found'); }
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized to edit this post');
  }

  const newImages = req.files?.map(f => ({ url: f.path, publicId: f.filename })) || [];

  // Handle image removal
  if (req.body.removeImages) {
    const toRemove = JSON.parse(req.body.removeImages);
    for (const pid of toRemove) {
      await cloudinary.uploader.destroy(pid);
    }
    post.images = post.images.filter(img => !toRemove.includes(img.publicId));
  }

  post.images = [...post.images, ...newImages];

  const categoryData = buildCategoryData(post.category, req.body);
  Object.assign(post, req.body, categoryData);

  const updated = await post.save();
  await updated.populate('author', 'name avatar university');
  res.json(updated);
});

// ── DELETE /api/posts/:id ─────────────────────────────────────
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) { res.status(404); throw new Error('Post not found'); }
  if (post.author.toString() !== req.user._id.toString()) {
    res.status(403); throw new Error('Not authorized to delete this post');
  }

  // Delete images from Cloudinary
  for (const img of post.images) {
    if (img.publicId) await cloudinary.uploader.destroy(img.publicId);
  }

  await post.deleteOne();
  res.json({ message: 'Post deleted successfully' });
});

// ── POST /api/posts/:id/save — toggle save (Week 7) ──────────
const toggleSave = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) { res.status(404); throw new Error('Post not found'); }

  const userId = req.user._id;
  const isSaved = post.savedBy.includes(userId);

  if (isSaved) {
    post.savedBy.pull(userId);
    await User.findByIdAndUpdate(userId, { $pull: { savedPosts: post._id } });
  } else {
    post.savedBy.push(userId);
    await User.findByIdAndUpdate(userId, { $addToSet: { savedPosts: post._id } });
  }
  await post.save();

  res.json({ saved: !isSaved, savedCount: post.savedBy.length });
});

// ── POST /api/posts/:id/review — add review (Week 8) ─────────
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) { res.status(404); throw new Error('Post not found'); }

  // One review per user
  const existing = post.reviews.find(r => r.user.toString() === req.user._id.toString());
  if (existing) { res.status(400); throw new Error('Already reviewed this post'); }

  post.reviews.push({ user: req.user._id, rating: Number(rating), comment });
  await post.save();
  await post.populate('reviews.user', 'name avatar');
  res.status(201).json(post.reviews);
});

// ── Helper: extract category fields from body ─────────────────
const buildCategoryData = (category, body) => {
  const data = {};
  if (category === 'housing') {
    data.housing = {
      type: body['housing.type'] || '',
      rent: body['housing.rent'] ? Number(body['housing.rent']) : null,
      deposit: body['housing.deposit'] ? Number(body['housing.deposit']) : null,
      bedrooms: body['housing.bedrooms'] ? Number(body['housing.bedrooms']) : null,
      bathrooms: body['housing.bathrooms'] ? Number(body['housing.bathrooms']) : null,
      availableFrom: body['housing.availableFrom'] || null,
      utilities: body['housing.utilities'] === 'true',
      petFriendly: body['housing.petFriendly'] === 'true',
      furnished: body['housing.furnished'] === 'true',
    };
  }
  if (category === 'rides') {
    data.rides = {
      from: body['rides.from'] || '',
      to: body['rides.to'] || '',
      departureDate: body['rides.departureDate'] || null,
      departureTime: body['rides.departureTime'] || '',
      seats: body['rides.seats'] ? Number(body['rides.seats']) : null,
      costPerPerson: body['rides.costPerPerson'] ? Number(body['rides.costPerPerson']) : null,
      recurring: body['rides.recurring'] === 'true',
    };
  }
  if (category === 'jobs') {
    data.jobs = {
      jobType: body['jobs.jobType'] || '',
      hoursPerWeek: body['jobs.hoursPerWeek'] ? Number(body['jobs.hoursPerWeek']) : null,
      payRate: body['jobs.payRate'] ? Number(body['jobs.payRate']) : null,
      requiredSkills: body['jobs.requiredSkills'] ? body['jobs.requiredSkills'].split(',').map(s => s.trim()) : [],
      workAuthRequired: body['jobs.workAuthRequired'] === 'true',
      applicationUrl: body['jobs.applicationUrl'] || '',
      deadline: body['jobs.deadline'] || null,
    };
  }
  if (category === 'community') {
    data.community = {
      subCategory: body['community.subCategory'] || '',
      price: body['community.price'] ? Number(body['community.price']) : null,
      eventDate: body['community.eventDate'] || null,
      condition: body['community.condition'] || '',
      negotiable: body['community.negotiable'] === 'true',
    };
  }
  return data;
};

module.exports = { getPosts, getPost, createPost, updatePost, deletePost, toggleSave, addReview };
