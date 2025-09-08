import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, DollarSign, Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import confetti from 'canvas-confetti';

const mockTransactions = [
  {
    id: 1,
    description: 'Grocery Shopping',
    amount: 156.78,
    paidBy: { name: 'Alice', avatar: 'https://ui-avatars.com/api/?name=Alice&background=2196F3&color=fff' },
    date: '2024-01-15',
    participants: ['You', 'Alice', 'Bob']
  },
  {
    id: 2,
    description: 'Restaurant Dinner',
    amount: 245.30,
    paidBy: { name: 'You', avatar: 'https://ui-avatars.com/api/?name=You&background=4CAF50&color=fff' },
    date: '2024-01-14',
    participants: ['You', 'Alice', 'Bob', 'Charlie']
  },
  {
    id: 3,
    description: 'Movie Tickets',
    amount: 48.00,
    paidBy: { name: 'Bob', avatar: 'https://ui-avatars.com/api/?name=Bob&background=FFC107&color=fff' },
    date: '2024-01-13',
    participants: ['You', 'Bob']
  }
];

const mockBalances = [
  { name: 'Alice', avatar: 'https://ui-avatars.com/api/?name=Alice&background=2196F3&color=fff', owes: 45.50, owedBy: 0 },
  { name: 'Bob', avatar: 'https://ui-avatars.com/api/?name=Bob&background=FFC107&color=fff', owes: 0, owedBy: 32.25 },
  { name: 'Charlie', avatar: 'https://ui-avatars.com/api/?name=Charlie&background=FF5722&color=fff', owes: 61.25, owedBy: 0 }
];

export default function GroupDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [animatedBalances, setAnimatedBalances] = useState(mockBalances.map(() => ({ owes: 0, owedBy: 0 })));
  const [allSettled, setAllSettled] = useState(false);

  useEffect(() => {
    // Animate balance counting
    mockBalances.forEach((balance, index) => {
      let owesStart = 0;
      let owedByStart = 0;
      const owesIncrement = balance.owes / 30;
      const owedByIncrement = balance.owedBy / 30;
      
      const timer = setInterval(() => {
        owesStart += owesIncrement;
        owedByStart += owedByIncrement;
        
        if (owesStart >= balance.owes && owedByStart >= balance.owedBy) {
          setAnimatedBalances(prev => {
            const newBalances = [...prev];
            newBalances[index] = { owes: balance.owes, owedBy: balance.owedBy };
            return newBalances;
          });
          clearInterval(timer);
        } else {
          setAnimatedBalances(prev => {
            const newBalances = [...prev];
            newBalances[index] = { 
              owes: Math.min(owesStart, balance.owes), 
              owedBy: Math.min(owedByStart, balance.owedBy) 
            };
            return newBalances;
          });
        }
      }, 50);
    });
  }, []);

  const handleSettleUp = () => {
    setAllSettled(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

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
          <div>
            <h1 className="text-xl font-bold text-text-dark">Roommates</h1>
            <p className="text-gray-600 flex items-center">
              <Users size={16} className="mr-1" />
              4 members
            </p>
          </div>
        </div>

        {/* Group Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary-green/10 rounded-2xl p-4">
            <p className="text-primary-green font-semibold">Total Spent</p>
            <p className="text-2xl font-bold text-text-dark">$450.08</p>
          </div>
          <div className="bg-primary-blue/10 rounded-2xl p-4">
            <p className="text-primary-blue font-semibold">Your Share</p>
            <p className="text-2xl font-bold text-text-dark">$112.52</p>
          </div>
        </div>
      </motion.div>

      {/* Balances Section */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-text-dark">Balances</h2>
          {!allSettled && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSettleUp}
              className="bg-primary-green text-white px-4 py-2 rounded-xl font-semibold text-sm"
            >
              Settle Up
            </motion.button>
          )}
        </div>

        {allSettled ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-primary-green/10 rounded-2xl p-6 text-center"
          >
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-primary-green mb-2">All Settled!</h3>
            <p className="text-gray-600">Everyone is even. Great job!</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {mockBalances.map((balance, index) => (
              <motion.div
                key={balance.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.img
                      animate={{ x: balance.owes > 0 ? [0, -5, 0] : balance.owedBy > 0 ? [0, 5, 0] : 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                      src={balance.avatar}
                      alt={balance.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-text-dark">{balance.name}</h4>
                      <p className="text-sm text-gray-500">
                        {balance.owes > 0 ? 'Owes you' : balance.owedBy > 0 ? 'You owe' : 'Settled'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg animate-count-up ${
                      balance.owes > 0 ? 'text-primary-green' : 
                      balance.owedBy > 0 ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {balance.owes > 0 ? `+$${animatedBalances[index]?.owes.toFixed(2)}` :
                       balance.owedBy > 0 ? `-$${animatedBalances[index]?.owedBy.toFixed(2)}` : '$0.00'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Timeline */}
      <div className="px-6 pb-6">
        <h2 className="text-lg font-bold text-text-dark mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {mockTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-sm relative"
            >
              {/* Timeline Line */}
              {index < mockTransactions.length - 1 && (
                <div className="absolute left-8 top-16 w-0.5 h-8 bg-gray-200"></div>
              )}
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary-green rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign size={16} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-text-dark">{transaction.description}</h4>
                    <p className="font-bold text-text-dark">${transaction.amount.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <img
                      src={transaction.paidBy.avatar}
                      alt={transaction.paidBy.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <p className="text-sm text-gray-600">
                      Paid by {transaction.paidBy.name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} className="text-gray-400" />
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                    <span className="text-gray-300">•</span>
                    <p className="text-sm text-gray-500">
                      Split between {transaction.participants.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}