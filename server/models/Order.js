const mongoose = require('mongoose');
const { generateOrderId, calculateDeliveryDate } = require('../utils/helpers');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
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
  // Package details
  package: {
    type: {
      type: String,
      enum: ['basic', 'standard', 'premium'],
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative'],
    },
    deliveryTime: {
      type: Number,
      required: true,
      min: [1, 'Delivery time must be at least 1 day'],
    },
    revisions: {
      type: Number,
      required: true,
      min: [0, 'Revisions cannot be negative'],
    },
    features: [{
      type: String,
    }],
  },
  // Order details
  requirements: {
    type: String,
    trim: true,
    maxlength: [1000, 'Requirements cannot exceed 1000 characters'],
    default: '',
  },
  attachments: [{
    url: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  // Pricing
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative'],
  },
  serviceFee: {
    type: Number,
    required: true,
    min: [0, 'Service fee cannot be negative'],
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative'],
  },
  // Payment information
  payment: {
    stripePaymentIntentId: {
      type: String,
      required: true,
    },
    stripeChargeId: String,
    paymentMethod: {
      type: String,
      enum: ['card', 'paypal', 'bank_transfer'],
      default: 'card',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending',
      index: true,
    },
    paidAt: Date,
    refundedAt: Date,
    refundAmount: {
      type: Number,
      default: 0,
      min: [0, 'Refund amount cannot be negative'],
    },
  },
  // Order status and timeline
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'delivered', 'completed', 'cancelled', 'disputed'],
    default: 'pending',
    index: true,
  },
  timeline: {
    ordered: {
      type: Date,
      default: Date.now,
    },
    started: Date,
    delivered: Date,
    completed: Date,
    cancelled: Date,
  },
  // Delivery information
  deliveryDate: {
    type: Date,
    required: true,
  },
  deliveredWork: [{
    type: {
      type: String,
      enum: ['file', 'text', 'link'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    filename: String,
    size: Number,
    deliveredAt: {
      type: Date,
      default: Date.now,
    },
  }],
  // Revisions
  revisions: {
    requested: {
      type: Number,
      default: 0,
    },
    remaining: {
      type: Number,
      required: true,
    },
    history: [{
      requestedAt: {
        type: Date,
        required: true,
      },
      reason: {
        type: String,
        required: true,
        maxlength: [500, 'Revision reason cannot exceed 500 characters'],
      },
      deliveredAt: Date,
      work: [{
        type: {
          type: String,
          enum: ['file', 'text', 'link'],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        filename: String,
        size: Number,
      }],
    }],
  },
  // Communication
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
  },
  // Additional options
  extras: [{
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Extra price cannot be negative'],
    },
    deliveryTime: {
      type: Number,
      required: true,
      min: [0, 'Extra delivery time cannot be negative'],
    },
  }],
  // Notes and communication
  notes: {
    buyer: {
      type: String,
      maxlength: [500, 'Buyer notes cannot exceed 500 characters'],
      default: '',
    },
    seller: {
      type: String,
      maxlength: [500, 'Seller notes cannot exceed 500 characters'],
      default: '',
    },
    admin: {
      type: String,
      maxlength: [1000, 'Admin notes cannot exceed 1000 characters'],
      default: '',
    },
  },
  // Dispute information
  dispute: {
    isDisputed: {
      type: Boolean,
      default: false,
    },
    reason: String,
    description: String,
    evidence: [{
      type: String,
      url: String,
    }],
    resolution: String,
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  // Automatic completion
  autoCompleteAt: {
    type: Date,
  },
  // Metadata
  metadata: {
    userAgent: String,
    ipAddress: String,
    referrer: String,
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better performance
orderSchema.index({ seller: 1, status: 1 });
orderSchema.index({ buyer: 1, status: 1 });
orderSchema.index({ 'payment.paymentStatus': 1 });
orderSchema.index({ deliveryDate: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderId: 1 });

// Virtual for order URL
orderSchema.virtual('url').get(function() {
  return `/orders/${this.orderId}`;
});

// Virtual for days remaining
orderSchema.virtual('daysRemaining').get(function() {
  if (this.status === 'completed' || this.status === 'cancelled') {
    return 0;
  }
  const now = new Date();
  const delivery = new Date(this.deliveryDate);
  const diffTime = delivery - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Virtual for is overdue
orderSchema.virtual('isOverdue').get(function() {
  if (this.status === 'completed' || this.status === 'cancelled') {
    return false;
  }
  return new Date() > new Date(this.deliveryDate);
});

// Pre-save middleware to generate order ID and calculate delivery date
orderSchema.pre('save', function(next) {
  // Generate order ID if new
  if (this.isNew) {
    this.orderId = generateOrderId();
    this.deliveryDate = calculateDeliveryDate(this.package.deliveryTime);
    this.revisions.remaining = this.package.revisions;
    
    // Set auto-complete date (3 days after delivery)
    this.autoCompleteAt = calculateDeliveryDate(this.package.deliveryTime + 3);
  }

  // Update timeline based on status changes
  if (this.isModified('status')) {
    const now = new Date();
    switch (this.status) {
      case 'in_progress':
        if (!this.timeline.started) {
          this.timeline.started = now;
        }
        break;
      case 'delivered':
        if (!this.timeline.delivered) {
          this.timeline.delivered = now;
        }
        break;
      case 'completed':
        if (!this.timeline.completed) {
          this.timeline.completed = now;
        }
        break;
      case 'cancelled':
        if (!this.timeline.cancelled) {
          this.timeline.cancelled = now;
        }
        break;
    }
  }

  next();
});

// Instance method to request revision
orderSchema.methods.requestRevision = function(reason) {
  if (this.revisions.remaining <= 0) {
    throw new Error('No revisions remaining');
  }

  this.revisions.requested += 1;
  this.revisions.remaining -= 1;
  this.revisions.history.push({
    requestedAt: new Date(),
    reason,
  });

  this.status = 'in_progress';
  return this.save();
};

// Instance method to deliver work
orderSchema.methods.deliverWork = function(work) {
  this.deliveredWork = work;
  this.status = 'delivered';
  return this.save();
};

// Instance method to complete order
orderSchema.methods.complete = function() {
  this.status = 'completed';
  return this.save();
};

// Instance method to cancel order
orderSchema.methods.cancel = function(reason) {
  this.status = 'cancelled';
  this.notes.admin = reason || 'Order cancelled';
  return this.save();
};

// Static method to find orders by user
orderSchema.statics.findByUser = function(userId, role = 'buyer') {
  const field = role === 'seller' ? 'seller' : 'buyer';
  return this.find({ [field]: userId }).sort({ createdAt: -1 });
};

// Static method to find active orders
orderSchema.statics.findActive = function() {
  return this.find({
    status: { $in: ['pending', 'in_progress', 'delivered'] },
  });
};

// Static method to find overdue orders
orderSchema.statics.findOverdue = function() {
  return this.find({
    status: { $in: ['in_progress'] },
    deliveryDate: { $lt: new Date() },
  });
};

module.exports = mongoose.model('Order', orderSchema);
