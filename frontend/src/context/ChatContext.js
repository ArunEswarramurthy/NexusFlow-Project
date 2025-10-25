import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import chatService from '../services/chatService';

const ChatContext = createContext();

const initialState = {
  socket: null,
  rooms: [],
  activeRoom: null,
  messages: {},
  unreadCounts: {},
  typingUsers: {},
  isConnected: false
};

const chatReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SOCKET':
      return { ...state, socket: action.payload, isConnected: true };
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload };
    case 'ADD_ROOM':
      return { ...state, rooms: [action.payload, ...state.rooms] };
    case 'SET_ACTIVE_ROOM':
      return { ...state, activeRoom: action.payload };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: { ...state.messages, [action.roomId]: action.payload }
      };
    case 'ADD_MESSAGE':
      const roomMessages = state.messages[action.roomId] || [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.roomId]: [...roomMessages, action.payload]
        }
      };
    case 'SET_UNREAD_COUNTS':
      return { ...state, unreadCounts: action.payload };
    case 'SET_TYPING_USERS':
      return {
        ...state,
        typingUsers: { ...state.typingUsers, [action.roomId]: action.payload }
      };
    case 'DISCONNECT':
      return { ...state, socket: null, isConnected: false };
    default:
      return state;
  }
};

export const ChatProvider = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');
      
      socket.on('connect', () => {
        console.log('Socket connected');
        dispatch({ type: 'SET_SOCKET', payload: socket });
        socket.emit('join-room', user.userId || user.id);
      });

      socket.on('new-message', (data) => {
        console.log('New message received:', data);
        dispatch({ type: 'ADD_MESSAGE', roomId: data.roomId, payload: data.message });
      });

      socket.on('user-typing', (data) => {
        dispatch({ type: 'SET_TYPING_USERS', roomId: data.roomId, payload: data });
      });

      return () => {
        console.log('Disconnecting socket');
        socket.disconnect();
        dispatch({ type: 'DISCONNECT' });
      };
    }
  }, [user]);

  const loadChatRooms = async () => {
    try {
      const rooms = await chatService.getChatRooms();
      dispatch({ type: 'SET_ROOMS', payload: rooms });
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
    }
  };

  const loadMessages = async (roomId) => {
    try {
      const messages = await chatService.getChatMessages(roomId);
      dispatch({ type: 'SET_MESSAGES', roomId, payload: messages });
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const sendMessage = async (roomId, messageData) => {
    try {
      const message = await chatService.sendMessage(roomId, messageData);
      // Optimistically add message to local state
      dispatch({ type: 'ADD_MESSAGE', roomId, payload: message });
      return message;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const createRoom = async (roomData) => {
    try {
      console.log('Creating room with data:', roomData);
      const newRoom = await chatService.createChatRoom(roomData);
      console.log('Room created successfully:', newRoom);
      dispatch({ type: 'ADD_ROOM', payload: newRoom });
      return newRoom;
    } catch (error) {
      console.error('Failed to create room:', error);
      console.error('Error details:', error);
      throw error;
    }
  };

  const joinRoom = (roomId) => {
    if (state.socket) {
      state.socket.emit('join-chat-room', roomId);
    }
  };

  const leaveRoom = (roomId) => {
    if (state.socket) {
      state.socket.emit('leave-chat-room', roomId);
    }
  };

  const setActiveRoom = (room) => {
    if (state.activeRoom) {
      leaveRoom(state.activeRoom.id);
    }
    dispatch({ type: 'SET_ACTIVE_ROOM', payload: room });
    if (room) {
      joinRoom(room.id);
      loadMessages(room.id);
    }
  };

  const emitTyping = (roomId, isTyping) => {
    if (state.socket && user && roomId) {
      state.socket.emit('typing', {
        roomId,
        userId: user.userId || user.id,
        userName: user.firstName || user.name,
        isTyping
      });
    }
  };

  const value = {
    ...state,
    loadChatRooms,
    loadMessages,
    sendMessage,
    createRoom,
    setActiveRoom,
    emitTyping
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};