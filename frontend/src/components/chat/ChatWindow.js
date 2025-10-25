import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, MoreVertical, Phone, Video, Search, Info } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWindow = () => {
  const { activeRoom, messages, sendMessage, emitTyping, typingUsers } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const roomMessages = activeRoom ? messages[activeRoom.id] || [] : [];

  useEffect(() => {
    scrollToBottom();
  }, [roomMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeRoom) return;

    try {
      await sendMessage(activeRoom.id, {
        message: newMessage.trim(),
        messageType: 'text'
      });
      setNewMessage('');
      handleStopTyping();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleTyping = (value) => {
    setNewMessage(value);
    
    if (!isTyping && value.trim() && activeRoom) {
      setIsTyping(true);
      emitTyping(activeRoom.id, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping && activeRoom) {
      setIsTyping(false);
      emitTyping(activeRoom.id, false);
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}`.toUpperCase();
  };

  const getDisplayName = (room) => {
    if (!room || !room.name) return 'Unknown Chat';
    return room.name;
  };

  const getOnlineStatus = () => {
    return 'online'; // You can implement real online status later
  };

  if (!activeRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md px-6"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Send className="w-12 h-12 text-primary-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Welcome to NexusFlow Chat
          </h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            Connect with your team instantly. Search for colleagues in the sidebar to start meaningful conversations and boost productivity.
          </p>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">
              💡 <strong>Tip:</strong> Use the search bar to find team members quickly
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold shadow-md ${
                  activeRoom.type === 'direct' ? 'bg-gradient-to-br from-success-400 to-success-600' :
                  activeRoom.type === 'group' ? 'bg-gradient-to-br from-info-400 to-info-600' :
                  'bg-gradient-to-br from-warning-400 to-warning-600'
                }`}>
                  {activeRoom.type === 'direct' ? 
                    getInitials(activeRoom.name) :
                    activeRoom.type === 'group' ? activeRoom.name[0].toUpperCase() :
                    '#'
                  }
                </div>
                {activeRoom.type === 'direct' && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900">{getDisplayName(activeRoom)}</h3>
                <p className="text-sm text-gray-500 flex items-center">
                  {activeRoom.type === 'direct' ? (
                    <><span className="w-2 h-2 bg-success-500 rounded-full mr-2"></span>{getOnlineStatus()}</>
                  ) : (
                    `${activeRoom.ChatParticipants?.length || 0} members`
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              {activeRoom.type === 'direct' && (
                <>
                  <button className="p-3 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-3 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200">
                    <Video className="w-5 h-5" />
                  </button>
                </>
              )}
              <button className="p-3 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-3 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
        <div className="p-6 space-y-4">
          {roomMessages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-10 h-10 text-primary-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Start the conversation</h3>
              <p className="text-gray-500 mb-4">Send a message to begin chatting with {getDisplayName(activeRoom)}</p>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 max-w-sm mx-auto">
                <p className="text-sm text-gray-500">
                  💬 Your messages are secure and private
                </p>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {roomMessages.map((message, index) => {
                const showDate = index === 0 || 
                  new Date(message.created_at).toDateString() !== 
                  new Date(roomMessages[index - 1].created_at).toDateString();
                
                return (
                  <motion.div 
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    {showDate && (
                      <div className="text-center my-6">
                        <span className="bg-white px-4 py-2 rounded-full text-sm text-gray-600 shadow-sm border border-gray-200 font-medium">
                          {new Date(message.created_at).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    )}
                    <MessageBubble message={message} />
                  </motion.div>
                );
              })}
              
              {/* Typing Indicator */}
              <AnimatePresence>
                {typingUsers[activeRoom?.id] && typingUsers[activeRoom.id].isTyping && (
                  <TypingIndicator userName={typingUsers[activeRoom.id].userName} />
                )}
              </AnimatePresence>
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Professional Message Input */}
      <div className="bg-white border-t border-gray-200 p-6">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
          <button
            type="button"
            className="p-3 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <div className="relative">
              <textarea
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Type your message..."
                className="w-full px-6 py-4 pr-14 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all duration-200 text-gray-900 placeholder-gray-500"
                rows="1"
                style={{ minHeight: '52px', maxHeight: '120px' }}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>
          </div>
          <motion.button
            type="submit"
            disabled={!newMessage.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;