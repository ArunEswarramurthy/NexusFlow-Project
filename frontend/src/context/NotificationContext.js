import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import io from 'socket.io-client';

const NotificationContext = createContext();

const initialState = {
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  socket: null,
};

const NOTIFICATION_ACTIONS = {
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  SET_SOCKET: 'SET_SOCKET',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
  UPDATE_UNREAD_COUNT: 'UPDATE_UNREAD_COUNT',
};

const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.is_read).length,
      };
    
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      const newNotification = action.payload;
      return {
        ...state,
        notifications: [newNotification, ...state.notifications],
        unreadCount: newNotification.is_read ? state.unreadCount : state.unreadCount + 1,
      };
    
    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    
    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, is_read: true })),
        unreadCount: 0,
      };
    
    case NOTIFICATION_ACTIONS.DELETE_NOTIFICATION:
      const deletedNotification = state.notifications.find(n => n.id === action.payload);
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload),
        unreadCount: deletedNotification && !deletedNotification.is_read 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount,
      };
    
    case NOTIFICATION_ACTIONS.SET_SOCKET:
      return {
        ...state,
        socket: action.payload,
      };
    
    case NOTIFICATION_ACTIONS.SET_CONNECTION_STATUS:
      return {
        ...state,
        isConnected: action.payload,
      };
    
    case NOTIFICATION_ACTIONS.UPDATE_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload,
      };
    
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000', {
        auth: { token },
        transports: ['websocket'],
      });

      dispatch({ type: NOTIFICATION_ACTIONS.SET_SOCKET, payload: socket });

      socket.on('connect', () => {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_CONNECTION_STATUS, payload: true });
        console.log('Socket connected');
      });

      socket.on('disconnect', () => {
        dispatch({ type: NOTIFICATION_ACTIONS.SET_CONNECTION_STATUS, payload: false });
        console.log('Socket disconnected');
      });

      socket.on('notification', (notification) => {
        dispatch({ type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, payload: notification });
        
        // Show toast notification
        const toastMessage = notification.title || notification.message;
        switch (notification.type) {
          case 'task_assigned':
          case 'task_approved':
            toast.success(toastMessage);
            break;
          case 'task_rejected':
          case 'task_overdue':
            toast.error(toastMessage);
            break;
          case 'task_due_soon':
            toast(toastMessage, { icon: '⏰' });
            break;
          default:
            toast(toastMessage);
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      // This would be an API call to get notifications
      // const response = await notificationService.getNotifications();
      // dispatch({ type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS, payload: response.notifications });
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      // API call to mark as read
      // await notificationService.markAsRead(notificationId);
      dispatch({ type: NOTIFICATION_ACTIONS.MARK_AS_READ, payload: notificationId });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      // API call to mark all as read
      // await notificationService.markAllAsRead();
      dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      // API call to delete notification
      // await notificationService.deleteNotification(notificationId);
      dispatch({ type: NOTIFICATION_ACTIONS.DELETE_NOTIFICATION, payload: notificationId });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Send notification (for admin use)
  const sendNotification = async (notificationData) => {
    try {
      // API call to send notification
      // await notificationService.sendNotification(notificationData);
      toast.success('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    }
  };

  const value = {
    // State
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    isConnected: state.isConnected,
    socket: state.socket,
    
    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;