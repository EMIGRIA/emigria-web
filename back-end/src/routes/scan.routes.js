import { Router } from 'express';
import { analyze } from '../controllers/scan.controller.js';
import { getTrends } from '../controllers/analytics.controller.js';
import { globalLimiter, scanLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Scan endpoint — submit job offer for fraud analysis
router.post('/api/scan', scanLimiter, analyze);

// Analytics endpoint — aggregated scan trends
router.get('/api/analytics', globalLimiter, getTrends);

export default router;
