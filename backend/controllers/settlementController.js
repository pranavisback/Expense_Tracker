import Settlement from '../models/Settlement.js';
import Expense from '../models/Expense.js';

export const markAsPaid = async (req, res) => {
  try {
    const { expenseId, userId } = req.body;
    
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found'
      });
    }

    // Find the split for this user
    const splitIndex = expense.splitBetween.findIndex(
      split => split.user.toString() === userId
    );

    if (splitIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found in expense split'
      });
    }

    // Mark as paid
    expense.splitBetween[splitIndex].isPaid = true;
    expense.splitBetween[splitIndex].paidAt = new Date();

    // Check if all splits are paid
    const allPaid = expense.splitBetween.every(split => split.isPaid);
    if (allPaid) {
      expense.isFullySettled = true;
    }

    await expense.save();

    // Create settlement record
    await Settlement.create({
      expense: expenseId,
      group: expense.group,
      paidBy: userId,
      paidTo: expense.paidBy,
      amount: expense.splitBetween[splitIndex].amount,
      note: `Payment for: ${expense.title}`
    });

    const populatedExpense = await Expense.findById(expenseId)
      .populate('paidBy', 'name email avatar')
      .populate('splitBetween.user', 'name email avatar');

    res.json({
      success: true,
      message: 'Payment marked as received',
      data: { expense: populatedExpense }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getSettlements = async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const settlements = await Settlement.find({ group: groupId })
      .populate('paidBy', 'name email avatar')
      .populate('paidTo', 'name email avatar')
      .populate('expense', 'title amount')
      .sort({ settledAt: -1 });

    res.json({
      success: true,
      count: settlements.length,
      data: { settlements }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getUserDebts = async (req, res) => {
  try {
    const expenses = await Expense.find({
      'splitBetween.user': req.user.id,
      'splitBetween.isPaid': false
    })
    .populate('paidBy', 'name email avatar')
    .populate('group', 'name')
    .sort({ date: -1 });

    const debts = [];
    expenses.forEach(expense => {
      const userSplit = expense.splitBetween.find(
        split => split.user.toString() === req.user.id && !split.isPaid
      );
      
      if (userSplit) {
        debts.push({
          expenseId: expense._id,
          title: expense.title,
          amount: userSplit.amount,
          paidBy: expense.paidBy,
          group: expense.group,
          date: expense.date
        });
      }
    });

    res.json({
      success: true,
      count: debts.length,
      data: { debts }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};