import express from 'express';
import { sendMessage, getChatAnalytics } from '../controllers/chatbotController.js';
import { optionalAuth, protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/message', optionalAuth, sendMessage);
router.get('/analytics', protect, adminOnly, getChatAnalytics);

export default router;
