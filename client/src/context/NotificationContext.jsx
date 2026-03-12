import { createContext, useState, useEffect, useCallback, useMemo, useContext } from 'react';
import * as notificationService from '../services/notification.service';
import { AuthContext } from './AuthContext';
import { SocketContext } from './SocketContext';
import toast from 'react-hot-toast';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  const { socket, connected } = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch notifications on mount and when authenticated
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const res = await notificationService.getNotifications({ limit: 50 });
      // API returns { data: { data: [...], pagination } }
      const raw = res.data?.data || res.data?.notifications || res.data || [];
      const items = Array.isArray(raw) ? raw : [];
      setNotifications(items);

      const count = res.data?.unreadCount ?? items.filter((n) => !n.isRead && !n.read).length;
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listen for real-time notifications via socket
  useEffect(() => {
    if (!socket || !connected) return;

    function handleNewNotification(notification) {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Show toast for new notifications
      const toastType = notification.type === 'error' ? 'error' : 'success';
      if (toastType === 'error') {
        toast.error(notification.title || notification.message, {
          duration: 5000,
        });
      } else {
        toast(notification.title || notification.message, {
          icon: notification.type === 'warning' ? '!' : 'i',
          duration: 4000,
          style: {
            borderRadius: '10px',
          },
        });
      }
    }

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket, connected]);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, []);

  const refresh = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Clear notifications on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      markAsRead,
      markAllRead,
      refresh,
    }),
    [notifications, unreadCount, loading, markAsRead, markAllRead, refresh]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}
