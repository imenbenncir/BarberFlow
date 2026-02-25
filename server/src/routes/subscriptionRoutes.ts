import express from 'express';
import { createCheckoutSession, createPortalSession, handleWebhook } from '../controllers/subscriptionController';
import { protect } from '../middleware/auth';

const router = express.Router();

// Webhook must be accessible without auth but needs raw body handling
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Regular JSON parsing for other billing routes
router.use(express.json());

// Protected routes
router.use(protect);
router.post('/checkout', createCheckoutSession);
router.post('/portal', createPortalSession);

export default router;
