import express from 'express';
import { createShortUrl, getOriginalUrl, deleteShortLink, updateShortUrl, getQRCode, getUserUrls } from '../controllers/url.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import rateLimiter from '../middlewares/rateLimiter.middleware.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Route to create a new short link
router.post(
  '/',
  authMiddleware,
  rateLimiter,
  [
    body('originalUrl').isURL().withMessage('Invalid URL'),
    body('customAlias').optional().isAlphanumeric().withMessage('Custom alias must be alphanumeric'),
    body('expiration').optional().isISO8601().withMessage('Expiration must be a valid date'),
  ],
  createShortUrl
);

// Route to get all URLs for the authenticated user
router.get('/', authMiddleware, getUserUrls);

// Route to retrieve the original URL from a short link
router.get('/:id', getOriginalUrl);

// Route to get QR code for a short link
router.get('/:id/qrcode', getQRCode);

// Route to update a short link
router.put('/:id', authMiddleware, updateShortUrl);

// Route to delete a short link
router.delete('/:id', authMiddleware, deleteShortLink);

export default router;