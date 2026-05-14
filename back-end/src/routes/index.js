import { Router } from 'express';
import routes from './routes.js';

const router = Router();

// Prefix all scan routes with "/api"
router.use('/api', routes);

export default router;