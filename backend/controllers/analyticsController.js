import Expense from '../models/Expense.js';
import { getMonthlyExpenses, getCategoryBreakdown } from '../utils/calculations.js';
import moment from 'moment';

export const getSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Current month expenses
    const currentMonth = moment().format('YYYY-MM');
    const currentMonthExpenses = expenses.filter(expense => 
      moment(expense.date).format('YYYY-MM') === currentMonth
    );
    const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Previous month for comparison
    const previousMonth = moment().subtract(1, 'month').format('YYYY-MM');
    const previousMonthExpenses = expenses.filter(expense => 
      moment(expense.date).format('YYYY-MM') === previousMonth
    );
    const previousMonthTotal = previousMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const monthlyChange = previousMonthTotal > 0 
      ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal * 100).toFixed(1)
      : 0;

    const categoryBreakdown = getCategoryBreakdown(expenses);
    const recentExpenses = expenses.slice(0, 5);

    res.json({
      success: true,
      data: {
        totalExpenses,
        currentMonthTotal,
        monthlyChange: parseFloat(monthlyChange),
        categoryBreakdown,
        recentExpenses,
        totalTransactions: expenses.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getMonthlyData = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    const monthlyData = getMonthlyExpenses(expenses);
    
    // Get last 12 months
    const last12Months = [];
    for (let i = 11; i >= 0; i--) {
      const month = moment().subtract(i, 'months').format('YYYY-MM');
      const monthName = moment().subtract(i, 'months').format('MMM');
      last12Months.push({
        month: monthName,
        amount: monthlyData[month] || 0
      });
    }

    res.json({
      success: true,
      data: {
        labels: last12Months.map(item => item.month),
        datasets: [{
          data: last12Months.map(item => item.amount),
          backgroundColor: '#4CAF50'
        }]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getCategoryData = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    const categoryBreakdown = getCategoryBreakdown(expenses);
    
    const labels = Object.keys(categoryBreakdown);
    const data = Object.values(categoryBreakdown);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

    res.json({
      success: true,
      data: {
        labels,
        data,
        colors: colors.slice(0, labels.length)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getTrends = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    
    // Weekly trends for last 4 weeks
    const weeklyTrends = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = moment().subtract(i, 'weeks').startOf('week');
      const weekEnd = moment().subtract(i, 'weeks').endOf('week');
      
      const weekExpenses = expenses.filter(expense => 
        moment(expense.date).isBetween(weekStart, weekEnd, null, '[]')
      );
      
      const weekTotal = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      weeklyTrends.push({
        week: `Week ${4-i}`,
        amount: weekTotal
      });
    }

    res.json({
      success: true,
      data: {
        weeklyTrends,
        averageWeekly: weeklyTrends.reduce((sum, week) => sum + week.amount, 0) / 4
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};