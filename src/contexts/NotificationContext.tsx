import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface Notification {
  rejectionReason: string;
  rejectedAt: string;
  viewed?: boolean;
  viewedAt?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  markAsViewed: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('modelToken');
      if (!token) return;

      const response = await axios.get('http://localhost:3000/api/applications/my-rejection-reason', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success && response.data.data) {
        // Check if notification was viewed in the last 12 hours
        const lastViewedStr = localStorage.getItem('lastNotificationViewed');
        if (lastViewedStr) {
          const lastViewed = new Date(lastViewedStr);
          const now = new Date();
          const hoursDiff = (now.getTime() - lastViewed.getTime()) / (1000 * 60 * 60);
          
          if (hoursDiff < 12) {
            setNotifications([]);
            return;
          }
        }
        
        setNotifications([response.data.data]);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsViewed = (notification: Notification) => {
    localStorage.setItem('lastNotificationViewed', new Date().toISOString());
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, loading, error, markAsViewed }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}