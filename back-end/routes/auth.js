const verifyToken = require('../middleware/auth');
const express = require('express');
const router = express.Router();
router.get('/me', verifyToken, (req, res) => {
  res.json({
    message: 'Access granted!',
    user: req.user
  });
});

module.exports = router;