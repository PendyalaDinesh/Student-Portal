// ============================================
// RIDE MODEL - Ride Sharing System
// models/Ride.js
// ============================================

const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  departure: {
    location: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String,
      required: true
    }
  },
  
  destination: {
    location: {
      type: String,
      required: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    },
    estimatedArrival: Date
  },
  
  seatsAvailable: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  
  seatsBooked: {
    type: Number,
    default: 0,
    min: 0
  },
  
  pricePerSeat: {
    type: Number,
    required: true,
    min: 0
  },
  
  vehicleInfo: {
    make: String,
    model: String,
    color: String,
    licensePlate: String
  },
  
  passengers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    seatsBooked: {
      type: Number,
      min: 1
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled'],
      default: 'Confirmed'
    },
    bookedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  preferences: {
    smokingAllowed: {
      type: Boolean,
      default: false
    },
    petsAllowed: {
      type: Boolean,
      default: false
    },
    musicPreference: String,
    luggageSpace: String
  },
  
  status: {
    type: String,
    enum: ['Open', 'Full', 'Completed', 'Cancelled'],
    default: 'Open'
  },
  
  description: {
    type: String,
    maxlength: 500
  }
  
}, {
  timestamps: true
});

// Indexes
rideSchema.index({ 'departure.date': 1 });
rideSchema.index({ 'departure.location': 1, 'destination.location': 1 });
rideSchema.index({ status: 1 });

// Update status based on seats
rideSchema.pre('save', function(next) {
  if (this.seatsBooked >= this.seatsAvailable) {
    this.status = 'Full';
  } else if (this.seatsBooked < this.seatsAvailable && this.status === 'Full') {
    this.status = 'Open';
  }
  next();
});

module.exports = mongoose.model('Ride', rideSchema);
