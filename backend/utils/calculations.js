import moment from 'moment';
import jwt from 'jsonwebtoken';

export const calculateSplitAmount = (totalAmount, numberOfPeople) => {
  return Math.round((totalAmount / numberOfPeople) * 100) / 100;
};

export const getMonthlyExpenses = (expenses) => {
  const monthlyData = {};
  
  expenses.forEach(expense => {
    const month = moment(expense.date).format('YYYY-MM');
    if (!monthlyData[month]) {
      monthlyData[month] = 0;
    }
    monthlyData[month] += expense.amount;
  });
  
  return monthlyData;
};

export const getCategoryBreakdown = (expenses) => {
  const categoryData = {};
  
  expenses.forEach(expense => {
    if (!categoryData[expense.category]) {
      categoryData[expense.category] = 0;
    }
    categoryData[expense.category] += expense.amount;
  });
  
  return categoryData;
};

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

export const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};