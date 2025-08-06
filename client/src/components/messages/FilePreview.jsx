import React from 'react';
import { 
  FiFile, 
  FiImage, 
  FiVideo, 
  FiMusic, 
  FiFileText,
  FiArchive,
  FiX
} from 'react-icons/fi';

const FilePreview = ({ file, onRemove, className = '' }) => {
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <FiImage className="w-6 h-6 text-green-600" />;
    if (type.startsWith('video/')) return <FiVideo className="w-6 h-6 text-purple-600" />;
    if (type.startsWith('audio/')) return <FiMusic className="w-6 h-6 text-blue-600" />;
    if (type === 'application/pdf') return <FiFileText className="w-6 h-6 text-red-600" />;
    if (type.includes('zip') || type.includes('rar')) return <FiArchive className="w-6 h-6 text-yellow-600" />;
    return <FiFile className="w-6 h-6 text-gray-600" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = file.type.startsWith('image/');

  return (
    <div className={`relative bg-white border border-gray-200 rounded-lg p-3 ${className}`}>
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 z-10"
        >
          <FiX className="w-3 h-3" />
        </button>
      )}

      {isImage ? (
        <div className="space-y-2">
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className="w-full h-32 object-cover rounded"
          />
          <div>
            <p className="font-medium text-sm truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded">
            {getFileIcon(file.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilePreview;
