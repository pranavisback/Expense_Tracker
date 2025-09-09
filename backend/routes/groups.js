import express from 'express';
import { body } from 'express-validator';
import {
  createGroup,
  getUserGroups,
  joinGroup,
  addMemberByEmail,
  getGroupDetails
} from '../controllers/groupController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.use(protect);

// Get all user groups
router.get('/', getUserGroups);

// Create group
router.post('/', [
  body('name').notEmpty().withMessage('Group name is required'),
  body('type').isIn(['roommates', 'trip', 'office', 'family', 'friends', 'other']).withMessage('Invalid group type')
], validate, createGroup);

// Join group by invite code
router.post('/join', [
  body('inviteCode').notEmpty().withMessage('Invite code is required')
], validate, joinGroup);

// Add member by email
router.post('/:groupId/members', [
  body('email').isEmail().withMessage('Valid email is required')
], validate, addMemberByEmail);

// Get single group with details
router.get('/:id', getGroupDetails);

export default router;