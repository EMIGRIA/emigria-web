/**
 * Global Error Handler Middleware
 *
 * Catches all errors forwarded via next(err) or thrown in async handlers.
 * Must have exactly 4 parameters so Express recognizes it as an error handler.
 */

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: isOperational ? err.message : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
