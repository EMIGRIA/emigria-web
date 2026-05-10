import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const DATABASE_URL = process.env.DATABASE_URL;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
export const ML_SERVICE_URL = process.env.ML_SERVICE_URL;
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
