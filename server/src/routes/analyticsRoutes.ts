import express from 'express';
import { getDashboardStats, getRevenueTrends, getServiceDistribution } from '../controllers/analyticsController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/trends', getRevenueTrends);
router.get('/distribution', getServiceDistribution);

export default router;
