const Collection = require('../models/Collection');

// @desc    Get all collections
// @route   GET /api/collections
const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().sort({ createdAt: 1 });
    res.json({ success: true, count: collections.length, data: collections });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single collection
// @route   GET /api/collections/:id
const getCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    res.json({ success: true, data: collection });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create collection
// @route   POST /api/collections
const createCollection = async (req, res) => {
  try {
    const collection = await Collection.create(req.body);
    res.status(201).json({ success: true, data: collection });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Collection slug already exists' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update collection
// @route   PUT /api/collections/:id
const updateCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    res.json({ success: true, data: collection });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Collection slug already exists' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete collection
// @route   DELETE /api/collections/:id
const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findByIdAndDelete(req.params.id);
    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }
    res.json({ success: true, message: 'Collection deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCollections, getCollection, createCollection, updateCollection, deleteCollection };
