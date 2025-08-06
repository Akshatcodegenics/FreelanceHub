const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getConversations,
  getMessages,
  sendTextMessage,
  sendFileMessage,
  sendVoiceMessage,
  sendPaymentRequest,
  upload
} = require('../controllers/messageController');

// Apply authentication to all routes
router.use(protect);

// Validation middleware
const validateTextMessage = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message content must be between 1 and 1000 characters'),
  body('type')
    .optional()
    .isIn(['text', 'email', 'system'])
    .withMessage('Invalid message type')
];

const validatePaymentRequest = [
  body('amount')
    .isFloat({ min: 0.50 })
    .withMessage('Amount must be at least $0.50'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Description is required and must be under 200 characters'),
  body('currency')
    .optional()
    .isIn(['usd', 'eur', 'gbp'])
    .withMessage('Invalid currency')
];

// Routes
router.get('/conversations', getConversations);
router.get('/conversations/:conversationId/messages', getMessages);
router.post('/conversations/:conversationId/messages', validateTextMessage, sendTextMessage);
router.post('/conversations/:conversationId/files', upload.single('file'), sendFileMessage);
router.post('/conversations/:conversationId/voice', upload.single('file'), sendVoiceMessage);
router.post('/conversations/:conversationId/payment-request', validatePaymentRequest, sendPaymentRequest);

module.exports = router;
