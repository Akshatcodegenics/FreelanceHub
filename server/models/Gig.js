const mongoose = require('mongoose');
const { generateSlug, generateSearchKeywords } = require('../utils/helpers');

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Gig title is required'],
    trim: true,
    minlength: [10, 'Title must be at least 10 characters'],
    maxlength: [80, 'Title cannot exceed 80 characters'],
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Gig description is required'],
    trim: true,
    minlength: [50, 'Description must be at least 50 characters'],
    maxlength: [1200, 'Description cannot exceed 1200 characters'],
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller is required'],
    index: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'programming-tech',
      'graphics-design',
      'digital-marketing',
      'writing-translation',
      'video-animation',
      'music-audio',
      'business',
      'lifestyle',
      'data',
      'photography',
    ],
    index: true,
  },
  subcategory: {
    type: String,
    required: [true, 'Subcategory is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [5, 'Price must be at least $5'],
    max: [10000, 'Price cannot exceed $10,000'],
  },
  deliveryTime: {
    type: Number,
    required: [true, 'Delivery time is required'],
    min: [1, 'Delivery time must be at least 1 day'],
    max: [30, 'Delivery time cannot exceed 30 days'],
  },
  revisions: {
    type: Number,
    default: 1,
    min: [0, 'Revisions cannot be negative'],
    max: [10, 'Maximum 10 revisions allowed'],
  },
  images: [{
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: '',
    },
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Each tag cannot exceed 30 characters'],
  }],
  searchKeywords: [{
    type: String,
    index: true,
  }],
  features: [{
    type: String,
    trim: true,
    maxlength: [100, 'Each feature cannot exceed 100 characters'],
  }],
  requirements: {
    type: String,
    trim: true,
    maxlength: [500, 'Requirements cannot exceed 500 characters'],
    default: '',
  },
  // Gig packages (Basic, Standard, Premium)
  packages: {
    basic: {
      name: {
        type: String,
        default: 'Basic',
      },
      description: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: [5, 'Package price must be at least $5'],
      },
      deliveryTime: {
        type: Number,
        required: true,
        min: [1, 'Delivery time must be at least 1 day'],
      },
      revisions: {
        type: Number,
        default: 1,
        min: [0, 'Revisions cannot be negative'],
      },
      features: [{
        type: String,
        trim: true,
      }],
    },
    standard: {
      name: {
        type: String,
        default: 'Standard',
      },
      description: String,
      price: {
        type: Number,
        min: [5, 'Package price must be at least $5'],
      },
      deliveryTime: {
        type: Number,
        min: [1, 'Delivery time must be at least 1 day'],
      },
      revisions: {
        type: Number,
        default: 2,
        min: [0, 'Revisions cannot be negative'],
      },
      features: [{
        type: String,
        trim: true,
      }],
    },
    premium: {
      name: {
        type: String,
        default: 'Premium',
      },
      description: String,
      price: {
        type: Number,
        min: [5, 'Package price must be at least $5'],
      },
      deliveryTime: {
        type: Number,
        min: [1, 'Delivery time must be at least 1 day'],
      },
      revisions: {
        type: Number,
        default: 3,
        min: [0, 'Revisions cannot be negative'],
      },
      features: [{
        type: String,
        trim: true,
      }],
    },
  },
  // Gig statistics
  stats: {
    views: {
      type: Number,
      default: 0,
    },
    orders: {
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
    totalEarnings: {
      type: Number,
      default: 0,
    },
    responseTime: {
      type: Number, // in hours
      default: 24,
    },
  },
  // Gig status
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'denied'],
    default: 'draft',
    index: true,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  // SEO and metadata
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters'],
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters'],
  },
  // Timestamps
  publishedAt: {
    type: Date,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better performance
gigSchema.index({ seller: 1, status: 1 });
gigSchema.index({ category: 1, subcategory: 1 });
gigSchema.index({ price: 1 });
gigSchema.index({ 'stats.averageRating': -1 });
gigSchema.index({ 'stats.orders': -1 });
gigSchema.index({ createdAt: -1 });
gigSchema.index({ searchKeywords: 1 });
gigSchema.index({ tags: 1 });

// Text search index
gigSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  searchKeywords: 'text',
});

// Virtual for gig URL
gigSchema.virtual('url').get(function() {
  return `/gigs/${this.slug}`;
});

// Virtual for reviews
gigSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'gig',
});

// Virtual for orders
gigSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'gig',
});

// Pre-save middleware to generate slug and search keywords
gigSchema.pre('save', function(next) {
  // Generate slug if title is modified
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title) + '-' + this._id.toString().slice(-6);
  }

  // Generate search keywords
  if (this.isModified('title') || this.isModified('description') || this.isModified('tags')) {
    const searchText = `${this.title} ${this.description} ${this.tags.join(' ')}`;
    this.searchKeywords = generateSearchKeywords(searchText);
  }

  // Update lastModified
  this.lastModified = new Date();

  // Set publishedAt when status changes to active
  if (this.isModified('status') && this.status === 'active' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

// Instance method to update stats
gigSchema.methods.updateStats = function(updates) {
  Object.keys(updates).forEach(key => {
    if (this.stats[key] !== undefined) {
      this.stats[key] = updates[key];
    }
  });
  return this.save();
};

// Instance method to increment views
gigSchema.methods.incrementViews = function() {
  this.stats.views += 1;
  return this.save({ validateBeforeSave: false });
};

// Static method to find active gigs
gigSchema.statics.findActive = function() {
  return this.find({ status: 'active', isActive: true });
};

// Static method to find by category
gigSchema.statics.findByCategory = function(category, subcategory = null) {
  const query = { category, status: 'active', isActive: true };
  if (subcategory) {
    query.subcategory = subcategory;
  }
  return this.find(query);
};

// Static method to search gigs
gigSchema.statics.searchGigs = function(searchTerm, filters = {}) {
  const query = {
    status: 'active',
    isActive: true,
    ...filters,
  };

  if (searchTerm) {
    query.$text = { $search: searchTerm };
  }

  return this.find(query, searchTerm ? { score: { $meta: 'textScore' } } : {})
    .sort(searchTerm ? { score: { $meta: 'textScore' } } : { createdAt: -1 });
};

module.exports = mongoose.model('Gig', gigSchema);
