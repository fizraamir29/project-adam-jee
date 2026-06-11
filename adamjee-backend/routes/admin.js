import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getChatSessions
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle', toggleUserStatus);
router.get('/chats', getChatSessions);

export default router;
