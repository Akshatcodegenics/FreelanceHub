const multer = require('multer');
const path = require('path');
const { AppError } = require('./errorMiddleware');

// Configure multer for memory storage (we'll upload to Cloudinary)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  const allowedTypes = process.env.ALLOWED_FILE_TYPES?.split(',') || [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only JPEG, PNG, and WebP images are allowed.', 400), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
    files: 10, // Maximum 10 files
  },
});

/**
 * Middleware for single file upload
 */
const uploadSingle = (fieldName = 'image') => {
  return (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('File too large. Maximum size is 5MB.', 400));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new AppError('Too many files. Maximum is 10 files.', 400));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new AppError(`Unexpected field: ${err.field}`, 400));
        }
        return next(new AppError(`Upload error: ${err.message}`, 400));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

/**
 * Middleware for multiple file upload
 */
const uploadMultiple = (fieldName = 'images', maxCount = 5) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('File too large. Maximum size is 5MB.', 400));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new AppError(`Too many files. Maximum is ${maxCount} files.`, 400));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new AppError(`Unexpected field: ${err.field}`, 400));
        }
        return next(new AppError(`Upload error: ${err.message}`, 400));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

/**
 * Middleware for mixed file upload (multiple fields)
 */
const uploadFields = (fields) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.fields(fields);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new AppError('File too large. Maximum size is 5MB.', 400));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new AppError('Too many files uploaded.', 400));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new AppError(`Unexpected field: ${err.field}`, 400));
        }
        return next(new AppError(`Upload error: ${err.message}`, 400));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

/**
 * Validate uploaded file
 */
const validateFile = (req, res, next) => {
  if (!req.file && !req.files) {
    return next(new AppError('No file uploaded', 400));
  }

  // Additional validation can be added here
  // For example, checking image dimensions, file content, etc.

  next();
};

/**
 * Validate uploaded files (for multiple uploads)
 */
const validateFiles = (minFiles = 1, maxFiles = 10) => {
  return (req, res, next) => {
    const files = req.files;
    
    if (!files || files.length === 0) {
      return next(new AppError('No files uploaded', 400));
    }

    if (files.length < minFiles) {
      return next(new AppError(`Minimum ${minFiles} files required`, 400));
    }

    if (files.length > maxFiles) {
      return next(new AppError(`Maximum ${maxFiles} files allowed`, 400));
    }

    next();
  };
};

/**
 * Clean up uploaded files on error
 */
const cleanupFiles = (req, res, next) => {
  // This middleware can be used to clean up files if an error occurs
  // Since we're using memory storage and Cloudinary, this is mainly for logging
  if (req.file || req.files) {
    console.log('Cleaning up uploaded files after error');
  }
  next();
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  validateFile,
  validateFiles,
  cleanupFiles,
};
