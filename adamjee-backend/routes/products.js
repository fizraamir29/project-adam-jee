import express from 'express';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview } from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:identifier', getProduct);
router.post('/:id/reviews', protect, addReview);

// Admin Routes
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

export default router;
