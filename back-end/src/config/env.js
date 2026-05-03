import dotenv from 'dotenv';

dotenv.config();

// Server port number (default: 3000)
export const PORT = process.env.PORT;

// Node environment: "development" | "production"
export const NODE_ENV = process.env.NODE_ENV;

// PostgreSQL connection string for Neon serverless database
export const DATABASE_URL = process.env.DATABASE_URL;

// Google Gemini API key for structured data extraction from job offers
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Base URL of the FastAPI ML service for fraud probability scoring
export const ML_SERVICE_URL = process.env.ML_SERVICE_URL;

// Comma-separated list of allowed CORS origins for frontend access
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
