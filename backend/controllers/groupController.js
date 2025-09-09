import Group from '../models/Group.js';
import User from '../models/User.js';
import Expense from '../models/Expense.js';
import { generateInviteCode } from '../utils/calculations.js';

export const createGroup = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    
    const group = await Group.create({
      name,
      description,
      type,
      createdBy: req.user.id,
      members: [{ user: req.user.id, role: 'admin' }],
      inviteCode: generateInviteCode()
    });

    const populatedGroup = await Group.findById(group._id)
      .populate('members.user', 'name email avatar')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      data: { group: populatedGroup }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      'members.user': req.user.id,
      isActive: true
    })
    .populate('members.user', 'name email avatar')
    .populate('createdBy', 'name email')
    .sort({ updatedAt: -1 });

    // Calculate balances for each group
    const groupsWithBalances = await Promise.all(
      groups.map(async (group) => {
        const expenses = await Expense.find({ group: group._id });
        
        let userBalance = 0;
        expenses.forEach(expense => {
          if (expense.paidBy.toString() === req.user.id) {
            // User paid, so others owe them
            const totalOwed = expense.splitBetween.reduce((sum, split) => {
              if (split.user.toString() !== req.user.id && !split.isPaid) {
                return sum + split.amount;
              }
              return sum;
            }, 0);
            userBalance += totalOwed;
          } else {
            // User owes money
            const userSplit = expense.splitBetween.find(
              split => split.user.toString() === req.user.id
            );
            if (userSplit && !userSplit.isPaid) {
              userBalance -= userSplit.amount;
            }
          }
        });

        return {
          ...group.toObject(),
          userBalance,
          memberCount: group.members.length
        };
      })
    );

    res.json({
      success: true,
      count: groupsWithBalances.length,
      data: { groups: groupsWithBalances }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const joinGroup = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    
    const group = await Group.findOne({ inviteCode, isActive: true });
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Invalid invite code'
      });
    }

    // Check if user is already a member
    const isMember = group.members.some(
      member => member.user.toString() === req.user.id
    );
    
    if (isMember) {
      return res.status(400).json({
        success: false,
        error: 'You are already a member of this group'
      });
    }

    group.members.push({ user: req.user.id, role: 'member' });
    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate('members.user', 'name email avatar')
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      data: { group: populatedGroup }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const addMemberByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }

    // Check if user is admin
    const userMember = group.members.find(
      member => member.user.toString() === req.user.id
    );
    if (!userMember || userMember.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only group admins can add members'
      });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({
        success: false,
        error: 'User not found with this email'
      });
    }

    // Check if user is already a member
    const isMember = group.members.some(
      member => member.user.toString() === userToAdd._id.toString()
    );
    
    if (isMember) {
      return res.status(400).json({
        success: false,
        error: 'User is already a member of this group'
      });
    }

    group.members.push({ user: userToAdd._id, role: 'member' });
    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate('members.user', 'name email avatar')
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      data: { group: populatedGroup }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getGroupDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const group = await Group.findOne({
      _id: id,
      'members.user': req.user.id
    })
    .populate('members.user', 'name email avatar')
    .populate('createdBy', 'name email');

    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }

    // Get group expenses
    const expenses = await Expense.find({ group: id })
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween.user', 'name email avatar')
      .sort({ date: -1 });

    // Calculate individual balances
    const balances = {};
    group.members.forEach(member => {
      balances[member.user._id] = { owes: 0, owed: 0 };
    });

    expenses.forEach(expense => {
      expense.splitBetween.forEach(split => {
        if (!split.isPaid && split.user._id.toString() !== expense.paidBy._id.toString()) {
          balances[split.user._id].owes += split.amount;
          balances[expense.paidBy._id].owed += split.amount;
        }
      });
    });

    res.json({
      success: true,
      data: { 
        group,
        expenses,
        balances
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};