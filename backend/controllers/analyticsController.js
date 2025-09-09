import Expense from '../models/Expense.js';
import Group from '../models/Group.js';
import User from '../models/User.js';
import { getMonthlyExpenses, getCategoryBreakdown } from '../utils/calculations.js';
import moment from 'moment';

export const getSummary = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Get date range based on period
    let startDate, endDate = new Date();
    
    switch (period) {
      case 'week':
        startDate = moment().startOf('week').toDate();
        break;
      case 'month':
        startDate = moment().startOf('month').toDate();
        break;
      case '3months':
        startDate = moment().subtract(3, 'months').startOf('month').toDate();
        break;
      case 'year':
        startDate = moment().startOf('year').toDate();
        break;
      default:
        startDate = moment().startOf('month').toDate();
    }

    // Get expenses for the period
    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });
    
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate average per day
    const days = moment(endDate).diff(moment(startDate), 'days') + 1;
    const avgPerDay = days > 0 ? totalExpenses / days : 0;
    
    // Get user's groups count
    const userGroups = await Group.find({
      'members.user': req.user.id,
      isActive: true
    });
    
    // Get total transactions count
    const totalTransactions = await Expense.countDocuments({ user: req.user.id });
    
    // Get user's total spent (all time)
    const allTimeExpenses = await Expense.find({ user: req.user.id });
    const totalSpent = allTimeExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const categoryBreakdown = getCategoryBreakdown(expenses);
    const recentExpenses = expenses.slice(0, 5);

    res.json({
      success: true,
      data: {
        period,
        totalExpenses,
        avgPerDay: Math.round(avgPerDay * 100) / 100,
        categoryBreakdown,
        recentExpenses,
        totalTransactions,
        activeGroups: userGroups.length,
        totalSpent,
        dateRange: {
          start: startDate,
          end: endDate
        }
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
    const { period = 'year' } = req.query;
    
    let chartData = [];
    let expenses;
    
    if (period === 'week') {
      // Last 7 days
      expenses = await Expense.find({
        user: req.user.id,
        date: { $gte: moment().subtract(6, 'days').startOf('day').toDate() }
      });
      
      for (let i = 6; i >= 0; i--) {
        const date = moment().subtract(i, 'days');
        const dayExpenses = expenses.filter(expense => 
          moment(expense.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
        );
        const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        chartData.push({
          label: date.format('ddd'),
          amount: total
        });
      }
    } else if (period === 'month') {
      // Last 30 days
      expenses = await Expense.find({
        user: req.user.id,
        date: { $gte: moment().subtract(29, 'days').startOf('day').toDate() }
      });
      
      for (let i = 29; i >= 0; i -= 5) {
        const endDate = moment().subtract(i, 'days');
        const startDate = moment().subtract(i + 4, 'days');
        
        const periodExpenses = expenses.filter(expense => {
          const expenseDate = moment(expense.date);
          return expenseDate.isBetween(startDate, endDate, null, '[]');
        });
        
        const total = periodExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        chartData.push({
          label: `${startDate.format('DD')}-${endDate.format('DD')}`,
          amount: total
        });
      }
    } else if (period === '3months') {
      // Last 3 months
      expenses = await Expense.find({
        user: req.user.id,
        date: { $gte: moment().subtract(2, 'months').startOf('month').toDate() }
      });
      
      for (let i = 2; i >= 0; i--) {
        const month = moment().subtract(i, 'months');
        const monthExpenses = expenses.filter(expense => 
          moment(expense.date).format('YYYY-MM') === month.format('YYYY-MM')
        );
        const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        chartData.push({
          label: month.format('MMM'),
          amount: total
        });
      }
    } else {
      // Last 12 months (year)
      expenses = await Expense.find({
        user: req.user.id,
        date: { $gte: moment().subtract(11, 'months').startOf('month').toDate() }
      });
      
      for (let i = 11; i >= 0; i--) {
        const month = moment().subtract(i, 'months');
        const monthExpenses = expenses.filter(expense => 
          moment(expense.date).format('YYYY-MM') === month.format('YYYY-MM')
        );
        const total = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        chartData.push({
          label: month.format('MMM'),
          amount: total
        });
      }
    }

    res.json({
      success: true,
      data: {
        period,
        labels: chartData.map(item => item.label),
        datasets: [{
          data: chartData.map(item => item.amount),
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
    const { period = 'month' } = req.query;
    
    // Get date range based on period
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = moment().startOf('week').toDate();
        break;
      case 'month':
        startDate = moment().startOf('month').toDate();
        break;
      case '3months':
        startDate = moment().subtract(3, 'months').startOf('month').toDate();
        break;
      case 'year':
        startDate = moment().startOf('year').toDate();
        break;
      default:
        startDate = moment().startOf('month').toDate();
    }

    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startDate }
    });
    
    const categoryBreakdown = getCategoryBreakdown(expenses);
    const totalAmount = Object.values(categoryBreakdown).reduce((sum, amount) => sum + amount, 0);
    
    const labels = Object.keys(categoryBreakdown);
    const data = Object.values(categoryBreakdown);
    const percentages = data.map(amount => totalAmount > 0 ? ((amount / totalAmount) * 100).toFixed(1) : 0);
    
    const colors = ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#795548', '#607D8B'];

    // Create detailed breakdown
    const categoryDetails = labels.map((label, index) => ({
      category: label,
      amount: data[index],
      percentage: percentages[index],
      color: colors[index % colors.length]
    })).sort((a, b) => b.amount - a.amount);

    res.json({
      success: true,
      data: {
        period,
        labels,
        data,
        percentages,
        colors: colors.slice(0, labels.length),
        categoryDetails,
        totalAmount
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