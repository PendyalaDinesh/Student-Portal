// ============================================
// ACCOMMODATION MODEL - Housing Marketplace
// models/Accommodation.js
// ============================================

const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  type: {
    type: String,
    enum: ['Apartment', 'House', 'Room', 'Studio', 'Shared', 'Other'],
    required: true
  },
  
  address: {
    street: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  rent: {
    type: Number,
    required: [true, 'Please provide rent amount'],
    min: 0
  },
  
  bedrooms: {
    type: Number,
    required: true,
    min: 0
  },
  
  bathrooms: {
    type: Number,
    required: true,
    min: 0
  },
  
  squareFeet: {
    type: Number,
    min: 0
  },
  
  amenities: [{
    type: String,
    enum: ['WiFi', 'Parking', 'Laundry', 'Gym', 'Pool', 'AC', 'Heating', 
           'Dishwasher', 'Balcony', 'Storage', 'Elevator', 'Security']
  }],
  
  images: [{
    type: String // URLs
  }],
  
  availableFrom: {
    type: Date,
    required: true
  },
  
  leaseDuration: {
    type: String,
    enum: ['Month-to-Month', '3 Months', '6 Months', 'Academic Year', '1 Year', 'Flexible'],
    default: 'Flexible'
  },
  
  utilities: {
    type: String,
    enum: ['Included', 'Not Included', 'Partially Included'],
    default: 'Not Included'
  },
  
  petFriendly: {
    type: Boolean,
    default: false
  },
  
  furnished: {
    type: Boolean,
    default: false
  },
  
  contactEmail: String,
  contactPhone: String,
  
  isAvailable: {
    type: Boolean,
    default: true
  },
  
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  views: {
    type: Number,
    default: 0
  }
  
}, {
  timestamps: true
});

// Indexes
accommodationSchema.index({ city: 1, state: 1 });
accommodationSchema.index({ rent: 1 });
accommodationSchema.index({ availableFrom: 1 });
accommodationSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Accommodation', accommodationSchema);
