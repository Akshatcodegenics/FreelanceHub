const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Generate random string
 * @param {number} length - Length of the string
 * @returns {string} Random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate verification token
 * @returns {string} Verification token
 */
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hash verification token
 * @param {string} token - Token to hash
 * @returns {string} Hashed token
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Generate order ID
 * @returns {string} Unique order ID
 */
const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${randomStr}`.toUpperCase();
};

/**
 * Generate gig slug from title
 * @param {string} title - Gig title
 * @returns {string} URL-friendly slug
 */
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Calculate pagination metadata
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {Object} Pagination metadata
 */
const calculatePagination = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
  };
};

/**
 * Format currency
 * @param {number} amount - Amount in cents
 * @param {string} currency - Currency code
 * @returns {string} Formatted currency string
 */
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount / 100);
};

/**
 * Calculate delivery date
 * @param {number} deliveryDays - Number of delivery days
 * @param {Date} startDate - Start date (default: now)
 * @returns {Date} Delivery date
 */
const calculateDeliveryDate = (deliveryDays, startDate = new Date()) => {
  const deliveryDate = new Date(startDate);
  deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
  return deliveryDate;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

/**
 * Generate search keywords from text
 * @param {string} text - Text to extract keywords from
 * @returns {Array} Array of keywords
 */
const generateSearchKeywords = (text) => {
  if (!text) return [];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Replace special chars with spaces
    .split(/\s+/) // Split by whitespace
    .filter(word => word.length > 2) // Filter short words
    .slice(0, 20); // Limit to 20 keywords
};

/**
 * Calculate average rating
 * @param {Array} reviews - Array of review objects with rating property
 * @returns {Object} Average rating and count
 */
const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return { average: 0, count: 0 };
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = Math.round((total / reviews.length) * 10) / 10; // Round to 1 decimal

  return {
    average,
    count: reviews.length,
  };
};

/**
 * Get time ago string
 * @param {Date} date - Date to compare
 * @returns {string} Time ago string
 */
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  
  return `${Math.floor(diffInSeconds / 31536000)} years ago`;
};

module.exports = {
  generateToken,
  generateRandomString,
  generateVerificationToken,
  hashToken,
  generateOrderId,
  generateSlug,
  calculatePagination,
  formatCurrency,
  calculateDeliveryDate,
  isValidEmail,
  sanitizeInput,
  generateSearchKeywords,
  calculateAverageRating,
  getTimeAgo,
};
