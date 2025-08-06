const crypto = require('crypto');
const User = require('../models/User');
const { AppError, asyncHandler } = require('../middleware/errorMiddleware');
const { generateToken, hashToken } = require('../utils/helpers');

/**
 * Send token response
 */
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  // Create token
  const token = user.getSignedJwtToken();

  // Cookie options
  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  // Remove password from output
  user.password = undefined;

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      message,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isEmailVerified: user.isEmailVerified,
        stats: user.stats,
        preferences: user.preferences,
      },
    });
};

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password) {
    return next(new AppError('Please provide name, email and password', 400));
  }

  if (password.length < 6) {
    return next(new AppError('Password must be at least 6 characters', 400));
  }

  // Demo mode - create demo user
  if (email.includes('demo') || email.includes('test')) {
    const demoUser = {
      _id: `demo-user-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      role: role || 'client',
      avatar: {
        url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      isEmailVerified: true,
      isActive: true,
      stats: {
        totalOrders: 0,
        completedOrders: 0,
        averageRating: 0,
        totalEarnings: 0
      },
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true
      },
      getSignedJwtToken: function() {
        return require('jsonwebtoken').sign({ id: this._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE || '7d'
        });
      }
    };

    return sendTokenResponse(demoUser, 201, res, 'Demo user registered successfully!');
  }

  try {
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return next(new AppError('User already exists with this email', 400));
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'client',
    });

    // Generate email verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // TODO: Send verification email
    console.log(`Email verification token: ${verificationToken}`);

    sendTokenResponse(user, 201, res, 'User registered successfully. Please check your email for verification.');
  } catch (error) {
    // If database is not available, return error
    return next(new AppError('Database not available. Registration is disabled in demo mode.', 503));
  }
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new AppError('Please provide an email and password', 400));
  }

  // Demo mode - check for demo credentials
  if (email === 'demo@freelancehub.com' && password === 'demo123') {
    const demoUser = {
      _id: 'demo-user-id',
      name: 'Demo User',
      email: 'demo@freelancehub.com',
      role: 'client',
      avatar: {
        url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      isEmailVerified: true,
      isActive: true,
      stats: {
        totalOrders: 0,
        completedOrders: 0,
        averageRating: 0,
        totalEarnings: 0
      },
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: true
      },
      getSignedJwtToken: function() {
        return require('jsonwebtoken').sign({ id: this._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRE || '7d'
        });
      }
    };

    return sendTokenResponse(demoUser, 200, res, 'Demo login successful');
  }

  // Try database connection if available
  try {
    // Check for user (include password since it's select: false)
    const user = await User.findByEmail(email).select('+password');

    if (!user) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.correctPassword(password, user.password);

    if (!isMatch) {
      return next(new AppError('Invalid credentials', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(new AppError('Your account has been deactivated', 401));
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error) {
    // If database is not available, return error
    return next(new AppError('Database not available. Use demo credentials: demo@freelancehub.com / demo123', 503));
  }
});

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills,
      languages: user.languages,
      location: user.location,
      contact: user.contact,
      hourlyRate: user.hourlyRate,
      availability: user.availability,
      isEmailVerified: user.isEmailVerified,
      stats: user.stats,
      preferences: user.preferences,
      joinedAt: user.joinedAt,
      lastLogin: user.lastLogin,
    },
  });
});

/**
 * @desc    Update user details
 * @route   PUT /api/auth/updatedetails
 * @access  Private
 */
const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
    bio: req.body.bio,
    skills: req.body.skills,
    languages: req.body.languages,
    location: req.body.location,
    contact: req.body.contact,
    hourlyRate: req.body.hourlyRate,
    availability: req.body.availability,
    preferences: req.body.preferences,
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => {
    if (fieldsToUpdate[key] === undefined) {
      delete fieldsToUpdate[key];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user,
  });
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError('Please provide current and new password', 400));
  }

  if (newPassword.length < 6) {
    return next(new AppError('New password must be at least 6 characters', 400));
  }

  const user = await User.findById(req.user._id).select('+password');

  // Check current password
  const isMatch = await user.correctPassword(currentPassword, user.password);

  if (!isMatch) {
    return next(new AppError('Current password is incorrect', 400));
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password updated successfully');
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgotpassword
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Please provide an email address', 400));
  }

  const user = await User.findByEmail(email);

  if (!user) {
    return next(new AppError('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // TODO: Send email with reset token
  console.log(`Password reset token: ${resetToken}`);

  res.status(200).json({
    success: true,
    message: 'Password reset email sent',
  });
});

/**
 * @desc    Reset password
 * @route   PUT /api/auth/resetpassword/:resettoken
 * @access  Public
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;
  const resetPasswordToken = hashToken(req.params.resettoken);

  if (!password) {
    return next(new AppError('Please provide a password', 400));
  }

  if (password.length < 6) {
    return next(new AppError('Password must be at least 6 characters', 400));
  }

  const user = await User.findOne({
    passwordResetToken: resetPasswordToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Invalid or expired reset token', 400));
  }

  // Set new password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res, 'Password reset successful');
});

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify/:token
 * @access  Public
 */
const verifyEmail = asyncHandler(async (req, res, next) => {
  const emailVerificationToken = hashToken(req.params.token);

  const user = await User.findOne({
    emailVerificationToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Invalid or expired verification token', 400));
  }

  // Update user
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
