const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    index: true,
  },
  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    index: true,
  },
  type: {
    type: String,
    enum: ['order', 'inquiry', 'support'],
    default: 'inquiry',
    index: true,
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [100, 'Subject cannot exceed 100 characters'],
  },
  lastMessage: {
    content: {
      type: String,
      trim: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    sentAt: {
      type: Date,
    },
    messageType: {
      type: String,
      enum: ['text', 'file', 'image', 'system'],
      default: 'text',
    },
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'blocked'],
    default: 'active',
    index: true,
  },
  // Read status for each participant
  readStatus: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastReadAt: {
      type: Date,
      default: Date.now,
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
  }],
  // Conversation settings
  settings: {
    notifications: {
      type: Boolean,
      default: true,
    },
    autoArchive: {
      type: Boolean,
      default: false,
    },
  },
  // Metadata
  metadata: {
    totalMessages: {
      type: Number,
      default: 0,
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for better performance
conversationSchema.index({ participants: 1 });
conversationSchema.index({ participants: 1, status: 1 });
conversationSchema.index({ order: 1 });
conversationSchema.index({ 'metadata.lastActivity': -1 });
conversationSchema.index({ createdAt: -1 });

// Compound index for user conversations
conversationSchema.index({ 
  participants: 1, 
  status: 1, 
  'metadata.lastActivity': -1 
});

// Virtual for messages
conversationSchema.virtual('messages', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'conversation',
});

// Virtual for unread count for a specific user
conversationSchema.virtual('getUnreadCount').get(function() {
  return function(userId) {
    const readStatus = this.readStatus.find(rs => 
      rs.user.toString() === userId.toString()
    );
    return readStatus ? readStatus.unreadCount : 0;
  };
});

// Virtual for other participant (in 1-on-1 conversations)
conversationSchema.virtual('getOtherParticipant').get(function() {
  return function(currentUserId) {
    return this.participants.find(p => 
      p._id.toString() !== currentUserId.toString()
    );
  };
});

// Pre-save middleware
conversationSchema.pre('save', function(next) {
  // Initialize read status for new participants
  if (this.isNew) {
    this.readStatus = this.participants.map(participant => ({
      user: participant,
      lastReadAt: new Date(),
      unreadCount: 0,
    }));
    
    this.metadata.createdBy = this.participants[0];
  }

  // Update last activity
  this.metadata.lastActivity = new Date();

  next();
});

// Instance method to add participant
conversationSchema.methods.addParticipant = function(userId) {
  if (!this.participants.includes(userId)) {
    this.participants.push(userId);
    this.readStatus.push({
      user: userId,
      lastReadAt: new Date(),
      unreadCount: 0,
    });
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to remove participant
conversationSchema.methods.removeParticipant = function(userId) {
  const participantIndex = this.participants.indexOf(userId);
  if (participantIndex > -1) {
    this.participants.splice(participantIndex, 1);
    this.readStatus = this.readStatus.filter(rs => 
      rs.user.toString() !== userId.toString()
    );
    return this.save();
  }
  return Promise.resolve(this);
};

// Instance method to mark as read for a user
conversationSchema.methods.markAsRead = function(userId) {
  const readStatus = this.readStatus.find(rs => 
    rs.user.toString() === userId.toString()
  );
  
  if (readStatus) {
    readStatus.lastReadAt = new Date();
    readStatus.unreadCount = 0;
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Instance method to increment unread count for other participants
conversationSchema.methods.incrementUnreadCount = function(senderId) {
  this.readStatus.forEach(rs => {
    if (rs.user.toString() !== senderId.toString()) {
      rs.unreadCount += 1;
    }
  });
  
  return this.save();
};

// Instance method to update last message
conversationSchema.methods.updateLastMessage = function(message) {
  this.lastMessage = {
    content: message.content,
    sender: message.sender,
    sentAt: message.createdAt,
    messageType: message.type,
  };
  
  this.metadata.totalMessages += 1;
  this.metadata.lastActivity = new Date();
  
  return this.save();
};

// Instance method to archive conversation
conversationSchema.methods.archive = function() {
  this.status = 'archived';
  return this.save();
};

// Instance method to unarchive conversation
conversationSchema.methods.unarchive = function() {
  this.status = 'active';
  return this.save();
};

// Static method to find conversations by user
conversationSchema.statics.findByUser = function(userId, options = {}) {
  const query = {
    participants: userId,
    status: options.status || 'active',
  };
  
  return this.find(query)
    .populate('participants', 'name avatar role')
    .populate('order', 'orderId status')
    .populate('gig', 'title slug')
    .sort({ 'metadata.lastActivity': -1 })
    .limit(options.limit || 20);
};

// Static method to find conversation between users
conversationSchema.statics.findBetweenUsers = function(user1Id, user2Id, orderId = null) {
  const query = {
    participants: { $all: [user1Id, user2Id] },
    status: 'active',
  };
  
  if (orderId) {
    query.order = orderId;
  }
  
  return this.findOne(query)
    .populate('participants', 'name avatar role')
    .populate('order', 'orderId status')
    .populate('gig', 'title slug');
};

// Static method to create or get conversation
conversationSchema.statics.createOrGet = async function(participants, options = {}) {
  // Try to find existing conversation
  let conversation = await this.findBetweenUsers(
    participants[0], 
    participants[1], 
    options.orderId
  );
  
  if (!conversation) {
    // Create new conversation
    conversation = await this.create({
      participants,
      order: options.orderId,
      gig: options.gigId,
      type: options.type || 'inquiry',
      subject: options.subject,
    });
    
    await conversation.populate('participants', 'name avatar role');
    if (options.orderId) {
      await conversation.populate('order', 'orderId status');
    }
    if (options.gigId) {
      await conversation.populate('gig', 'title slug');
    }
  }
  
  return conversation;
};

module.exports = mongoose.model('Conversation', conversationSchema);
