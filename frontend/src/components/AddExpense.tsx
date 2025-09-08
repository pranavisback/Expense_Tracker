import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Users, Coffee, Car, Home, ShoppingBag, Gamepad2, Heart } from 'lucide-react';

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
  { id: 'equal', label: 'Split Equally', description: 'Everyone pays the same amount' },
  { id: 'exact', label: 'Exact Amounts', description: 'Enter specific amounts for each person' },
  { id: 'percentage', label: 'Percentages', description: 'Split by percentage' }
];

const mockUsers = [
  { id: 1, name: 'You', avatar: 'https://ui-avatars.com/api/?name=You&background=4CAF50&color=fff' },
  { id: 2, name: 'Alice', avatar: 'https://ui-avatars.com/api/?name=Alice&background=2196F3&color=fff' },
  { id: 3, name: 'Bob', avatar: 'https://ui-avatars.com/api/?name=Bob&background=FFC107&color=fff' },
  { id: 4, name: 'Charlie', avatar: 'https://ui-avatars.com/api/?name=Charlie&background=FF5722&color=fff' }
];

export default function AddExpense({ onClose }: AddExpenseProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    paidBy: 1,
    splitMethod: 'equal',
    participants: [1, 2]
  });

  const handleSubmit = () => {
    // Here you would normally save the expense
    onClose();
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
                  Next: Split Details
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Split Details */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Paid By */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Paid by</label>
                  <div className="grid grid-cols-2 gap-3">
                    {mockUsers.map((user) => (
                      <motion.button
                        key={user.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setFormData({ ...formData, paidBy: user.id })}
                        className={`flex items-center space-x-3 p-3 rounded-2xl border-2 transition-all ${
                          formData.paidBy === user.id
                            ? 'border-primary-green bg-primary-green/10'
                            : 'border-gray-200'
                        }`}
                      >
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                        <span className="font-medium">{user.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Split Method */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Split method</label>
                  <div className="space-y-3">
                    {splitMethods.map((method) => (
                      <motion.button
                        key={method.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, splitMethod: method.id })}
                        className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                          formData.splitMethod === method.id
                            ? 'border-primary-green bg-primary-green/10'
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">{method.label}</div>
                        <div className="text-sm text-gray-600">{method.description}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Participants */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Split between</label>
                  <div className="grid grid-cols-2 gap-3">
                    {mockUsers.map((user) => (
                      <motion.button
                        key={user.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const newParticipants = formData.participants.includes(user.id)
                            ? formData.participants.filter(id => id !== user.id)
                            : [...formData.participants, user.id];
                          setFormData({ ...formData, participants: newParticipants });
                        }}
                        className={`flex items-center space-x-3 p-3 rounded-2xl border-2 transition-all ${
                          formData.participants.includes(user.id)
                            ? 'border-primary-green bg-primary-green/10'
                            : 'border-gray-200'
                        }`}
                      >
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                        <span className="font-medium">{user.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="flex-1 bg-primary-green text-white py-4 rounded-2xl font-semibold"
                  >
                    Add Expense
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