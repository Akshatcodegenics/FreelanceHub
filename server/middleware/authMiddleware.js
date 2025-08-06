const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError, asyncHandler } = require('./errorMiddleware');

/**
 * Protect routes - verify JWT token
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return next(new AppError('User not found', 401));
      }

      // Check if user is active
      if (!req.user.isActive) {
        return next(new AppError('Your account has been deactivated', 401));
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return next(new AppError('Not authorized, token failed', 401));
    }
  }

  if (!token) {
    return next(new AppError('Not authorized, no token', 401));
  }
});

/**
 * Restrict access to specific roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

/**
 * Check if user owns the resource or is admin
 */
const checkOwnership = (resourceUserField = 'user') => {
  return asyncHandler(async (req, res, next) => {
    // Admin can access everything
    if (req.user.role === 'admin') {
      return next();
    }

    // Get the resource from the request (could be from params, body, etc.)
    let resource;
    
    // If we have the resource in req.resource (set by previous middleware)
    if (req.resource) {
      resource = req.resource;
    } else {
      // Try to find the resource based on the route
      const resourceId = req.params.id;
      if (!resourceId) {
        return next(new AppError('Resource ID not provided', 400));
      }

      // This is a generic check - specific routes should set req.resource
      return next(new AppError('Resource ownership check not properly configured', 500));
    }

    // Check ownership
    const resourceUserId = resource[resourceUserField];
    if (!resourceUserId || resourceUserId.toString() !== req.user._id.toString()) {
      return next(new AppError('You can only access your own resources', 403));
    }

    next();
  });
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Don't throw error, just continue without user
      req.user = null;
    }
  }

  next();
});

/**
 * Check if user is verified (email verification)
 */
const requireVerification = (req, res, next) => {
  if (!req.user.isEmailVerified) {
    return next(new AppError('Please verify your email address first', 403));
  }
  next();
};

/**
 * Rate limiting for sensitive operations
 */
const sensitiveOperationLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();

  return (req, res, next) => {
    const key = req.user ? req.user._id.toString() : req.ip;
    const now = Date.now();
    
    if (!attempts.has(key)) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const userAttempts = attempts.get(key);
    
    if (now > userAttempts.resetTime) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (userAttempts.count >= maxAttempts) {
      return next(new AppError('Too many attempts. Please try again later.', 429));
    }

    userAttempts.count++;
    next();
  };
};

module.exports = {
  protect,
  restrictTo,
  checkOwnership,
  optionalAuth,
  requireVerification,
  sensitiveOperationLimit,
};
