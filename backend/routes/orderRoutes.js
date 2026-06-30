const express = require('express');
const router  = express.Router();
const { createOrder, getUserOrders, getOrder } = require('../controllers/orderController');
const { protectUser } = require('../middleware/authMiddleware');

router.post('/',     protectUser, createOrder);
router.get('/',      protectUser, getUserOrders);
router.get('/:id',   protectUser, getOrder);

module.exports = router;
