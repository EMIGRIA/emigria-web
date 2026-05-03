/**
 * AppError
 *
 * Custom error class for operational errors that are safe to send
 * to the client. Non-operational errors (programming bugs) will
 * fall through to the generic 500 handler.
 */

export default class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code (e.g. 400, 404, 422)
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
