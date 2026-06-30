const express = require('express');
const router = express.Router();

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_TOKEN = 'simple-admin-token-123';

// POST login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true, token: ADMIN_TOKEN, username: ADMIN_USERNAME });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

// GET verify token
router.get('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.replace('Bearer ', '');
  if (token === ADMIN_TOKEN) {
    res.json({ valid: true, username: ADMIN_USERNAME });
  } else {
    res.status(401).json({ valid: false, error: 'Invalid token' });
  }
});

module.exports = router;
