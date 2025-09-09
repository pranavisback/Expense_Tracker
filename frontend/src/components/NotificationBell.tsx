import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, X, Users } from 'lucide-react';
import { api } from '../utils/api';

export default function NotificationBell() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await api.getNotifications();
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data.notifications);
        setUnreadCount(data.data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleInviteResponse = async (notificationId: string, action: 'accept' | 'reject') => {
    setLoading(true);
    try {
      const response = await api.respondToGroupInvite(notificationId, action);
      const data = await response.json();
      
      if (data.success) {
        fetchNotifications(); // Refresh notifications
        if (action === 'accept') {
          window.location.reload(); // Refresh to show new group
        }
      }
    } catch (error) {
      console.error('Error responding to invite:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await api.markNotificationRead(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell size={24} className="text-gray-600" />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
          >
            <span className="text-xs text-white font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </motion.div>
        )}
      </motion.button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>

            <div className="divide-y divide-gray-100">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-primary-green rounded-full flex items-center justify-center flex-shrink-0">
                        <Users size={20} className="text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">
                          {notification.title}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-gray-400 text-xs mt-2">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </p>

                        {/* Group Invite Actions */}
                        {notification.type === 'group_invite' && notification.status === 'pending' && (
                          <div className="flex space-x-2 mt-3">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleInviteResponse(notification._id, 'accept')}
                              disabled={loading}
                              className="flex items-center space-x-1 px-3 py-1 bg-primary-green text-white rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                              <Check size={14} />
                              <span>Accept</span>
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleInviteResponse(notification._id, 'reject')}
                              disabled={loading}
                              className="flex items-center space-x-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium disabled:opacity-50"
                            >
                              <X size={14} />
                              <span>Decline</span>
                            </motion.button>
                          </div>
                        )}

                        {notification.status === 'accepted' && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Accepted
                            </span>
                          </div>
                        )}

                        {notification.status === 'rejected' && (
                          <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Declined
                            </span>
                          </div>
                        )}
                      </div>

                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          className="text-blue-500 hover:text-blue-700 text-xs"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Bell size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}