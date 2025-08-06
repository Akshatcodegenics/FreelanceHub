import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { 
  FiDownload, 
  FiPlay, 
  FiPause, 
  FiFile, 
  FiImage, 
  FiVideo,
  FiDollarSign,
  FiMail,
  FiCheck,
  FiCheckCheck,
  FiClock
} from 'react-icons/fi';
import { format } from 'date-fns';

const MessageBubble = ({ 
  message, 
  isOwn, 
  showAvatar = true, 
  onPaymentAction,
  onDownload 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const formatTime = (date) => {
    return format(new Date(date), 'HH:mm');
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <FiCheck className="w-3 h-3" />;
      case 'delivered':
        return <FiCheckCheck className="w-3 h-3" />;
      case 'read':
        return <FiCheckCheck className="w-3 h-3 text-blue-500" />;
      default:
        return <FiClock className="w-3 h-3" />;
    }
  };

  const renderTextMessage = () => (
    <div className="space-y-1">
      <p className="whitespace-pre-wrap break-words">{message.content}</p>
      {message.edited?.isEdited && (
        <p className="text-xs opacity-70 italic">edited</p>
      )}
    </div>
  );

  const renderEmailMessage = () => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
        <FiMail className="w-4 h-4" />
        <span className="font-medium text-sm">
          {message.emailData?.subject || 'Email Message'}
        </span>
      </div>
      <div className={message.emailData?.isRichText ? 'prose prose-sm' : ''}>
        {message.emailData?.isRichText ? (
          <div dangerouslySetInnerHTML={{ __html: message.emailData.htmlContent }} />
        ) : (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        )}
      </div>
    </div>
  );

  const renderVoiceMessage = () => (
    <div className="flex items-center space-x-3 min-w-[200px]">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
      >
        {isPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
      </button>
      
      <div className="flex-1">
        {/* Waveform visualization */}
        <div className="flex items-center space-x-1 h-8">
          {message.voiceData?.waveform?.map((amplitude, index) => (
            <div
              key={index}
              className="bg-current opacity-60"
              style={{
                width: '2px',
                height: `${Math.max(4, amplitude * 24)}px`
              }}
            />
          )) || (
            // Fallback bars if no waveform data
            Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="bg-current opacity-60"
                style={{
                  width: '2px',
                  height: `${Math.random() * 20 + 4}px`
                }}
              />
            ))
          )}
        </div>
        
        <div className="flex justify-between text-xs mt-1">
          <span>{formatTime(message.createdAt)}</span>
          <span>{message.voiceData?.duration || '0:00'}</span>
        </div>
      </div>

      {message.voiceData?.transcription && (
        <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
          <p className="italic">"{message.voiceData.transcription}"</p>
        </div>
      )}
    </div>
  );

  const renderFileAttachment = (attachment) => {
    const isImage = attachment.attachmentType === 'image';
    const isVideo = attachment.attachmentType === 'video';
    const isPdf = attachment.attachmentType === 'pdf';

    if (isImage) {
      return (
        <div className="relative">
          <img
            src={attachment.url}
            alt={attachment.originalName}
            className="max-w-xs max-h-64 rounded-lg cursor-pointer hover:opacity-90"
            onClick={() => setShowFullImage(true)}
          />
          {attachment.aiLabels && attachment.aiLabels.length > 0 && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              {attachment.aiLabels[0]}
            </div>
          )}
          
          {/* Full size image modal */}
          {showFullImage && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
              onClick={() => setShowFullImage(false)}
            >
              <img
                src={attachment.url}
                alt={attachment.originalName}
                className="max-w-full max-h-full"
              />
            </div>
          )}
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="max-w-xs">
          <ReactPlayer
            url={attachment.url}
            width="100%"
            height="200px"
            controls
            light={attachment.thumbnail}
          />
          <p className="text-xs mt-1 opacity-70">{attachment.originalName}</p>
        </div>
      );
    }

    // Generic file attachment
    return (
      <div className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg max-w-xs">
        <div className="p-2 bg-white rounded">
          {isPdf ? (
            <FiFile className="w-6 h-6 text-red-600" />
          ) : isVideo ? (
            <FiVideo className="w-6 h-6 text-purple-600" />
          ) : (
            <FiFile className="w-6 h-6 text-gray-600" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{attachment.originalName}</p>
          <p className="text-xs text-gray-500">
            {(attachment.size / 1024 / 1024).toFixed(1)} MB
          </p>
          {attachment.aiLabels && attachment.aiLabels.length > 0 && (
            <p className="text-xs text-blue-600 mt-1">
              {attachment.aiLabels.join(', ')}
            </p>
          )}
        </div>
        
        <button
          onClick={() => onDownload?.(attachment)}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <FiDownload className="w-4 h-4" />
        </button>
      </div>
    );
  };

  const renderPaymentMessage = () => {
    const { paymentData } = message;
    const isRequest = message.type === 'payment_request';
    const isReceipt = message.type === 'payment_receipt';

    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-full ${
            isRequest ? 'bg-yellow-100' : 'bg-green-100'
          }`}>
            <FiDollarSign className={`w-4 h-4 ${
              isRequest ? 'text-yellow-600' : 'text-green-600'
            }`} />
          </div>
          <div>
            <p className="font-medium">
              {isRequest ? 'Payment Request' : 'Payment Receipt'}
            </p>
            <p className="text-sm opacity-70">
              ${paymentData?.amount} {paymentData?.currency?.toUpperCase()}
            </p>
          </div>
        </div>

        <p className="text-sm">{paymentData?.description}</p>

        {isRequest && paymentData?.status === 'pending' && !isOwn && (
          <div className="flex space-x-2">
            <button
              onClick={() => onPaymentAction?.('pay', paymentData)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Pay Now
            </button>
            <button
              onClick={() => onPaymentAction?.('decline', paymentData)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
            >
              Decline
            </button>
          </div>
        )}

        {isReceipt && paymentData?.receiptUrl && (
          <a
            href={paymentData.receiptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
          >
            <FiDownload className="w-3 h-3" />
            <span>Download Receipt</span>
          </a>
        )}

        <div className="flex items-center justify-between text-xs">
          <span className={`px-2 py-1 rounded-full ${
            paymentData?.status === 'succeeded' ? 'bg-green-100 text-green-700' :
            paymentData?.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {paymentData?.status || 'pending'}
          </span>
        </div>
      </div>
    );
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'voice':
        return renderVoiceMessage();
      case 'email':
        return renderEmailMessage();
      case 'payment_request':
      case 'payment_receipt':
        return renderPaymentMessage();
      case 'file':
      case 'image':
      case 'video':
        return (
          <div className="space-y-2">
            {message.content && message.content !== `Shared ${message.attachments?.[0]?.attachmentType}` && (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            )}
            {message.attachments?.map((attachment, index) => (
              <div key={index}>
                {renderFileAttachment(attachment)}
              </div>
            ))}
          </div>
        );
      default:
        return renderTextMessage();
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isOwn ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-xs lg:max-w-md`}>
        {/* Avatar */}
        {showAvatar && !isOwn && (
          <img
            src={message.sender?.avatar || '/default-avatar.png'}
            alt={message.sender?.name}
            className="w-8 h-8 rounded-full"
          />
        )}

        {/* Message Bubble */}
        <div className={`px-4 py-2 rounded-lg ${
          isOwn 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-200 text-gray-900'
        }`}>
          {/* Sender name for group chats */}
          {!isOwn && showAvatar && (
            <p className="text-xs font-medium mb-1 opacity-70">
              {message.sender?.name}
            </p>
          )}

          {/* Message Content */}
          {renderMessageContent()}

          {/* AI Translation */}
          {message.aiData?.translatedContent && message.aiData.translatedContent.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-300 border-opacity-30">
              <p className="text-xs opacity-70 mb-1">Translation:</p>
              <p className="text-sm italic">
                {message.aiData.translatedContent[0].content}
              </p>
            </div>
          )}

          {/* Timestamp and Status */}
          <div className={`flex items-center justify-between mt-1 text-xs ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
          }`}>
            <span>{formatTime(message.createdAt)}</span>
            {isOwn && (
              <span className="ml-2">
                {getStatusIcon(message.status)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
