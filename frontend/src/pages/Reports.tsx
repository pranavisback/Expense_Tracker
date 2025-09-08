import { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, DollarSign } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const categoryData = [
  { name: 'Food', value: 450, color: '#4CAF50' },
  { name: 'Transport', value: 230, color: '#2196F3' },
  { name: 'Entertainment', value: 180, color: '#FFC107' },
  { name: 'Shopping', value: 120, color: '#FF5722' },
  { name: 'Healthcare', value: 80, color: '#9C27B0' }
];

const monthlyData = [
  { month: 'Jan', amount: 1200 },
  { month: 'Feb', amount: 980 },
  { month: 'Mar', amount: 1450 },
  { month: 'Apr', amount: 1100 },
  { month: 'May', amount: 1350 },
  { month: 'Jun', amount: 1060 }
];

const timeRanges = ['This Week', 'This Month', 'Last 3 Months', 'This Year'];

export default function Reports() {
  const [selectedRange, setSelectedRange] = useState('This Month');
  const [animationKey, setAnimationKey] = useState(0);

  const handleRangeChange = (range: string) => {
    setSelectedRange(range);
    setAnimationKey(prev => prev + 1);
  };

  const totalSpent = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-background-light pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm p-6 rounded-b-3xl"
      >
        <h1 className="text-2xl font-bold text-text-dark mb-4">Spending Reports</h1>
        
        {/* Time Range Selector */}
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {timeRanges.map((range) => (
            <motion.button
              key={range}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRangeChange(range)}
              className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${
                selectedRange === range
                  ? 'bg-primary-green text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-primary-green to-primary-blue rounded-2xl p-4 text-white"
          >
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign size={20} />
              <span className="font-semibold">Total Spent</span>
            </div>
            <p className="text-2xl font-bold">${totalSpent.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
          >
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp size={20} className="text-primary-amber" />
              <span className="font-semibold text-gray-700">Avg/Day</span>
            </div>
            <p className="text-2xl font-bold text-text-dark">${(totalSpent / 30).toFixed(0)}</p>
          </motion.div>
        </div>

        {/* Category Breakdown */}
        <motion.div
          key={`pie-${animationKey}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-6"
        >
          <h2 className="text-lg font-bold text-text-dark mb-4">Spending by Category</h2>
          
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-2">
            {categoryData.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-gray-700">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-text-dark">${item.value}</p>
                  <p className="text-xs text-gray-500">
                    {((item.value / totalSpent) * 100).toFixed(1)}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Monthly Trend */}
        <motion.div
          key={`bar-${animationKey}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold text-text-dark mb-4">Monthly Trend</h2>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#666' }}
                />
                <YAxis hide />
                <Bar 
                  dataKey="amount" 
                  fill="#4CAF50"
                  radius={[8, 8, 0, 0]}
                  animationBegin={0}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trend Insights */}
          <div className="mt-4 p-4 bg-primary-green/10 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp size={16} className="text-primary-green" />
              <span className="font-semibold text-primary-green">Insight</span>
            </div>
            <p className="text-sm text-gray-700">
              Your spending increased by 15% compared to last month. Consider reviewing your entertainment expenses.
            </p>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
}