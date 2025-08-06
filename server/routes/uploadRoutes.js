const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented with image upload functionality
router.post('/image', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Upload routes not yet implemented'
  });
});

router.post('/images', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Upload routes not yet implemented'
  });
});

router.delete('/image/:publicId', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Upload routes not yet implemented'
  });
});

module.exports = router;
