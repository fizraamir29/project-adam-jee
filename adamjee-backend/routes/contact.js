import express from 'express';
import { submitContact, getAllContacts, markContactRead, deleteContact } from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitContact);
router.get('/', protect, adminOnly, getAllContacts);
router.put('/:id/read', protect, adminOnly, markContactRead);
router.delete('/:id', protect, adminOnly, deleteContact);

export default router;
