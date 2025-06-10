import express from 'express';
import { addDomain, verifyDomain, listDomains, removeDomain } from '../controllers/domain.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/add', authMiddleware, addDomain);
router.post('/verify', authMiddleware, verifyDomain);
router.get('/list', authMiddleware, listDomains);
router.delete('/remove/:domainName', authMiddleware, removeDomain);

export default router;
