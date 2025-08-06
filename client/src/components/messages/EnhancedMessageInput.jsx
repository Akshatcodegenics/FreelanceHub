import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import EmojiPicker from 'emoji-picker-react';
import { useVoiceRecording } from '../../hooks/useVoiceRecording';
import {
  FiSend,
  FiPaperclip,
  FiMic,
  FiVideo,
  FiSmile,
  FiDollarSign,
  FiMail,
  FiX,
  FiFile,
  FiImage
} from 'react-icons/fi';

const EnhancedMessageInput = ({
  onSendMessage,
  onSendFile,
  onSendVoice,
  onSendPaymentRequest,
  disabled = false,
  conversationId
}) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('text');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const fileInputRef = useRef(null);

  // Use custom voice recording hook
  const {
    isRecording,
    recordingTime,
    audioBlob,
    isSupported: voiceSupported,
    error: voiceError,
    startRecording,
    stopRecording,
    formatTime,
    clearRecording
  } = useVoiceRecording();

  // Dropzone for drag and drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    },
    noClick: true,
    multiple: false,
    maxSize: 50 * 1024 * 1024 // 50MB
  });

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    onSendMessage({
      content: message.trim(),
      type: messageType
    });

    setMessage('');
    setMessageType('text');
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (file) => {
    if (!file) return;
    
    onSendFile(file);
    setShowAttachmentMenu(false);
  };

  const handleVoiceRecordingStart = async () => {
    if (!voiceSupported) {
      console.error('Voice recording not supported');
      return;
    }

    const success = await startRecording();
    if (!success && voiceError) {
      console.error('Failed to start recording:', voiceError);
    }
  };

  const handleVoiceRecordingStop = () => {
    stopRecording();
  };

  // Handle sending voice message when audioBlob is available
  React.useEffect(() => {
    if (audioBlob && !isRecording) {
      onSendVoice(audioBlob, recordingTime);
      clearRecording();
    }
  }, [audioBlob, isRecording, recordingTime, onSendVoice, clearRecording]);

  const AttachmentMenu = () => (
    <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
      <div className="grid grid-cols-2 gap-2 w-48">
        <button
          onClick={() => {
            fileInputRef.current?.click();
            setShowAttachmentMenu(false);
          }}
          className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
        >
          <FiFile className="w-4 h-4 text-blue-600" />
          <span className="text-sm">Document</span>
        </button>
        <button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => handleFileUpload(e.target.files[0]);
            input.click();
            setShowAttachmentMenu(false);
          }}
          className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
        >
          <FiImage className="w-4 h-4 text-green-600" />
          <span className="text-sm">Photo</span>
        </button>
        <button
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'video/*';
            input.onchange = (e) => handleFileUpload(e.target.files[0]);
            input.click();
            setShowAttachmentMenu(false);
          }}
          className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
        >
          <FiVideo className="w-4 h-4 text-purple-600" />
          <span className="text-sm">Video</span>
        </button>
        <button
          onClick={() => {
            setShowPaymentForm(true);
            setShowAttachmentMenu(false);
          }}
          className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
        >
          <FiDollarSign className="w-4 h-4 text-yellow-600" />
          <span className="text-sm">Payment</span>
        </button>
      </div>
    </div>
  );

  const PaymentForm = () => (
    <div className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10 w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Send Payment Request</h3>
        <button
          onClick={() => setShowPaymentForm(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        onSendPaymentRequest({
          amount: parseFloat(formData.get('amount')),
          description: formData.get('description'),
          currency: formData.get('currency') || 'usd'
        });
        setShowPaymentForm(false);
      }}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              name="amount"
              step="0.01"
              min="0.50"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Payment for..."
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setShowPaymentForm(false)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Send Request
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <div className="relative">
      {/* Drag and Drop Overlay */}
      {isDragActive && (
        <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center z-20">
          <div className="text-center">
            <FiPaperclip className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-blue-600 font-medium">Drop file to share</p>
          </div>
        </div>
      )}

      <div {...getRootProps()} className="p-4 border-t border-gray-200 bg-white">
        <input {...getInputProps()} />
        
        {/* Voice Recording UI */}
        {isRecording && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-700 font-medium">Recording...</span>
              <span className="text-red-600">{formatTime}</span>
            </div>
            <button
              onClick={handleVoiceRecordingStop}
              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Stop
            </button>
          </div>
        )}

        {/* Voice Error Display */}
        {voiceError && (
          <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-sm">{voiceError}</p>
          </div>
        )}

        {/* Message Type Selector */}
        <div className="mb-2 flex space-x-2">
          <button
            onClick={() => setMessageType('text')}
            className={`px-3 py-1 rounded-lg text-sm ${
              messageType === 'text' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Text
          </button>
          <button
            onClick={() => setMessageType('email')}
            className={`px-3 py-1 rounded-lg text-sm flex items-center space-x-1 ${
              messageType === 'email' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FiMail className="w-3 h-3" />
            <span>Email</span>
          </button>
        </div>

        {/* Main Input Area */}
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          {/* Attachment Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={disabled}
            >
              <FiPaperclip className="w-5 h-5" />
            </button>
            {showAttachmentMenu && <AttachmentMenu />}
            {showPaymentForm && <PaymentForm />}
          </div>

          {/* Message Input */}
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={messageType === 'email' ? 'Compose email...' : 'Type a message...'}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={message.split('\n').length || 1}
              maxLength={1000}
              disabled={disabled}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            
            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-600"
              disabled={disabled}
            >
              <FiSmile className="w-4 h-4" />
            </button>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="absolute bottom-12 right-0 z-10">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
          </div>

          {/* Voice Message Button */}
          <button
            type="button"
            onClick={isRecording ? handleVoiceRecordingStop : handleVoiceRecordingStart}
            className={`p-2 rounded-lg transition-colors ${
              isRecording
                ? 'bg-red-600 text-white'
                : voiceSupported
                  ? 'text-gray-400 hover:text-gray-600'
                  : 'text-gray-300 cursor-not-allowed'
            }`}
            disabled={disabled || !voiceSupported}
            title={voiceSupported ? 'Record voice message' : 'Voice recording not supported'}
          >
            <FiMic className="w-5 h-5" />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </form>

        {/* Character Count */}
        <div className="mt-1 text-right">
          <span className={`text-xs ${
            message.length > 900 ? 'text-red-500' : 'text-gray-400'
          }`}>
            {message.length}/1000
          </span>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />
      </div>
    </div>
  );
};

export default EnhancedMessageInput;
