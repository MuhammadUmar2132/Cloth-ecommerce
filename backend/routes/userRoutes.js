const express = require('express');
const router  = express.Router();
const { register, loginUser, getProfile, updateProfile } = require('../controllers/userController');
const { protectUser } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login',    loginUser);
router.get('/profile',  protectUser, getProfile);
router.put('/profile',  protectUser, updateProfile);

module.exports = router;
