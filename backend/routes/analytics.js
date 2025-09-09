import express from 'express';
import {
  getSummary,
  getMonthlyData,
  getCategoryData,
  getTrends
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/monthly', getMonthlyData);
router.get('/category', getCategoryData);
router.get('/trends', getTrends);

export default router;