const express = require('express');
const router = express.Router();

// Placeholder routes - will be implemented later
router.get('/profile', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'User routes not yet implemented'
  });
});

router.put('/profile', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'User routes not yet implemented'
  });
});

module.exports = router;
