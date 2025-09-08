import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Onboarding from './pages/Onboarding';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import GroupDetails from './pages/GroupDetails';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import AddExpense from './components/AddExpense';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('splitease_auth');
    const onboarding = localStorage.getItem('splitease_onboarding');
    setIsAuthenticated(!!auth);
    setHasSeenOnboarding(!!onboarding);
  }, []);

  if (!hasSeenOnboarding) {
    return <Onboarding onComplete={() => setHasSeenOnboarding(true)} />;
  }

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <AnimatePresence>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard onAddExpense={() => setShowAddExpense(true)} />} />
            <Route path="/group/:id" element={<GroupDetails />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </AnimatePresence>
        
        <AnimatePresence>
          {showAddExpense && (
            <AddExpense onClose={() => setShowAddExpense(false)} />
          )}
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;