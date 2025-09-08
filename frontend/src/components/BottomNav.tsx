import { motion } from 'framer-motion';
import { Home, BarChart3, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: User, label: 'Profile', path: '/profile' }
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4"
    >
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all ${
                isActive ? 'bg-primary-green/10' : ''
              }`}
            >
              {(() => {
                const IconComponent = item.icon;
                return <IconComponent 
                  size={24} 
                  className={isActive ? 'text-primary-green' : 'text-gray-400'} 
                />;
              })()}
              <span className={`text-xs font-medium ${
                isActive ? 'text-primary-green' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}