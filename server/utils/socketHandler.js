const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Store active connections
const activeUsers = new Map();

/**
 * Socket.IO authentication middleware
 */
const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    socket.userId = user._id.toString();
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};

/**
 * Handle user connection
 */
const handleConnection = (socket) => {
  console.log(`🔌 User connected: ${socket.user.name} (${socket.userId})`);
  
  // Store user connection
  activeUsers.set(socket.userId, {
    socketId: socket.id,
    user: socket.user,
    lastSeen: new Date(),
  });

  // Join user to their personal room
  socket.join(`user_${socket.userId}`);

  // Emit online status to friends/contacts
  socket.broadcast.emit('user_online', {
    userId: socket.userId,
    user: {
      _id: socket.user._id,
      name: socket.user.name,
      avatar: socket.user.avatar,
    },
  });

  // Handle joining conversation rooms
  socket.on('join_conversation', (conversationId) => {
    socket.join(`conversation_${conversationId}`);
    console.log(`📨 User ${socket.userId} joined conversation ${conversationId}`);
  });

  // Handle leaving conversation rooms
  socket.on('leave_conversation', (conversationId) => {
    socket.leave(`conversation_${conversationId}`);
    console.log(`📤 User ${socket.userId} left conversation ${conversationId}`);
  });

  // Handle sending messages
  socket.on('send_message', async (data) => {
    try {
      const { conversationId, message, receiverId } = data;
      
      // Emit to conversation room
      socket.to(`conversation_${conversationId}`).emit('new_message', {
        conversationId,
        message,
        sender: {
          _id: socket.user._id,
          name: socket.user.name,
          avatar: socket.user.avatar,
        },
        timestamp: new Date(),
      });

      // Send notification to receiver if they're online but not in the conversation
      const receiverConnection = activeUsers.get(receiverId);
      if (receiverConnection) {
        socket.to(receiverConnection.socketId).emit('message_notification', {
          conversationId,
          sender: {
            _id: socket.user._id,
            name: socket.user.name,
            avatar: socket.user.avatar,
          },
          preview: message.substring(0, 50),
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Error handling send_message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const { conversationId, receiverId } = data;
    socket.to(`conversation_${conversationId}`).emit('user_typing', {
      userId: socket.userId,
      userName: socket.user.name,
      conversationId,
    });
  });

  socket.on('typing_stop', (data) => {
    const { conversationId } = data;
    socket.to(`conversation_${conversationId}`).emit('user_stop_typing', {
      userId: socket.userId,
      conversationId,
    });
  });

  // Handle order status updates
  socket.on('join_order_room', (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`📦 User ${socket.userId} joined order room ${orderId}`);
  });

  socket.on('leave_order_room', (orderId) => {
    socket.leave(`order_${orderId}`);
    console.log(`📦 User ${socket.userId} left order room ${orderId}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.user.name} (${socket.userId})`);
    
    // Remove from active users
    activeUsers.delete(socket.userId);
    
    // Emit offline status
    socket.broadcast.emit('user_offline', {
      userId: socket.userId,
      lastSeen: new Date(),
    });
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
};

/**
 * Main socket handler
 */
const socketHandler = (io) => {
  // Apply authentication middleware
  io.use(authenticateSocket);
  
  // Handle connections
  io.on('connection', handleConnection);

  // Utility functions for emitting events from other parts of the app
  io.emitToUser = (userId, event, data) => {
    io.to(`user_${userId}`).emit(event, data);
  };

  io.emitToConversation = (conversationId, event, data) => {
    io.to(`conversation_${conversationId}`).emit(event, data);
  };

  io.emitToOrder = (orderId, event, data) => {
    io.to(`order_${orderId}`).emit(event, data);
  };

  io.getActiveUsers = () => {
    return Array.from(activeUsers.values()).map(connection => ({
      userId: connection.user._id,
      name: connection.user.name,
      avatar: connection.user.avatar,
      lastSeen: connection.lastSeen,
    }));
  };

  io.isUserOnline = (userId) => {
    return activeUsers.has(userId);
  };

  console.log('🚀 Socket.IO server initialized');
};

module.exports = socketHandler;
