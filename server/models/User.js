const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { generateToken } = require('../utils/helpers');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['client', 'freelancer', 'admin'],
    default: 'client',
  },
  avatar: {
    url: {
      type: String,
      default: '',
    },
    public_id: {
      type: String,
      default: '',
    },
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters'],
    default: '',
  },
  skills: [{
    type: String,
    trim: true,
  }],
  languages: [{
    language: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ['basic', 'conversational', 'fluent', 'native'],
      required: true,
    },
  }],
  location: {
    country: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    timezone: {
      type: String,
      default: '',
    },
  },
  contact: {
    phone: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
  },
  // Freelancer specific fields
  hourlyRate: {
    type: Number,
    min: [5, 'Hourly rate must be at least $5'],
    max: [1000, 'Hourly rate cannot exceed $1000'],
  },
  availability: {
    type: String,
    enum: ['full-time', 'part-time', 'as-needed'],
    default: 'as-needed',
  },
  // Account status
  isActive: {
    type: Boolean,
    default: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  // Password reset
  passwordResetToken: String,
  passwordResetExpires: Date,
  // Statistics
  stats: {
    totalEarnings: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    completedOrders: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    responseTime: {
      type: Number, // in hours
      default: 24,
    },
  },
  // Preferences
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    smsNotifications: {
      type: Boolean,
      default: false,
    },
    marketingEmails: {
      type: Boolean,
      default: true,
    },
  },
  // Account dates
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'stats.averageRating': -1 });
userSchema.index({ createdAt: -1 });

// Virtual for user's full profile URL
userSchema.virtual('profileUrl').get(function() {
  return `/users/${this._id}`;
});

// Virtual for user's gigs (will be populated when needed)
userSchema.virtual('gigs', {
  ref: 'Gig',
  localField: '_id',
  foreignField: 'seller',
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Pre-save middleware to update lastLogin
userSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('lastLogin')) {
    this.lastLogin = new Date();
  }
  next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to generate JWT token
userSchema.methods.getSignedJwtToken = function() {
  return generateToken(this._id);
};

// Instance method to generate email verification token
userSchema.methods.getEmailVerificationToken = function() {
  // Generate token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to emailVerificationToken field
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Set expire
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

// Instance method to generate password reset token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Instance method to update stats
userSchema.methods.updateStats = function(updates) {
  Object.keys(updates).forEach(key => {
    if (this.stats[key] !== undefined) {
      this.stats[key] = updates[key];
    }
  });
  return this.save();
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find active users
userSchema.statics.findActive = function() {
  return this.find({ isActive: true });
};

module.exports = mongoose.model('User', userSchema);
