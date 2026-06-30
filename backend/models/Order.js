const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    productId: { type: String, default: '' },
    name:      { type: String, required: true },
    price:     { type: Number, required: true },
    salePrice: { type: Number, default: null },
    image:     { type: String, default: '' },
    quantity:  { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items:   [itemSchema],
    total:   { type: Number, required: true },
    name:    { type: String, required: true },
    phone:   { type: String, required: true },
    address: { type: String, required: true },
    city:    { type: String, required: true },
    notes:   { type: String, default: '' },
    status:  {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

orderSchema.pre('save', function () {
  if (!this.orderNumber) {
    const ts   = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.orderNumber = `ZPH-${ts}-${rand}`;
  }
});

module.exports = mongoose.model('Order', orderSchema);
