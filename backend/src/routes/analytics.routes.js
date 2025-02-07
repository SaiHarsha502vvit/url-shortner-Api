import express from 'express';
import { getAnalytics, getClickStats } from '../controllers/analytics.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Route to get overall analytics for the shortened URLs
router.get('/', authMiddleware, getAnalytics);

// Route to get click statistics for a specific shortened URL
router.get('/:id/clicks', authMiddleware, getClickStats);

export default router;