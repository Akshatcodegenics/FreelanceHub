const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const sharp = require('sharp');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow various file types for enhanced messaging
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm', 'video/quicktime',
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip', 'application/x-zip-compressed',
      'text/plain', 'text/csv'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'), false);
    }
  }
});

/**
 * Get all conversations for a user
 */
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, type } = req.query;

    const query = {
      participants: userId,
      status: 'active'
    };

    if (type) {
      query.type = type;
    }

    const conversations = await Conversation.find(query)
      .populate('participants', 'name avatar role isOnline lastSeen')
      .populate('order', 'orderId status totalAmount')
      .populate('gig', 'title slug images')
      .populate('lastMessage.sender', 'name avatar')
      .sort({ 'metadata.lastActivity': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Calculate unread count for each conversation
    const conversationsWithUnread = conversations.map(conv => {
      const userReadStatus = conv.readStatus.find(rs => rs.user.toString() === userId.toString());
      return {
        ...conv.toObject(),
        unreadCount: userReadStatus ? userReadStatus.unreadCount : 0
      };
    });

    res.json({
      success: true,
      data: {
        conversations: conversationsWithUnread,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: await Conversation.countDocuments(query)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
};

/**
 * Get messages for a specific conversation
 */
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const messages = await Message.findByConversation(conversationId, {
      limit: parseInt(limit),
      skip: (page - 1) * limit,
      sort: -1 // Most recent first
    });

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: userId },
        'readBy.user': { $ne: userId }
      },
      {
        $push: {
          readBy: {
            user: userId,
            readAt: new Date()
          }
        }
      }
    );

    // Update conversation read status
    await Conversation.updateOne(
      {
        _id: conversationId,
        'readStatus.user': userId
      },
      {
        $set: {
          'readStatus.$.lastReadAt': new Date(),
          'readStatus.$.unreadCount': 0
        }
      }
    );

    res.json({
      success: true,
      data: {
        messages: messages.reverse(), // Return in chronological order
        conversation,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: await Message.countDocuments({
            conversation: conversationId,
            'flags.isDeleted': false
          })
        }
      }
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
};

/**
 * Send a text message
 */
const sendTextMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { conversationId } = req.params;
    const { content, replyTo, type = 'text' } = req.body;
    const userId = req.user._id;

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Create message
    const message = new Message({
      conversation: conversationId,
      sender: userId,
      type,
      content,
      replyTo: replyTo || undefined
    });

    await message.save();
    await message.populate('sender', 'name avatar');

    // Update conversation
    await conversation.updateLastMessage(message);

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.emitToConversation(conversationId, 'new_message', {
        message: message.toObject(),
        conversation: conversation.toObject()
      });
    }

    res.status(201).json({
      success: true,
      data: { message }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

/**
 * Send a file/media message
 */
const sendFileMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content = '', type = 'file' } = req.body;
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Verify conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Process file based on type
    let uploadResult;
    let attachmentData = {
      filename: `${Date.now()}_${req.file.originalname}`,
      originalName: req.file.originalname,
      size: req.file.size,
      mimeType: req.file.mimetype,
      attachmentType: getAttachmentType(req.file.mimetype)
    };

    // Upload to Cloudinary
    if (req.file.mimetype.startsWith('image/')) {
      // Process image
      const processedImage = await sharp(req.file.buffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'messages/images',
            public_id: attachmentData.filename
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(processedImage);
      });

      // Get image dimensions
      const metadata = await sharp(req.file.buffer).metadata();
      attachmentData.dimensions = {
        width: metadata.width,
        height: metadata.height
      };
    } else if (req.file.mimetype.startsWith('video/')) {
      // Upload video
      uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'video',
            folder: 'messages/videos',
            public_id: attachmentData.filename
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      attachmentData.duration = uploadResult.duration;
      attachmentData.thumbnail = uploadResult.secure_url.replace(/\.[^/.]+$/, '.jpg');
    } else {
      // Upload other files as raw
      uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            folder: 'messages/files',
            public_id: attachmentData.filename
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
    }

    attachmentData.url = uploadResult.secure_url;

    // Create message
    const message = new Message({
      conversation: conversationId,
      sender: userId,
      type,
      content: content || `Shared ${attachmentData.attachmentType}`,
      attachments: [attachmentData]
    });

    await message.save();
    await message.populate('sender', 'name avatar');

    // Update conversation
    await conversation.updateLastMessage(message);

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.emitToConversation(conversationId, 'new_message', {
        message: message.toObject(),
        conversation: conversation.toObject()
      });
    }

    res.status(201).json({
      success: true,
      data: { message }
    });
  } catch (error) {
    console.error('Error sending file message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send file message'
    });
  }
};

/**
 * Helper function to determine attachment type
 */
const getAttachmentType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType.includes('zip')) return 'zip';
  if (mimeType.includes('document') || mimeType.includes('word')) return 'document';
  return 'other';
};

/**
 * Send a voice message
 */
const sendVoiceMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No audio file uploaded'
      });
    }

    // Verify conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Upload audio to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'video', // Use video for audio files
          folder: 'messages/voice',
          public_id: `voice_${Date.now()}_${userId}`
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Create voice message
    const message = new Message({
      conversation: conversationId,
      sender: userId,
      type: 'voice',
      content: 'Voice message',
      attachments: [{
        filename: `voice_${Date.now()}.webm`,
        originalName: 'voice-message.webm',
        url: uploadResult.secure_url,
        size: req.file.size,
        mimeType: req.file.mimetype,
        attachmentType: 'voice',
        duration: uploadResult.duration || 0
      }],
      voiceData: {
        duration: uploadResult.duration || 0,
        waveform: [], // Will be generated client-side
        isTranscribed: false
      }
    });

    await message.save();
    await message.populate('sender', 'name avatar');

    // Update conversation
    await conversation.updateLastMessage(message);

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.emitToConversation(conversationId, 'new_message', {
        message: message.toObject(),
        conversation: conversation.toObject()
      });
    }

    res.status(201).json({
      success: true,
      data: { message }
    });
  } catch (error) {
    console.error('Error sending voice message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send voice message'
    });
  }
};

/**
 * Send a payment request
 */
const sendPaymentRequest = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { amount, description, currency = 'usd' } = req.body;
    const userId = req.user._id;

    // Verify conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Create payment request message
    const message = new Message({
      conversation: conversationId,
      sender: userId,
      type: 'payment_request',
      content: `Payment request for $${amount} ${currency.toUpperCase()}`,
      paymentData: {
        amount: parseFloat(amount),
        currency,
        description,
        status: 'pending'
      }
    });

    await message.save();
    await message.populate('sender', 'name avatar');

    // Update conversation
    await conversation.updateLastMessage(message);

    // Emit real-time event
    const io = req.app.get('io');
    if (io) {
      io.emitToConversation(conversationId, 'new_message', {
        message: message.toObject(),
        conversation: conversation.toObject()
      });
    }

    res.status(201).json({
      success: true,
      data: { message }
    });
  } catch (error) {
    console.error('Error sending payment request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send payment request'
    });
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendTextMessage,
  sendFileMessage,
  sendVoiceMessage,
  sendPaymentRequest,
  upload
};
