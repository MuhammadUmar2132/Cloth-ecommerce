require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = parseInt(process.env.PORT || '5000', 10);

const startServer = async (port) => {
  await connectDB();

  const server = app.listen(port);

  server.on('listening', () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is busy — trying port ${port + 1}...`);
      server.close();
      startServer(port + 1);
    } else {
      console.error('Server error:', err.message);
      process.exit(1);
    }
  });
};

startServer(PORT);
