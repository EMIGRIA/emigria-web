/**
 * Scan Request Validation Middleware
 *
 * This middleware will handle:
 * - Zod schema validation for incoming scan request bodies
 *   (text content, URL, or uploaded image)
 * - Multer configuration for multipart file uploads
 *   (brochure images of suspicious job offers)
 *
 * Status: Skeleton — implementation pending
 */

export const validateScan = (req, res, next) => {
  next();
};
