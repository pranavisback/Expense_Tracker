import Expense from '../models/Expense.js';
import User from '../models/User.js';
import Group from '../models/Group.js';
import { clearUserCache } from '../middleware/cache.js';

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id })
      .populate('group', 'name')
      .populate('splitBetween', 'name email')
      .sort({ date: -1 });

    res.json({
      success: true,
      count: expenses.length,
      data: { expenses }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('group', 'name').populate('splitBetween', 'name email');

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    res.json({
      success: true,
      data: { expense }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const createExpense = async (req, res) => {
  try {
    const { title, amount, category, description, group, splitBetween, splitMethod } = req.body;
    
    // Calculate split amounts
    let splitData = [];
    if (splitMethod === 'equal') {
      const splitAmount = amount / splitBetween.length;
      splitData = splitBetween.map(userId => ({
        user: userId,
        amount: Math.round(splitAmount * 100) / 100,
        isPaid: userId === req.user.id // Payer doesn't owe themselves
      }));
    } else {
      // For exact amounts, use provided amounts
      splitData = splitBetween;
    }

    const expense = await Expense.create({
      title,
      amount,
      category,
      description,
      user: req.user.id,
      paidBy: req.user.id,
      group,
      splitBetween: splitData,
      splitMethod
    });

    // Update user's total expenses
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalExpenses: amount }
    });

    // Update group's total expenses
    if (group) {
      await Group.findByIdAndUpdate(group, {
        $inc: { totalExpenses: amount }
      });
    }

    const populatedExpense = await Expense.findById(expense._id)
      .populate('group', 'name')
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween.user', 'name email avatar');

    // Clear cache for user and group members
    clearUserCache(req.user.id);
    if (group) {
      const groupData = await Group.findById(group).populate('members.user');
      groupData.members.forEach(member => {
        clearUserCache(member.user._id.toString());
      });
    }

    res.status(201).json({
      success: true,
      data: { expense: populatedExpense }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    const oldAmount = expense.amount;
    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('group', 'name').populate('splitBetween', 'name email');

    // Update user's total expenses
    const amountDifference = expense.amount - oldAmount;
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalExpenses: amountDifference }
    });

    res.json({
      success: true,
      data: { expense }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    // Update user's total expenses
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { totalExpenses: -expense.amount }
    });

    // Update group's total expenses if it's a group expense
    if (expense.group) {
      await Group.findByIdAndUpdate(expense.group, {
        $inc: { totalExpenses: -expense.amount }
      });
    }

    await expense.deleteOne();

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getExpensesByCategory = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user.id,
      category: req.params.category
    }).sort({ date: -1 });

    res.json({
      success: true,
      count: expenses.length,
      data: { expenses }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};