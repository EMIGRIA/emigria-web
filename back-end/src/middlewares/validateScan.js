import multer from 'multer';
import { z } from 'zod';

// Multer configuration: memory storage, 10MB limit, image types only
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  }
};

export const multerUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter,
});

// Zod schema for scan input validation
const scanSchema = z
  .object({
    text: z.string().min(20).max(10000).optional(),
    url: z.string().url().optional(),
  })
  .refine(
    (data) => data.text || data.url,
    {
      message: 'At least one input is required: text, url, or image file',
    }
  );

export const validateScanInput = (req, res, next) => {
  // If file is uploaded, skip Zod validation (file is valid input)
  if (req.file) {
    return next();
  }

  const result = scanSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: result.error.issues,
    });
  }

  next();
};
