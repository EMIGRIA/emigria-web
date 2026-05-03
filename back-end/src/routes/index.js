import { Router } from 'express';
import scanRouter from './scan.routes.js';

const router = Router();

// mount all route modules
router.use(scanRouter);

export default router;
