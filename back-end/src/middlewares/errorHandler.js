import { NODE_ENV } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  // Log all errors
  console.error('Error:', err.message || err);

  // Handle known operational errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // ZodError — validation error
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.issues,
    });
  }

  // Default — unknown/programming error
  const statusCode = 500;
  const message =
    NODE_ENV === 'development'
      ? err.message
      : 'Terjadi kesalahan pada server';

  res.status(statusCode).json({
    success: false,
    message,
  });
};
