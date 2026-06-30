const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const COLLECTIONS_FILE = path.join(__dirname, '../data/collections.json');

function readCollections() {
  return JSON.parse(fs.readFileSync(COLLECTIONS_FILE, 'utf8'));
}

function writeCollections(data) {
  fs.writeFileSync(COLLECTIONS_FILE, JSON.stringify(data, null, 2));
}

// GET all collections
router.get('/', (req, res) => {
  try {
    const collections = readCollections();
    res.json(collections);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read collections' });
  }
});

// GET single collection
router.get('/:id', (req, res) => {
  try {
    const collections = readCollections();
    const collection = collections.find(c => c.id === req.params.id);
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    res.json(collection);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read collection' });
  }
});

// POST create collection
router.post('/', (req, res) => {
  try {
    const collections = readCollections();
    const newCollection = {
      id: req.body.id || uuidv4(),
      name: req.body.name || '',
      description: req.body.description || '',
      visible: req.body.visible !== undefined ? Boolean(req.body.visible) : true
    };
    if (collections.find(c => c.id === newCollection.id)) {
      return res.status(400).json({ error: 'Collection with this ID already exists' });
    }
    collections.push(newCollection);
    writeCollections(collections);
    res.status(201).json(newCollection);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create collection' });
  }
});

// PUT update collection
router.put('/:id', (req, res) => {
  try {
    const collections = readCollections();
    const index = collections.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Collection not found' });
    collections[index] = {
      ...collections[index],
      ...req.body,
      id: req.params.id
    };
    writeCollections(collections);
    res.json(collections[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update collection' });
  }
});

// DELETE collection
router.delete('/:id', (req, res) => {
  try {
    const collections = readCollections();
    const index = collections.findIndex(c => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Collection not found' });
    collections.splice(index, 1);
    writeCollections(collections);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete collection' });
  }
});

module.exports = router;
