const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PRODUCTS_FILE = path.join(__dirname, '../data/products.json');

function readProducts() {
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
}

function writeProducts(data) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(data, null, 2));
}

// GET all products (optional ?collection= filter)
router.get('/', (req, res) => {
  try {
    let products = readProducts();
    if (req.query.collection) {
      products = products.filter(p => p.collection === req.query.collection);
    }
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read products' });
  }
});

// GET single product
router.get('/:id', (req, res) => {
  try {
    const products = readProducts();
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read product' });
  }
});

// POST create product
router.post('/', (req, res) => {
  try {
    const products = readProducts();
    const newProduct = {
      id: uuidv4(),
      name: req.body.name || '',
      price: Number(req.body.price) || 0,
      salePrice: req.body.salePrice ? Number(req.body.salePrice) : null,
      soldOut: Boolean(req.body.soldOut) || false,
      collection: req.body.collection || '',
      image: req.body.image || '',
      description: req.body.description || ''
    };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product
router.put('/:id', (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Product not found' });
    products[index] = {
      ...products[index],
      ...req.body,
      id: req.params.id,
      price: req.body.price !== undefined ? Number(req.body.price) : products[index].price,
      salePrice: req.body.salePrice !== undefined ? (req.body.salePrice ? Number(req.body.salePrice) : null) : products[index].salePrice
    };
    writeProducts(products);
    res.json(products[index]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product
router.delete('/:id', (req, res) => {
  try {
    const products = readProducts();
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Product not found' });
    products.splice(index, 1);
    writeProducts(products);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
