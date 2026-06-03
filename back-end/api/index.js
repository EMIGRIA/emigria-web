import dotenv from 'dotenv';
dotenv.config();

import app from '../src/app.js';

// Vercel serverless function entry point — re-export Express app
export default app;
