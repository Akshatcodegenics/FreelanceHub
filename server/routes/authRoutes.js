const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  validateRegister,
  validateLogin,
  validatePasswordUpdate,
  validateProfileUpdate,
  validateForgotPassword,
  validateResetPassword,
} = require('../middleware/validationMiddleware');

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.put('/reset-password/:resettoken', validateResetPassword, resetPassword);
router.get('/verify/:token', verifyEmail);

// Protected routes
router.use(protect); // All routes after this middleware are protected

router.post('/logout', logout);
router.get('/me', getMe);
router.put('/update-details', validateProfileUpdate, updateDetails);
router.put('/update-password', validatePasswordUpdate, updatePassword);

module.exports = router;
