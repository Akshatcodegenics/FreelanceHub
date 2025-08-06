const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: [true, 'Conversation is required'],
    index: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required'],
    index: true,
  },
  type: {
    type: String,
    enum: ['text', 'file', 'image', 'system', 'order_update', 'voice', 'video', 'email', 'payment_request', 'payment_receipt'],
    default: 'text',
    index: true,
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters'],
  },
  // File attachments
  attachments: [{
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    // Enhanced fields for new features
    attachmentType: {
      type: String,
      enum: ['image', 'document', 'video', 'audio', 'voice', 'pdf', 'zip', 'other'],
      default: 'other',
    },
    // For images and videos
    dimensions: {
      width: Number,
      height: Number,
    },
    // For videos/audio/voice messages
    duration: Number,
    // Thumbnail for videos
    thumbnail: String,
    // Waveform data for voice messages
    waveform: [Number],
    // AI-generated labels for smart categorization
    aiLabels: [String],
    // Preview text for documents
    previewText: String,
  }],
  // Message status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent',
    index: true,
  },
  // Read receipts
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  }],
  // Message reactions
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    emoji: {
      type: String,
      required: true,
      enum: ['👍', '👎', '❤️', '😂', '😮', '😢', '😡'],
    },
    reactedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  // Reply to another message
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  // Message editing
  edited: {
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: Date,
    originalContent: String,
    editHistory: [{
      content: String,
      editedAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  // System message data
  systemData: {
    type: {
      type: String,
      enum: [
        'order_created',
        'order_started',
        'order_delivered',
        'order_completed',
        'order_cancelled',
        'revision_requested',
        'deadline_extended',
        'user_joined',
        'user_left',
      ],
    },
    data: mongoose.Schema.Types.Mixed,
  },
  // Payment data for payment messages
  paymentData: {
    stripePaymentIntentId: String,
    amount: Number,
    currency: {
      type: String,
      default: 'usd',
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'cancelled'],
    },
    description: String,
    invoiceUrl: String,
    receiptUrl: String,
  },
  // Voice message specific data
  voiceData: {
    duration: Number,
    waveform: [Number],
    transcription: String,
    isTranscribed: {
      type: Boolean,
      default: false,
    },
  },
  // Email thread data
  emailData: {
    subject: String,
    isRichText: {
      type: Boolean,
      default: false,
    },
    htmlContent: String,
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal',
    },
  },
  // AI features data
  aiData: {
    summary: String,
    suggestedReplies: [String],
    translatedContent: [{
      language: String,
      content: String,
    }],
    toxicityScore: Number,
    isToxic: {
      type: Boolean,
      default: false,
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
    },
  },
  // Message flags and moderation
  flags: {
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isFlagged: {
      type: Boolean,
      default: false,
    },
    flaggedAt: Date,
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    flagReason: {
      type: String,
      enum: ['spam', 'inappropriate', 'harassment', 'other'],
    },
  },
  // Delivery tracking
  delivery: {
    sentAt: {
      type: Date,
      default: Date.now,
    },
    deliveredAt: Date,
    failedAt: Date,
    retryCount: {
      type: Number,
      default: 0,
    },
    errorMessage: String,
  },
  // Metadata
  metadata: {
    userAgent: String,
    ipAddress: String,
    deviceType: String,
    messageId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better performance
messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ conversation: 1, status: 1 });
messageSchema.index({ 'flags.isDeleted': 1 });
messageSchema.index({ type: 1 });

// Virtual for message age
messageSchema.virtual('age').get(function() {
  const now = new Date();
  const diffTime = now - this.createdAt;
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return this.createdAt.toLocaleDateString();
});

// Virtual for is read by user
messageSchema.virtual('isReadBy').get(function() {
  return function(userId) {
    return this.readBy.some(read => 
      read.user.toString() === userId.toString()
    );
  };
});

// Virtual for reaction count
messageSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

// Virtual for has attachments
messageSchema.virtual('hasAttachments').get(function() {
  return this.attachments && this.attachments.length > 0;
});

// Pre-save middleware
messageSchema.pre('save', function(next) {
  // Generate unique message ID if not exists
  if (this.isNew && !this.metadata.messageId) {
    this.metadata.messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Set delivery timestamp
  if (this.isNew) {
    this.delivery.sentAt = new Date();
  }

  // Update status based on read receipts
  if (this.readBy.length > 0 && this.status === 'delivered') {
    this.status = 'read';
  }

  next();
});

// Post-save middleware to update conversation
messageSchema.post('save', async function(doc) {
  try {
    if (!doc.flags.isDeleted) {
      const Conversation = mongoose.model('Conversation');
      const conversation = await Conversation.findById(doc.conversation);
      
      if (conversation) {
        // Update last message in conversation
        await conversation.updateLastMessage(doc);
        
        // Increment unread count for other participants
        await conversation.incrementUnreadCount(doc.sender);
      }
    }
  } catch (error) {
    console.error('Error updating conversation after message save:', error);
  }
});

// Instance method to mark as read by user
messageSchema.methods.markAsRead = function(userId) {
  const existingRead = this.readBy.find(read => 
    read.user.toString() === userId.toString()
  );
  
  if (!existingRead) {
    this.readBy.push({
      user: userId,
      readAt: new Date(),
    });
    
    // Update status if this is the first read
    if (this.status === 'delivered') {
      this.status = 'read';
    }
    
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Instance method to add reaction
messageSchema.methods.addReaction = function(userId, emoji) {
  // Remove existing reaction from this user
  this.reactions = this.reactions.filter(reaction => 
    reaction.user.toString() !== userId.toString()
  );
  
  // Add new reaction
  this.reactions.push({
    user: userId,
    emoji,
    reactedAt: new Date(),
  });
  
  return this.save();
};

// Instance method to remove reaction
messageSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(reaction => 
    reaction.user.toString() !== userId.toString()
  );
  
  return this.save();
};

// Instance method to edit message
messageSchema.methods.editContent = function(newContent) {
  // Store original content if first edit
  if (!this.edited.isEdited) {
    this.edited.originalContent = this.content;
  }
  
  // Add to edit history
  this.edited.editHistory.push({
    content: this.content,
    editedAt: new Date(),
  });
  
  // Update content and edit status
  this.content = newContent;
  this.edited.isEdited = true;
  this.edited.editedAt = new Date();
  
  return this.save();
};

// Instance method to soft delete message
messageSchema.methods.softDelete = function(deletedBy) {
  this.flags.isDeleted = true;
  this.flags.deletedAt = new Date();
  this.flags.deletedBy = deletedBy;
  this.content = 'This message has been deleted';
  
  return this.save();
};

// Instance method to flag message
messageSchema.methods.flag = function(flaggedBy, reason) {
  this.flags.isFlagged = true;
  this.flags.flaggedAt = new Date();
  this.flags.flaggedBy = flaggedBy;
  this.flags.flagReason = reason;
  
  return this.save();
};

// Static method to find messages by conversation
messageSchema.statics.findByConversation = function(conversationId, options = {}) {
  const query = {
    conversation: conversationId,
    'flags.isDeleted': false,
  };
  
  return this.find(query)
    .populate('sender', 'name avatar')
    .populate('replyTo', 'content sender')
    .sort({ createdAt: options.sort || 1 })
    .limit(options.limit || 50)
    .skip(options.skip || 0);
};

// Static method to find unread messages for user
messageSchema.statics.findUnreadForUser = function(userId) {
  return this.find({
    'readBy.user': { $ne: userId },
    sender: { $ne: userId },
    'flags.isDeleted': false,
  })
  .populate('conversation', 'participants')
  .populate('sender', 'name avatar');
};

// Static method to create system message
messageSchema.statics.createSystemMessage = function(conversationId, type, data) {
  const systemMessages = {
    order_created: 'Order has been created',
    order_started: 'Order has been started',
    order_delivered: 'Order has been delivered',
    order_completed: 'Order has been completed',
    order_cancelled: 'Order has been cancelled',
    revision_requested: 'Revision has been requested',
    deadline_extended: 'Deadline has been extended',
    user_joined: 'User joined the conversation',
    user_left: 'User left the conversation',
  };
  
  return this.create({
    conversation: conversationId,
    sender: null, // System message
    type: 'system',
    content: systemMessages[type] || 'System update',
    systemData: {
      type,
      data,
    },
  });
};

module.exports = mongoose.model('Message', messageSchema);
