import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Moon, 
  Sun, 
  Settings, 
  CreditCard, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight 
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

const menuItems = [
  { icon: User, label: 'Edit Profile', color: 'text-primary-blue' },
  { icon: Bell, label: 'Notifications', color: 'text-primary-amber', hasToggle: true },
  { icon: CreditCard, label: 'Payment Methods', color: 'text-primary-green' },
  { icon: Shield, label: 'Privacy & Security', color: 'text-purple-500' },
  { icon: HelpCircle, label: 'Help & Support', color: 'text-orange-500' },
  { icon: Settings, label: 'App Settings', color: 'text-gray-600' }
];

export default function Profile() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [user, setUser] = useState({ name: '', email: '', avatar: '' });

  useEffect(() => {
    const userData = localStorage.getItem('splitease_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('splitease_token');
    localStorage.removeItem('splitease_user');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-gray-900 pb-20 transition-colors">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-sm p-6 rounded-b-3xl transition-colors"
      >
        <h1 className="text-2xl font-bold text-text-dark dark:text-white mb-6">Profile</h1>
        
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-4"
        >
          <motion.img
            src={user.avatar || 'https://ui-avatars.com/api/?name=User&background=4CAF50&color=fff'}
            alt={user.name}
            className="w-20 h-20 rounded-full animate-pulse-avatar"
          />
          <div>
            <h2 className="text-xl font-bold text-text-dark dark:text-white">
              {user.name || 'John Doe'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {user.email || 'john@example.com'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-2 text-primary-green font-semibold text-sm"
            >
              Edit Profile
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm transition-colors"
          >
            <p className="text-2xl font-bold text-primary-green">12</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Active Groups</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm transition-colors"
          >
            <p className="text-2xl font-bold text-primary-blue">$1,245</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Spent</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 text-center shadow-sm transition-colors"
          >
            <p className="text-2xl font-bold text-primary-amber">89</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Transactions</p>
          </motion.div>
        </div>

        {/* Dark Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm mb-4 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
              }`}>
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div>
                <h3 className="font-semibold text-text-dark dark:text-white">Dark Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {darkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                </p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                darkMode ? 'bg-primary-green' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: darkMode ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center`}>
                    {(() => {
                      const IconComponent = item.icon;
                      return <IconComponent size={20} className={item.color} />;
                    })()}
                  </div>
                  <span className="font-semibold text-text-dark dark:text-white">
                    {item.label}
                  </span>
                </div>
                
                {item.hasToggle ? (
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setNotifications(!notifications)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors ${
                      notifications ? 'bg-primary-green' : 'bg-gray-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: notifications ? 24 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </motion.button>
                ) : (
                  <ChevronRight size={20} className="text-gray-400" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl p-4 mt-6 font-semibold flex items-center justify-center space-x-2 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </motion.button>
      </div>

      <BottomNav />
    </div>
  );
}