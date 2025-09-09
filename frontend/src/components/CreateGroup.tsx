import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Plane, Building, Heart, Coffee, UserPlus } from 'lucide-react';
import { api } from '../utils/api';

interface CreateGroupProps {
  onClose: () => void;
  onSuccess: () => void;
}

const groupTypes = [
  { id: 'roommates', label: 'Roommates', icon: Users, color: 'bg-primary-green', description: 'Share rent, utilities, groceries' },
  { id: 'trip', label: 'Trip', icon: Plane, color: 'bg-primary-blue', description: 'Travel expenses, hotels, activities' },
  { id: 'office', label: 'Office', icon: Building, color: 'bg-primary-amber', description: 'Team lunches, office supplies' },
  { id: 'family', label: 'Family', icon: Heart, color: 'bg-purple-500', description: 'Family expenses, events' },
  { id: 'friends', label: 'Friends', icon: Coffee, color: 'bg-pink-500', description: 'Dinners, entertainment, outings' },
  { id: 'other', label: 'Other', icon: UserPlus, color: 'bg-gray-500', description: 'Custom group type' }
];

export default function CreateGroup({ onClose, onSuccess }: CreateGroupProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: ''
  });

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.createGroup(formData);
      const data = await response.json();

      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.error || 'Failed to create group');
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
            <h2 className="text-xl font-bold text-text-dark">Create Group</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Step 1: Group Type */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What type of group is this?</h3>
                  <p className="text-gray-600 text-sm mb-4">Choose the category that best describes your group</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {groupTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, type: type.id })}
                      className={`flex items-center p-4 rounded-2xl border-2 transition-all text-left ${
                        formData.type === type.id
                          ? 'border-primary-green bg-primary-green/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center mr-4`}>
                        {(() => {
                          const IconComponent = type.icon;
                          return <IconComponent size={24} className="text-white" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{type.label}</h4>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)}
                  disabled={!formData.type}
                  className="w-full bg-primary-green text-white py-4 rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Group Details
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Group Details */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Group Details</h3>
                  <p className="text-gray-600 text-sm mb-4">Give your group a name and description</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Group Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Apartment 4B, Bali Trip 2024"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                  <textarea
                    placeholder="What expenses will you track in this group?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green resize-none"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl">
                    {error}
                  </div>
                )}

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-semibold disabled:opacity-50"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.02 }}
                    whileTap={{ scale: loading ? 1 : 0.98 }}
                    onClick={handleSubmit}
                    disabled={loading || !formData.name}
                    className="flex-1 bg-primary-green text-white py-4 rounded-2xl font-semibold disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Group'}
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