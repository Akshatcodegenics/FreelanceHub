const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order is required'],
    unique: true, // One review per order
    index: true,
  },
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: [true, 'Gig is required'],
    index: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller is required'],
    index: true,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer is required'],
    index: true,
  },
  // Rating breakdown
  rating: {
    overall: {
      type: Number,
      required: [true, 'Overall rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      index: true,
    },
    communication: {
      type: Number,
      min: [1, 'Communication rating must be at least 1'],
      max: [5, 'Communication rating cannot exceed 5'],
    },
    serviceAsDescribed: {
      type: Number,
      min: [1, 'Service as described rating must be at least 1'],
      max: [5, 'Service as described rating cannot exceed 5'],
    },
    buyAgain: {
      type: Number,
      min: [1, 'Buy again rating must be at least 1'],
      max: [5, 'Buy again rating cannot exceed 5'],
    },
  },
  // Review content
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [500, 'Comment cannot exceed 500 characters'],
  },
  // Review response from seller
  response: {
    comment: {
      type: String,
      trim: true,
      maxlength: [300, 'Response cannot exceed 300 characters'],
    },
    respondedAt: {
      type: Date,
    },
  },
  // Review status
  status: {
    type: String,
    enum: ['pending', 'published', 'hidden', 'flagged'],
    default: 'published',
    index: true,
  },
  // Helpful votes
  helpful: {
    count: {
      type: Number,
      default: 0,
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  // Review flags and moderation
  flags: {
    count: {
      type: Number,
      default: 0,
    },
    reasons: [{
      type: String,
      enum: ['inappropriate', 'spam', 'fake', 'offensive', 'other'],
    }],
    flaggedBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reason: {
        type: String,
        enum: ['inappropriate', 'spam', 'fake', 'offensive', 'other'],
      },
      flaggedAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  // Moderation
  moderation: {
    isModerated: {
      type: Boolean,
      default: false,
    },
    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    moderatedAt: Date,
    moderationNotes: {
      type: String,
      maxlength: [500, 'Moderation notes cannot exceed 500 characters'],
    },
  },
  // Metadata
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceType: String,
  },
  // Timestamps
  publishedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better performance
reviewSchema.index({ gig: 1, status: 1 });
reviewSchema.index({ seller: 1, status: 1 });
reviewSchema.index({ buyer: 1 });
reviewSchema.index({ 'rating.overall': -1 });
reviewSchema.index({ publishedAt: -1 });
reviewSchema.index({ createdAt: -1 });

// Compound indexes
reviewSchema.index({ gig: 1, 'rating.overall': -1, publishedAt: -1 });
reviewSchema.index({ seller: 1, 'rating.overall': -1, publishedAt: -1 });

// Virtual for review age
reviewSchema.virtual('age').get(function() {
  const now = new Date();
  const diffTime = now - this.publishedAt;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
});

// Virtual for is helpful
reviewSchema.virtual('isHelpful').get(function() {
  return this.helpful.count > 0;
});

// Virtual for average rating (if breakdown ratings exist)
reviewSchema.virtual('averageRating').get(function() {
  const ratings = [];
  if (this.rating.communication) ratings.push(this.rating.communication);
  if (this.rating.serviceAsDescribed) ratings.push(this.rating.serviceAsDescribed);
  if (this.rating.buyAgain) ratings.push(this.rating.buyAgain);
  
  if (ratings.length === 0) return this.rating.overall;
  
  const sum = ratings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
});

// Pre-save middleware
reviewSchema.pre('save', function(next) {
  // Set published date when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Set response date when response is added
  if (this.isModified('response.comment') && this.response.comment && !this.response.respondedAt) {
    this.response.respondedAt = new Date();
  }

  next();
});

// Post-save middleware to update gig and user statistics
reviewSchema.post('save', async function(doc) {
  try {
    if (doc.status === 'published') {
      // Update gig statistics
      const Gig = mongoose.model('Gig');
      const gig = await Gig.findById(doc.gig);
      if (gig) {
        const Review = mongoose.model('Review');
        const reviews = await Review.find({ 
          gig: doc.gig, 
          status: 'published' 
        });
        
        const totalReviews = reviews.length;
        const averageRating = reviews.reduce((sum, review) => sum + review.rating.overall, 0) / totalReviews;
        
        await Gig.findByIdAndUpdate(doc.gig, {
          'stats.totalReviews': totalReviews,
          'stats.averageRating': Math.round(averageRating * 10) / 10,
        });
      }

      // Update seller statistics
      const User = mongoose.model('User');
      const seller = await User.findById(doc.seller);
      if (seller) {
        const Review = mongoose.model('Review');
        const sellerReviews = await Review.find({ 
          seller: doc.seller, 
          status: 'published' 
        });
        
        const totalReviews = sellerReviews.length;
        const averageRating = sellerReviews.reduce((sum, review) => sum + review.rating.overall, 0) / totalReviews;
        
        await User.findByIdAndUpdate(doc.seller, {
          'stats.totalReviews': totalReviews,
          'stats.averageRating': Math.round(averageRating * 10) / 10,
        });
      }
    }
  } catch (error) {
    console.error('Error updating statistics after review save:', error);
  }
});

// Instance method to mark as helpful
reviewSchema.methods.markHelpful = function(userId) {
  if (!this.helpful.users.includes(userId)) {
    this.helpful.users.push(userId);
    this.helpful.count += 1;
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to unmark as helpful
reviewSchema.methods.unmarkHelpful = function(userId) {
  const index = this.helpful.users.indexOf(userId);
  if (index > -1) {
    this.helpful.users.splice(index, 1);
    this.helpful.count = Math.max(0, this.helpful.count - 1);
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to flag review
reviewSchema.methods.flag = function(userId, reason) {
  const existingFlag = this.flags.flaggedBy.find(flag => 
    flag.user.toString() === userId.toString()
  );
  
  if (!existingFlag) {
    this.flags.flaggedBy.push({
      user: userId,
      reason,
      flaggedAt: new Date(),
    });
    this.flags.count += 1;
    
    if (!this.flags.reasons.includes(reason)) {
      this.flags.reasons.push(reason);
    }
    
    // Auto-hide if flagged multiple times
    if (this.flags.count >= 5) {
      this.status = 'flagged';
    }
    
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Instance method to respond to review
reviewSchema.methods.respond = function(responseComment) {
  this.response.comment = responseComment;
  this.response.respondedAt = new Date();
  return this.save();
};

// Static method to find reviews by gig
reviewSchema.statics.findByGig = function(gigId, options = {}) {
  const query = { gig: gigId, status: 'published' };
  return this.find(query)
    .populate('buyer', 'name avatar')
    .sort(options.sort || { publishedAt: -1 })
    .limit(options.limit || 10);
};

// Static method to find reviews by seller
reviewSchema.statics.findBySeller = function(sellerId, options = {}) {
  const query = { seller: sellerId, status: 'published' };
  return this.find(query)
    .populate('buyer', 'name avatar')
    .populate('gig', 'title slug')
    .sort(options.sort || { publishedAt: -1 })
    .limit(options.limit || 10);
};

// Static method to get review statistics
reviewSchema.statics.getStatistics = function(gigId) {
  return this.aggregate([
    { $match: { gig: mongoose.Types.ObjectId(gigId), status: 'published' } },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating.overall' },
        ratingDistribution: {
          $push: '$rating.overall'
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalReviews: 1,
        averageRating: { $round: ['$averageRating', 1] },
        ratingDistribution: {
          5: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 5] } } } },
          4: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 4] } } } },
          3: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 3] } } } },
          2: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 2] } } } },
          1: { $size: { $filter: { input: '$ratingDistribution', cond: { $eq: ['$$this', 1] } } } },
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Review', reviewSchema);
