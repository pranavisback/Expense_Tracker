import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, Plane, Building, TrendingUp, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import CreateGroup from '../components/CreateGroup';
import { api } from '../utils/api';

interface DashboardProps {
  onAddExpense: () => void;
}

const groupTypeIcons = {
  roommates: Users,
  trip: Plane,
  office: Building,
  family: Users,
  friends: Users,
  other: Users
};

const groupTypeColors = {
  roommates: 'bg-primary-green',
  trip: 'bg-primary-blue',
  office: 'bg-primary-amber',
  family: 'bg-purple-500',
  friends: 'bg-pink-500',
  other: 'bg-gray-500'
};

export default function Dashboard({ onAddExpense }: DashboardProps) {
  const navigate = useNavigate();
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch expenses
        const expensesResponse = await api.getExpenses();
        const expensesData = await expensesResponse.json();
        
        if (expensesData.success) {
          setExpenses(expensesData.data.expenses.slice(0, 3)); // Show only recent 3
        }

        // Fetch analytics
        const analyticsResponse = await api.getAnalytics();
        const analyticsData = await analyticsResponse.json();
        
        if (analyticsData.success) {
          setAnalytics(analyticsData.data);
          const total = analyticsData.data.currentMonthTotal || 0;
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
        }

        // Fetch groups
        const groupsResponse = await api.getGroups();
        const groupsData = await groupsResponse.json();
        
        if (groupsData.success) {
          setGroups(groupsData.data.groups);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshData = () => {
    setLoading(true);
    fetchData();
  };

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
          <button 
            onClick={() => setShowCreateGroup(true)}
            className="text-primary-green font-semibold hover:text-primary-green/80"
          >
            Create Group
          </button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : groups.length > 0 ? (
          <div className="space-y-4">
            {groups.map((group, index) => {
              const IconComponent = groupTypeIcons[group.type] || Users;
              const colorClass = groupTypeColors[group.type] || 'bg-gray-500';
              
              return (
                <motion.div
                  key={group._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/group/${group._id}`)}
                  className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 ${colorClass} rounded-2xl flex items-center justify-center`}>
                      <IconComponent size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-dark">{group.name}</h3>
                      <p className="text-gray-500 text-sm">{group.memberCount} members</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        group.userBalance > 0 ? 'text-primary-green' : 
                        group.userBalance < 0 ? 'text-red-500' : 'text-gray-500'
                      }`}>
                        {group.userBalance === 0 ? 'Settled' : `$${Math.abs(group.userBalance).toFixed(2)}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {group.userBalance > 0 ? 'You are owed' : 
                         group.userBalance < 0 ? 'You owe' : 'All settled'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <Users size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No groups yet</p>
            <p className="text-gray-400 text-sm">Create or join a group to start splitting expenses</p>
          </div>
        )}
      </div>

      {/* Recent Expenses */}
      <div className="px-6">
        <h2 className="text-xl font-bold text-text-dark mb-4">Recent Expenses</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : expenses.length > 0 ? (
          <div className="space-y-3">
            {expenses.map((expense, index) => (
              <motion.div
                key={expense._id}
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
                      <h4 className="font-semibold text-text-dark">{expense.title}</h4>
                      <p className="text-gray-500 text-sm">
                        {expense.category} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-text-dark">${expense.amount.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <DollarSign size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No expenses yet</p>
            <p className="text-gray-400 text-sm">Add your first expense to get started</p>
          </div>
        )}
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
      
      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroup 
          onClose={() => setShowCreateGroup(false)}
          onSuccess={refreshData}
        />
      )}
    </div>
  );
}