/**
 * 404 Not Found Handler
 *
 * Catches any request that does not match a defined route
 * and responds with a structured 404 JSON error.
 */

export const notFound = (req, res) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
