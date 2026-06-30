require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Collection = require('./models/Collection');
const Site = require('./models/Site');

const products = [
  { name: 'Heritage', price: 5250, salePrice: null, soldOut: false, collection: 'blended', description: 'Premium blended fabric' },
  { name: 'Aragon', price: 4800, salePrice: null, soldOut: false, collection: 'cotton', description: 'Fine cotton fabric' },
  { name: 'Opal', price: 6100, salePrice: 5500, soldOut: false, collection: 'blended', description: 'Elegant blended fabric' },
  { name: 'Andaz', price: 5250, salePrice: null, soldOut: true, collection: 'blended', description: 'Classic blended fabric' },
  { name: 'Emperor', price: 6100, salePrice: null, soldOut: false, collection: 'blended', description: 'Royal blended fabric' },
  { name: 'Nectar', price: 4800, salePrice: null, soldOut: false, collection: 'cotton', description: 'Pure cotton fabric' },
  { name: 'Aurora', price: 7500, salePrice: 6800, soldOut: false, collection: 'winter', description: 'Warm winter fabric' },
  { name: 'Velvet', price: 5200, salePrice: null, soldOut: false, collection: 'winter', description: 'Soft winter fabric' },
];

const collections = [
  { slug: 'blended', name: 'Blended Collection', description: 'Premium blended fabrics', visible: true },
  { slug: 'cotton', name: 'Cotton Collection', description: 'Pure cotton fabrics', visible: true },
  { slug: 'winter', name: 'Winter Collection', description: 'Warm winter fabrics', visible: true },
  { slug: 'summer', name: 'Summer Collection', description: 'Lightweight summer fabrics', visible: true },
  { slug: 'eid', name: 'Eid Collection', description: 'Festive Eid fabrics', visible: true },
];

const seed = async () => {
  await connectDB();
  try {
    await Product.deleteMany();
    await Collection.deleteMany();
    await Site.deleteMany();

    await Product.insertMany(products);
    await Collection.insertMany(collections);
    // Site document will be auto-created by siteController on first GET

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Seeding error:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();
