import express from 'express';
import { createShortUrl, getOriginalUrl, deleteShortLink, updateShortUrl } from '../controllers/url.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import rateLimiter from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

// Route to create a new short link
router.post('/', authMiddleware, rateLimiter, createShortUrl);

// Route to retrieve the original URL from a short link
router.get('/:id', getOriginalUrl);

// Route to update a short link
router.put('/:id', authMiddleware, updateShortUrl);

// Route to delete a short link
router.delete('/:id', authMiddleware, deleteShortLink);

export default router;