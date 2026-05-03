import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { ALLOWED_ORIGINS } from './config/env.js';
import router from './routes/index.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Security headers 
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: ALLOWED_ORIGINS ? ALLOWED_ORIGINS.split(',') : '*',
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use(router);

// 404 handler 
app.use(notFound);

// Global error handler 
app.use(errorHandler);

export default app;
