import { Router } from 'express';
import scanRouter from './scan.routes.js';

const router = Router();

// Prefix all scan routes with "/api"
router.use('/api', scanRouter);

export default router;