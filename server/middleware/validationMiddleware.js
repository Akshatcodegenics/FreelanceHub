const { body, validationResult } = require('express-validator');
const { AppError } = require('./errorMiddleware');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return next(new AppError(errorMessages.join('. '), 400));
  }
  
  next();
};

/**
 * Validation rules for user registration
 */
const validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('role')
    .optional()
    .isIn(['client', 'freelancer'])
    .withMessage('Role must be either client or freelancer'),
  
  handleValidationErrors,
];

/**
 * Validation rules for user login
 */
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors,
];

/**
 * Validation rules for password update
 */
const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  handleValidationErrors,
];

/**
 * Validation rules for profile update
 */
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be more than 500 characters'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('skills.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each skill must be between 1 and 50 characters'),
  
  body('hourlyRate')
    .optional()
    .isFloat({ min: 5, max: 1000 })
    .withMessage('Hourly rate must be between $5 and $1000'),
  
  body('availability')
    .optional()
    .isIn(['full-time', 'part-time', 'as-needed'])
    .withMessage('Availability must be full-time, part-time, or as-needed'),
  
  body('location.country')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Country name cannot be more than 100 characters'),
  
  body('location.city')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('City name cannot be more than 100 characters'),
  
  body('contact.phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('contact.website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid website URL'),
  
  body('contact.linkedin')
    .optional()
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL'),
  
  body('contact.github')
    .optional()
    .isURL()
    .withMessage('Please provide a valid GitHub URL'),
  
  handleValidationErrors,
];

/**
 * Validation rules for forgot password
 */
const validateForgotPassword = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  handleValidationErrors,
];

/**
 * Validation rules for reset password
 */
const validateResetPassword = [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  handleValidationErrors,
];

/**
 * Validation rules for gig creation
 */
const validateGigCreate = [
  body('title')
    .trim()
    .isLength({ min: 10, max: 80 })
    .withMessage('Title must be between 10 and 80 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 50, max: 1200 })
    .withMessage('Description must be between 50 and 1200 characters'),
  
  body('category')
    .notEmpty()
    .withMessage('Category is required'),
  
  body('subcategory')
    .notEmpty()
    .withMessage('Subcategory is required'),
  
  body('price')
    .isFloat({ min: 5, max: 10000 })
    .withMessage('Price must be between $5 and $10,000'),
  
  body('deliveryTime')
    .isInt({ min: 1, max: 30 })
    .withMessage('Delivery time must be between 1 and 30 days'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1 and 30 characters'),
  
  handleValidationErrors,
];

/**
 * Validation rules for order creation
 */
const validateOrderCreate = [
  body('gigId')
    .isMongoId()
    .withMessage('Invalid gig ID'),
  
  body('requirements')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Requirements cannot be more than 1000 characters'),
  
  handleValidationErrors,
];

/**
 * Validation rules for review creation
 */
const validateReviewCreate = [
  body('orderId')
    .isMongoId()
    .withMessage('Invalid order ID'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Comment must be between 10 and 500 characters'),
  
  handleValidationErrors,
];

/**
 * Validation rules for message creation
 */
const validateMessageCreate = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message content must be between 1 and 1000 characters'),
  
  body('receiverId')
    .isMongoId()
    .withMessage('Invalid receiver ID'),
  
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validatePasswordUpdate,
  validateProfileUpdate,
  validateForgotPassword,
  validateResetPassword,
  validateGigCreate,
  validateOrderCreate,
  validateReviewCreate,
  validateMessageCreate,
  handleValidationErrors,
};
