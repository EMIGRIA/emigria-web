import dotenv from 'dotenv';
dotenv.config(); // Load environment variables first

import app from './app.js';
import { PORT } from './config/env.js';
import { testConnection } from './config/db.js';

const port = PORT || 3000;

// Check Neon database connection before starting the server
testConnection()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`Backend Emigria berjalan di port ${port}`);
    });

    // Gracefully handle uncaught exceptions to prevent sudden crashes
    process.on('uncaughtException', (err) => {
      console.error('Ada error tak terduga:', err);
      process.exit(1);
    });

    process.on('unhandledRejection', (err) => {
      console.error('Ada promise gagal tanpa catch:', err);
      server.close(() => process.exit(1));
    });
  })
  .catch((err) => {
    console.error('Koneksi database gagal:', err.message);
    process.exit(1); // Exit if the database connection fails
  });