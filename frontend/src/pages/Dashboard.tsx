import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Plane, Building, TrendingUp, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

interface DashboardProps {
  onAddExpense: () => void;
}

const mockGroups = [
  { id: 1, name: 'Roommates', icon: Users, color: 'bg-primary-green', members: 4, balance: -125.50 },
  { id: 2, name: 'Trip to Bali', icon: Plane, color: 'bg-primary-blue', members: 6, balance: 89.25 },
  { id: 3, name: 'Office Lunch', icon: Building, color: 'bg-primary-amber', members: 8, balance: 0 }
];

const mockExpenses = [
  { id: 1, description: 'Grocery Shopping', amount: 156.78, date: '2024-01-15', category: 'Food' },
  { id: 2, description: 'Electricity Bill', amount: 89.50, date: '2024-01-14', category: 'Utilities' },
  { id: 3, description: 'Restaurant Dinner', amount: 245.30, date: '2024-01-13', category: 'Food' }
];

export default function Dashboard({ onAddExpense }: DashboardProps) {
  const navigate = useNavigate();
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [animatedTotal, setAnimatedTotal] = useState(0);

  useEffect(() => {
    const total = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    setMonthlyTotal(total);
    
    // Animate counter
    let start = 0;
    const increment = total / 50;
    const timer = setInterval(() => {
      start += increment;
      if (start >= total) {
        setAnimatedTotal(total);
        clearInterval(timer);
      } else {
        setAnimatedTotal(start);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background-light pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm p-6 rounded-b-3xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-dark">Good morning!</h1>
            <p className="text-gray-600">Ready to split some bills?</p>
          </div>
          <div className="w-12 h-12 bg-primary-green rounded-full animate-pulse-avatar"></div>
        </div>

        {/* Monthly Overview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-primary-green to-primary-blue rounded-2xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-1">This Month's Expenses</p>
              <p className="text-3xl font-bold animate-count-up">
                ${animatedTotal.toFixed(2)}
              </p>
            </div>
            <TrendingUp size={32} className="text-white/80" />
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="bg-white/20 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '68%' }}
                transition={{ delay: 0.5, duration: 1 }}
                className="bg-white rounded-full h-2"
              />
            </div>
            <p className="text-white/80 text-sm mt-2">68% of monthly budget</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Groups Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-dark">Your Groups</h2>
          <button className="text-primary-green font-semibold">See All</button>
        </div>

        <div className="space-y-4">
          {mockGroups.map((group, index) => (
            <motion.div
              key={group.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/group/${group.id}`)}
              className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 ${group.color} rounded-2xl flex items-center justify-center`}>
                  {(() => {
                    const IconComponent = group.icon;
                    return <IconComponent size={24} className="text-white" />;
                  })()}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text-dark">{group.name}</h3>
                  <p className="text-gray-500 text-sm">{group.members} members</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${group.balance > 0 ? 'text-primary-green' : group.balance < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                    {group.balance === 0 ? 'Settled' : `$${Math.abs(group.balance).toFixed(2)}`}
                  </p>
                  <p className="text-xs text-gray-500">
                    {group.balance > 0 ? 'You are owed' : group.balance < 0 ? 'You owe' : 'All settled'}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="px-6">
        <h2 className="text-xl font-bold text-text-dark mb-4">Recent Expenses</h2>
        <div className="space-y-3">
          {mockExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <DollarSign size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text-dark">{expense.description}</h4>
                    <p className="text-gray-500 text-sm">{expense.category} • {expense.date}</p>
                  </div>
                </div>
                <p className="font-bold text-text-dark">${expense.amount.toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onAddExpense}
        className="fixed bottom-24 right-6 w-16 h-16 bg-primary-green rounded-full shadow-lg flex items-center justify-center animate-bounce-slow"
      >
        <Plus size={28} className="text-white" />
      </motion.button>

      <BottomNav />
    </div>
  );
}