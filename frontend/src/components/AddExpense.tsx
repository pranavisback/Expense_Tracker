import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Users, Coffee, Car, Home, ShoppingBag, Gamepad2, Heart } from 'lucide-react';
import { api } from '../utils/api';

interface AddExpenseProps {
  onClose: () => void;
}

const categories = [
  { icon: Coffee, label: 'Food', color: 'bg-orange-500' },
  { icon: Car, label: 'Transport', color: 'bg-blue-500' },
  { icon: Home, label: 'Housing', color: 'bg-green-500' },
  { icon: ShoppingBag, label: 'Shopping', color: 'bg-purple-500' },
  { icon: Gamepad2, label: 'Entertainment', color: 'bg-pink-500' },
  { icon: Heart, label: 'Healthcare', color: 'bg-red-500' }
];

const splitMethods = [
  { id: 'equal', label: 'Split Equally', description: 'Everyone pays the same amount' }
];

export default function AddExpense({ onClose }: AddExpenseProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    group: '',
    splitBetween: [],
    splitMethod: 'equal'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const userData = localStorage.getItem('splitease_user');
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        }

        // Fetch user groups
        const groupsResponse = await api.getGroups();
        const groupsData = await groupsResponse.json();
        
        if (groupsData.success) {
          setGroups(groupsData.data.groups);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleGroupSelect = async (groupId) => {
    try {
      const response = await api.getGroupDetails(groupId);
      const data = await response.json();
      
      if (data.success) {
        setSelectedGroup(data.data.group);
        setFormData(prev => ({ 
          ...prev, 
          group: groupId,
          splitBetween: [currentUser?._id] // Start with current user
        }));
      }
    } catch (error) {
      console.error('Error fetching group details:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const expenseData = {
        title: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description,
        group: formData.group || null,
        splitBetween: formData.splitBetween,
        splitMethod: formData.splitMethod
      };

      const response = await api.createExpense(expenseData);
      const data = await response.json();

      if (data.success) {
        onClose();
        window.location.reload();
      } else {
        setError(data.error || 'Failed to create expense');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-text-dark">Add Expense</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-4 text-gray-400" size={20} />
                    <input
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green text-2xl font-bold"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    placeholder="What was this expense for?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                  <div className="grid grid-cols-3 gap-3">
                    {categories.map((category) => (
                      <motion.button
                        key={category.label}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData({ ...formData, category: category.label })}
                        className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                          formData.category === category.label
                            ? 'border-primary-green bg-primary-green/10'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-10 h-10 ${category.color} rounded-xl flex items-center justify-center mb-2`}>
                          {(() => {
                            const IconComponent = category.icon;
                            return <IconComponent size={20} className="text-white" />;
                          })()}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{category.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)}
                  disabled={!formData.amount || !formData.description || !formData.category}
                  className="w-full bg-primary-green text-white py-4 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Choose Group
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Choose Group */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Group</h3>
                  <p className="text-gray-600 text-sm mb-4">Select a group to split this expense, or add as personal expense</p>
                </div>

                {/* Personal Expense Option */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, group: '', splitBetween: [currentUser?._id] }));
                    setSelectedGroup(null);
                    setStep(3);
                  }}
                  className="w-full flex items-center p-4 rounded-2xl border-2 border-gray-200 hover:border-primary-green transition-all"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
                    <Users size={24} className="text-gray-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">Personal Expense</h4>
                    <p className="text-sm text-gray-600">Just for you, no splitting</p>
                  </div>
                </motion.button>

                {/* Group Options */}
                <div className="space-y-3">
                  {groups.map((group) => (
                    <motion.button
                      key={group._id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleGroupSelect(group._id);
                        setStep(3);
                      }}
                      className="w-full flex items-center p-4 rounded-2xl border-2 border-gray-200 hover:border-primary-green transition-all"
                    >
                      <div className="w-12 h-12 bg-primary-green rounded-xl flex items-center justify-center mr-4">
                        <Users size={24} className="text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <h4 className="font-semibold text-gray-900">{group.name}</h4>
                        <p className="text-sm text-gray-600">{group.memberCount} members</p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(1)}
                  className="w-full bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold"
                >
                  Back
                </motion.button>
              </motion.div>
            )}

            {/* Step 3: Split Details */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {selectedGroup ? (
                  <>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Split in {selectedGroup.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">Choose who to split this expense with</p>
                    </div>

                    {/* Group Members */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Split between</label>
                      <div className="space-y-3">
                        {selectedGroup.members?.map((member) => (
                          <motion.button
                            key={member.user._id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              const userId = member.user._id;
                              const newSplitBetween = formData.splitBetween.includes(userId)
                                ? formData.splitBetween.filter(id => id !== userId)
                                : [...formData.splitBetween, userId];
                              setFormData({ ...formData, splitBetween: newSplitBetween });
                            }}
                            className={`w-full flex items-center space-x-3 p-3 rounded-2xl border-2 transition-all ${
                              formData.splitBetween.includes(member.user._id)
                                ? 'border-primary-green bg-primary-green/10'
                                : 'border-gray-200'
                            }`}
                          >
                            <img 
                              src={member.user.avatar} 
                              alt={member.user.name} 
                              className="w-10 h-10 rounded-full" 
                            />
                            <div className="text-left flex-1">
                              <span className="font-medium">{member.user.name}</span>
                              <p className="text-sm text-gray-500">{member.user.email}</p>
                            </div>
                            {formData.splitBetween.includes(member.user._id) && (
                              <div className="text-primary-green font-semibold">
                                ${(parseFloat(formData.amount) / formData.splitBetween.length || 0).toFixed(2)}
                              </div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Expense</h3>
                    <p className="text-gray-600 text-sm mb-4">This expense will be added to your personal records</p>
                    <div className="p-4 bg-gray-50 rounded-2xl">
                      <p className="font-medium">Amount: ${formData.amount}</p>
                      <p className="text-sm text-gray-600">Only you will see this expense</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl">
                    {error}
                  </div>
                )}

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    disabled={loading}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold disabled:opacity-50"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    onClick={handleSubmit}
                    disabled={loading || (selectedGroup && formData.splitBetween.length === 0)}
                    className="flex-1 bg-primary-green text-white py-4 rounded-2xl font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Expense'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}