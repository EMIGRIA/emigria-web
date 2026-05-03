import rateLimit from 'express-rate-limit';

/**
 * Global Rate Limiter
 *
 * Applied to all routes to prevent abuse.
 * Default: 100 requests per 15-minute window per IP.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many requests, please try again later.',
  },
});

/**
 * Scan Endpoint Rate Limiter
 *
 * Stricter limit specifically for POST /api/scan to prevent
 * abuse of the AI-powered fraud detection pipeline.
 * Default: 10 scan requests per 15-minute window per IP.
 */
export const scanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    statusCode: 429,
    message: 'Too many scan requests, please try again later.',
  },
});
