const express = require('express');
const router = express.Router();
const {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
} = require('../controllers/collectionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getCollections).post(protect, createCollection);
router.route('/:id').get(getCollection).put(protect, updateCollection).delete(protect, deleteCollection);

module.exports = router;
