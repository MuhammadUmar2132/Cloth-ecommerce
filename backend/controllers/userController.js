const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const makeToken = (id) =>
  jwt.sign({ id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const payload = (u) => ({
  id:      String(u._id),
  name:    u.name,
  email:   u.email,
  phone:   u.phone   || '',
  address: u.address || '',
  city:    u.city    || '',
});

// POST /api/users/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone, address, city } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });

    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone, address, city });
    res.status(201).json({ success: true, token: makeToken(user._id), user: payload(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/users/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    res.json({ success: true, token: makeToken(user._id), user: payload(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user: payload(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (name    !== undefined) user.name    = name;
    if (phone   !== undefined) user.phone   = phone;
    if (address !== undefined) user.address = address;
    if (city    !== undefined) user.city    = city;

    await user.save();
    res.json({ success: true, user: payload(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { register, loginUser, getProfile, updateProfile };
