import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { messageAPI } from '../../services/api';
import { FiSend, FiPaperclip } from 'react-icons/fi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Messages = () => {
  const { conversationId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId]);

  const fetchConversations = async () => {
    try {
      const response = await messageAPI.getConversations();
      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const response = await messageAPI.getMessages(convId);
      setMessages(response.data.messages || []);
      setSelectedConversation(convId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await messageAPI.sendMessage(selectedConversation, {
        content: newMessage.trim(),
      });
      setNewMessage('');
      // Refresh messages
      fetchMessages(selectedConversation);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-[600px] flex">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            </div>
            <div className="overflow-y-auto h-full">
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <button
                    key={conversation._id}
                    onClick={() => fetchMessages(conversation._id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 ${
                      selectedConversation === conversation._id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={conversation.otherUser?.avatar || '/default-avatar.png'}
                        alt={conversation.otherUser?.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {conversation.otherUser?.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex ${
                        message.sender._id === 'currentUserId' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender._id === 'currentUserId'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender._id === 'currentUserId' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <FiPaperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSend className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-gray-500 mb-4">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
