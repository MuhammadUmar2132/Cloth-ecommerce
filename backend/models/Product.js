const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    salePrice: {
      type: Number,
      default: null,
      min: [0, 'Sale price cannot be negative'],
    },
    soldOut: {
      type: Boolean,
      default: false,
    },
    collection: {
      type: String,
      required: [true, 'Collection is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

module.exports = mongoose.model('Product', productSchema);
