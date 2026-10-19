const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes       = require('./routes/authRoutes');
const productRoutes    = require('./routes/productRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const siteRoutes       = require('./routes/siteRoutes');
const uploadRoutes     = require('./routes/uploadRoutes');
const userRoutes       = require('./routes/userRoutes');
const orderRoutes      = require('./routes/orderRoutes');

const app = express();

// Middleware
app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth',        authRoutes);
app.use('/api/products',    productRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/site',        siteRoutes);
app.use('/api/upload',      uploadRoutes);
app.use('/api/users',       userRoutes);
app.use('/api/orders',      orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CAVENRO API is running', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

module.exports = app;
