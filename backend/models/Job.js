// ============================================
// JOB MODEL - Job Board & Applications
// models/Job.js
// ============================================

const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true
  },
  
  companyLogo: {
    type: String
  },
  
  description: {
    type: String,
    required: [true, 'Please provide job description'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  type: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Internship', 'Co-op', 'Contract', 'Temporary'],
    required: true
  },
  
  location: {
    city: String,
    state: String,
    remote: {
      type: Boolean,
      default: false
    }
  },
  
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    },
    period: {
      type: String,
      enum: ['Hourly', 'Monthly', 'Yearly'],
      default: 'Yearly'
    }
  },
  
  requirements: [{
    type: String
  }],
  
  skills: [{
    type: String
  }],
  
  benefits: [{
    type: String
  }],
  
  applicationDeadline: {
    type: Date
  },
  
  applicationUrl: {
    type: String
  },
  
  contactEmail: {
    type: String
  },
  
  applicants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resume: String,
    coverLetter: String,
    status: {
      type: String,
      enum: ['Applied', 'Reviewing', 'Interview', 'Rejected', 'Accepted'],
      default: 'Applied'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  views: {
    type: Number,
    default: 0
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
  
}, {
  timestamps: true
});

// Indexes
jobSchema.index({ type: 1 });
jobSchema.index({ 'location.city': 1, 'location.state': 1 });
jobSchema.index({ skills: 1 });
jobSchema.index({ isActive: 1 });
jobSchema.index({ createdAt: -1 });

// Virtual for applicants count
jobSchema.virtual('applicantsCount').get(function() {
  return this.applicants.length;
});

module.exports = mongoose.model('Job', jobSchema);
