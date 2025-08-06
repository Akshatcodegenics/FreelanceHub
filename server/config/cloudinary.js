const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {string} folder - Cloudinary folder to upload to
 * @param {Object} options - Additional upload options
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadImage = async (filePath, folder = 'freelancehub', options = {}) => {
  try {
    const defaultOptions = {
      folder,
      resource_type: 'image',
      quality: 'auto',
      fetch_format: 'auto',
      ...options,
    };

    const result = await cloudinary.uploader.upload(filePath, defaultOptions);
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<Object>} - Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      result: result.result,
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {Array} filePaths - Array of file paths to upload
 * @param {string} folder - Cloudinary folder to upload to
 * @returns {Promise<Array>} - Array of upload results
 */
const uploadMultipleImages = async (filePaths, folder = 'freelancehub') => {
  try {
    const uploadPromises = filePaths.map(filePath => 
      uploadImage(filePath, folder)
    );
    
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw error;
  }
};

/**
 * Generate optimized image URL
 * @param {string} publicId - Public ID of the image
 * @param {Object} transformations - Image transformation options
 * @returns {string} - Optimized image URL
 */
const getOptimizedImageUrl = (publicId, transformations = {}) => {
  const defaultTransformations = {
    quality: 'auto',
    fetch_format: 'auto',
    ...transformations,
  };

  return cloudinary.url(publicId, defaultTransformations);
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
  uploadMultipleImages,
  getOptimizedImageUrl,
};
