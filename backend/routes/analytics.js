import express from 'express';
import {
  getSummary,
  getMonthlyData,
  getCategoryData,
  getTrends
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

router.use(protect);

router.get('/summary', cacheMiddleware(2 * 60 * 1000), getSummary); // 2 min cache
router.get('/monthly', cacheMiddleware(5 * 60 * 1000), getMonthlyData); // 5 min cache
router.get('/category', cacheMiddleware(3 * 60 * 1000), getCategoryData); // 3 min cache
router.get('/trends', cacheMiddleware(5 * 60 * 1000), getTrends); // 5 min cache

export default router;