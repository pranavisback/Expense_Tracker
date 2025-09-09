import express from 'express';
import { body } from 'express-validator';
import {
  getUserNotifications,
  markAsRead,
  respondToGroupInvite
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.use(protect);

// Get user notifications
router.get('/', getUserNotifications);

// Mark notification as read
router.put('/:notificationId/read', markAsRead);

// Respond to group invite
router.post('/:notificationId/respond', [
  body('action').isIn(['accept', 'reject']).withMessage('Action must be accept or reject')
], validate, respondToGroupInvite);

export default router;