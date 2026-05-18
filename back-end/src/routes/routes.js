import { Router } from 'express';
import { analyze } from '../controllers/scan.controller.js';
import { getTrends } from '../controllers/analytics.controller.js';
import { multerUpload, validateScanInput } from '../middlewares/validateScan.js';

const router = Router();

// Main endpoint for fraud detection (with image upload support)
router.post('/scan', multerUpload.single('brochure'), validateScanInput, analyze);

// Endpoint to retrieve Emigria analytics data
router.get('/analytics', getTrends);

// Server health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;