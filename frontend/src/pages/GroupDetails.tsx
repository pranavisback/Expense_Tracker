import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Plus, Copy, UserPlus, Mail } from 'lucide-react';
import { api } from '../utils/api';

export default function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({});
  const [showAddMember, setShowAddMember] = useState(false);
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [email, setEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroupDetails();
  }, [id]);

  const fetchGroupDetails = async () => {
    try {
      const response = await api.getGroupDetails(id);
      const data = await response.json();
      
      if (data.success) {
        setGroup(data.data.group);
        setExpenses(data.data.expenses || []);
        setBalances(data.data.balances || {});
      }
    } catch (error) {
      console.error('Error fetching group details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setAddingMember(true);
    setError('');

    try {
      const response = await api.addMember(id, email);
      const data = await response.json();

      if (data.success) {
        setEmail('');
        setShowAddMember(false);
        setError('');
        alert('Invitation sent successfully!');
      } else {
        setError(data.error || 'Failed to send invitation');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setAddingMember(false);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group?.inviteCode);
    alert('Invite code copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading group details...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Group not found</p>
          <button onClick={() => navigate('/dashboard')} className="mt-4 text-primary-green">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentUser = JSON.parse(localStorage.getItem('splitease_user') || '{}');
  const userBalance = balances[currentUser._id] || { owes: 0, owed: 0 };
  const netBalance = userBalance.owed - userBalance.owes;

  return (
    <div className="min-h-screen bg-background-light">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm p-6"
      >
        <div className="flex items-center space-x-4 mb-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-text-dark">{group.name}</h1>
            <p className="text-gray-600 text-sm flex items-center">
              <Users size={16} className="mr-1" />
              {group.members?.length || 0} members
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowInviteCode(true)}
              className="p-2 bg-primary-blue/10 text-primary-blue rounded-full"
            >
              <Copy size={20} />
            </button>
            <button
              onClick={() => setShowAddMember(true)}
              className="p-2 bg-primary-green/10 text-primary-green rounded-full"
            >
              <UserPlus size={20} />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-2xl p-4">
            <p className="text-green-600 font-semibold text-sm">Total Spent</p>
            <p className="text-2xl font-bold text-green-700">
              ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
            </p>
          </div>
          <div className={`rounded-2xl p-4 ${netBalance >= 0 ? 'bg-blue-50' : 'bg-red-50'}`}>
            <p className={`font-semibold text-sm ${netBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              Your Share
            </p>
            <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
              {netBalance >= 0 ? '+' : ''}${netBalance.toFixed(2)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Members */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-dark">Members</h2>
        </div>

        <div className="space-y-3 mb-6">
          {group.members?.map((member) => {
            const memberBalance = balances[member.user._id] || { owes: 0, owed: 0 };
            const memberNet = memberBalance.owed - memberBalance.owes;
            
            return (
              <div key={member.user._id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={member.user.avatar}
                      alt={member.user.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold text-text-dark">{member.user.name}</h3>
                      <p className="text-gray-500 text-sm">{member.user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      memberNet > 0 ? 'text-green-600' : 
                      memberNet < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {memberNet === 0 ? 'Settled' : 
                       memberNet > 0 ? `+$${memberNet.toFixed(2)}` : 
                       `$${Math.abs(memberNet).toFixed(2)}`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {memberNet > 0 ? 'Gets back' : 
                       memberNet < 0 ? 'Owes' : 'All settled'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Expenses */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-text-dark mb-4">Recent Expenses</h2>
          {expenses.length > 0 ? (
            <div className="space-y-3">
              {expenses.slice(0, 5).map((expense) => (
                <div key={expense._id} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-text-dark">{expense.title}</h3>
                      <p className="text-gray-500 text-sm">
                        Paid by {expense.paidBy?.name} • {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-bold text-text-dark">${expense.amount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <p className="text-gray-500">No expenses yet</p>
              <p className="text-gray-400 text-sm">Add your first expense to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Add Member</h3>
              <button
                onClick={() => setShowAddMember(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
                  <input
                    type="email"
                    placeholder="friend@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-2xl text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={addingMember}
                className="w-full bg-primary-green text-white py-4 rounded-2xl font-semibold disabled:opacity-50"
              >
                {addingMember ? 'Sending Invite...' : 'Send Invitation'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Invite Code Modal */}
      {showInviteCode && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 text-center">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Invite Code</h3>
              <button
                onClick={() => setShowInviteCode(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-4">
                Share this code with friends to join the group
              </p>
              <div className="bg-gray-50 rounded-2xl p-6 mb-4">
                <p className="text-3xl font-bold text-primary-green tracking-widest">
                  {group.inviteCode}
                </p>
              </div>
              <button
                onClick={copyInviteCode}
                className="w-full bg-primary-green text-white py-3 rounded-2xl font-semibold flex items-center justify-center space-x-2"
              >
                <Copy size={20} />
                <span>Copy Code</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}