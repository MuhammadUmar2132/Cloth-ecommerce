const jwt = require('jsonwebtoken');

// @desc    Admin login
// @route   POST /api/auth/login
const login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please provide username and password' });
  }

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  res.json({ success: true, token, username });
};

// @desc    Verify token
// @route   GET /api/auth/verify
const verify = (req, res) => {
  res.json({ success: true, valid: true, admin: req.admin });
};

module.exports = { login, verify };
