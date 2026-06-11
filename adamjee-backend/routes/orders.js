import express from 'express';
import { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, adminOnly, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:orderId', protect, getOrder);

// Admin Routes
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:orderId/status', protect, adminOnly, updateOrderStatus);

export default router;
