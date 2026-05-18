import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { ALLOWED_ORIGINS } from './config/env.js';
import router from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Security and CORS configuration
app.use(helmet());
app.use(cors({ origin: ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : '*' }));

// Limit request body size to 10MB to support large image payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API routes
app.use(router);

// Handle undefined routes (404 Not Found)
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route tidak ditemukan: ${req.method} ${req.originalUrl}` });
});

// Global error handler (must be the last middleware)
app.use(errorHandler);

export default app;