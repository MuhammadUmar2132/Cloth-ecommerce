const Order = require('../models/Order');

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items, total, name, phone, address, city, notes } = req.body;
    if (!items || items.length === 0)
      return res.status(400).json({ success: false, message: 'No items provided' });

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      name,
      phone,
      address,
      city,
      notes: notes || '',
    });

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/orders/:id
const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { createOrder, getUserOrders, getOrder };
