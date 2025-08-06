import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiMoreVertical, 
  FiPhone, 
  FiVideo, 
  FiInfo,
  FiArrowLeft,
  FiUsers
} from 'react-icons/fi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EnhancedMessageInput from '../../components/messages/EnhancedMessageInput';
import MessageBubble from '../../components/messages/MessageBubble';
import { messageAPI } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';
import { io } from 'socket.io-client';

const EnhancedMessages = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    initializeSocket();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
      joinConversation(conversationId);
    }
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSocket = () => {
    const token = localStorage.getItem('token');

    // Get socket URL with fallback logic
    let socketUrl;
    if (import.meta.env.VITE_SOCKET_URL) {
      socketUrl = import.meta.env.VITE_SOCKET_URL;
    } else if (import.meta.env.PROD) {
      socketUrl = window.location.origin;
    } else {
      socketUrl = 'http://localhost:8000';
    }

    socketRef.current = io(socketUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    socketRef.current.on('new_message', (data) => {
      if (data.conversationId === conversationId) {
        setMessages(prev => [...prev, data.message]);
      }
      // Update conversation list
      updateConversationLastMessage(data.conversationId, data.message);
    });

    socketRef.current.on('user_typing', (data) => {
      if (data.conversationId === conversationId) {
        setTypingUsers(prev => [...prev.filter(u => u !== data.userName), data.userName]);
      }
    });

    socketRef.current.on('user_stop_typing', (data) => {
      if (data.conversationId === conversationId) {
        setTypingUsers(prev => prev.filter(u => u !== data.userName));
      }
    });
  };

  const joinConversation = (convId) => {
    if (socketRef.current) {
      socketRef.current.emit('join_conversation', convId);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const response = await messageAPI.getConversations();
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      setLoading(true);
      const response = await messageAPI.getMessages(convId);
      setMessages(response.data.messages || []);
      setSelectedConversation(response.data.conversation);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const updateConversationLastMessage = (convId, message) => {
    setConversations(prev => 
      prev.map(conv => 
        conv._id === convId 
          ? { ...conv, lastMessage: message }
          : conv
      )
    );
  };

  const handleSendMessage = async (messageData) => {
    try {
      const response = await messageAPI.sendMessage(conversationId, messageData);
      
      // Emit typing stop
      if (socketRef.current) {
        socketRef.current.emit('typing_stop', { conversationId });
      }
      
      // Message will be added via socket event
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleSendFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('content', `Shared ${file.type.startsWith('image/') ? 'image' : 'file'}`);
      
      const response = await messageAPI.sendFile(conversationId, formData);
      toast.success('File sent successfully');
    } catch (error) {
      console.error('Error sending file:', error);
      toast.error('Failed to send file');
    }
  };

  const handleSendVoice = async (audioBlob, duration) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice-message.webm');
      formData.append('type', 'voice');
      formData.append('content', 'Voice message');
      
      const response = await messageAPI.sendFile(conversationId, formData);
      toast.success('Voice message sent');
    } catch (error) {
      console.error('Error sending voice message:', error);
      toast.error('Failed to send voice message');
    }
  };

  const handleSendPaymentRequest = async (paymentData) => {
    try {
      const response = await messageAPI.sendMessage(conversationId, {
        type: 'payment_request',
        content: `Payment request for $${paymentData.amount}`,
        paymentData
      });
      toast.success('Payment request sent');
    } catch (error) {
      console.error('Error sending payment request:', error);
      toast.error('Failed to send payment request');
    }
  };

  const handlePaymentAction = async (action, paymentData) => {
    try {
      if (action === 'pay') {
        // Integrate with Stripe payment
        toast.info('Redirecting to payment...');
        // Implementation for Stripe payment flow
      } else if (action === 'decline') {
        toast.info('Payment request declined');
      }
    } catch (error) {
      console.error('Error handling payment:', error);
      toast.error('Payment action failed');
    }
  };

  const handleDownload = (attachment) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.originalName;
    link.click();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || 
    conv.lastMessage?.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !selectedConversation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[700px] flex">
          {/* Conversations Sidebar */}
          <div className={`${selectedConversation ? 'hidden lg:block' : 'block'} w-full lg:w-1/3 border-r border-gray-200 flex flex-col`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <FiMoreVertical className="w-5 h-5" />
                </button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => {
                  const otherParticipant = conversation.participants.find(p => p._id !== user._id);
                  const isSelected = selectedConversation?._id === conversation._id;
                  
                  return (
                    <button
                      key={conversation._id}
                      onClick={() => {
                        navigate(`/messages/${conversation._id}`);
                      }}
                      className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                        isSelected ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={otherParticipant?.avatar || '/default-avatar.png'}
                            alt={otherParticipant?.name}
                            className="w-12 h-12 rounded-full"
                          />
                          {otherParticipant?.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 truncate">
                              {otherParticipant?.name}
                            </p>
                            <span className="text-xs text-gray-500">
                              {conversation.lastMessage?.sentAt && 
                                new Date(conversation.lastMessage.sentAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })
                              }
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage?.content || 'No messages yet'}
                          </p>
                          
                          {conversation.unreadCount > 0 && (
                            <div className="mt-1">
                              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                                {conversation.unreadCount}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <FiUsers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No conversations found</p>
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className={`${selectedConversation ? 'block' : 'hidden lg:block'} flex-1 flex flex-col`}>
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => navigate('/messages')}
                        className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
                      >
                        <FiArrowLeft className="w-5 h-5" />
                      </button>
                      
                      {selectedConversation.participants
                        .filter(p => p._id !== user._id)
                        .map(participant => (
                          <div key={participant._id} className="flex items-center space-x-3">
                            <div className="relative">
                              <img
                                src={participant.avatar || '/default-avatar.png'}
                                alt={participant.name}
                                className="w-10 h-10 rounded-full"
                              />
                              {participant.isOnline && (
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{participant.name}</h3>
                              <p className="text-sm text-gray-500">
                                {participant.isOnline ? 'Online' : 'Offline'}
                              </p>
                            </div>
                          </div>
                        ))
                      }
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <FiPhone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <FiVideo className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <FiInfo className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((message, index) => (
                      <MessageBubble
                        key={message._id}
                        message={message}
                        isOwn={message.sender._id === user._id}
                        showAvatar={
                          index === 0 || 
                          messages[index - 1].sender._id !== message.sender._id
                        }
                        onPaymentAction={handlePaymentAction}
                        onDownload={handleDownload}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  )}
                  
                  {/* Typing Indicator */}
                  {typingUsers.length > 0 && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 rounded-lg px-4 py-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Enhanced Message Input */}
                <EnhancedMessageInput
                  onSendMessage={handleSendMessage}
                  onSendFile={handleSendFile}
                  onSendVoice={handleSendVoice}
                  onSendPaymentRequest={handleSendPaymentRequest}
                  conversationId={conversationId}
                  disabled={loading}
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiUsers className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMessages;
