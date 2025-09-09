import express from 'express';
import { body } from 'express-validator';
import {
  markAsPaid,
  getSettlements,
  getUserDebts
} from '../controllers/settlementController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.use(protect);

// Mark debt as paid
router.post('/mark-paid', [
  body('expenseId').notEmpty().withMessage('Expense ID is required'),
  body('userId').notEmpty().withMessage('User ID is required')
], validate, markAsPaid);

// Get settlements for a group
router.get('/group/:groupId', getSettlements);

// Get user's debts
router.get('/debts', getUserDebts);

export default router;