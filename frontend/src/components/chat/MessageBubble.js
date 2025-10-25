import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

const MessageBubble = ({ message }) => {
  const { user } = useAuth();
  const isOwnMessage = message.user_id === (user?.userId || user?.id);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStatus = () => {
    // You can implement message status (sent, delivered, read) later
    return '✓✓'; // Double check mark for now
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex mb-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 ${
            isOwnMessage
              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-md'
              : 'bg-white text-gray-900 rounded-bl-md border border-gray-200 shadow-md'
          }`}
        >
          {message.ReplyTo && (
            <div className={`text-xs mb-3 p-3 rounded-xl border-l-4 ${
              isOwnMessage 
                ? 'bg-primary-400/30 border-primary-200' 
                : 'bg-gray-100 border-gray-400'
            }`}>
              <div className="font-semibold opacity-90 mb-1">
                {`${message.ReplyTo.User?.first_name || ''} ${message.ReplyTo.User?.last_name || ''}`.trim() || 'Unknown User'}
              </div>
              <div className="truncate opacity-75">
                {message.ReplyTo.message}
              </div>
            </div>
          )}
          
          <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">
            {message.message}
          </div>
          
          {message.file_url && (
            <div className="mt-3">
              {message.message_type === 'image' ? (
                <img 
                  src={message.file_url} 
                  alt={message.file_name}
                  className="max-w-full h-auto rounded-xl shadow-sm"
                />
              ) : (
                <div className={`flex items-center space-x-3 p-3 rounded-xl ${
                  isOwnMessage ? 'bg-primary-400/30' : 'bg-gray-100'
                }`}>
                  <span className="text-lg">📎</span>
                  <span className="text-sm font-medium">{message.file_name}</span>
                </div>
              )}
            </div>
          )}
          
          <div className={`flex items-center justify-end space-x-2 text-xs mt-2 ${
            isOwnMessage ? 'text-primary-100' : 'text-gray-500'
          }`}>
            <span className="font-medium">{formatTime(message.created_at)}</span>
            {isOwnMessage && (
              <span className={`${isOwnMessage ? 'text-primary-200' : 'text-gray-400'}`}>
                {getMessageStatus()}
              </span>
            )}
            {message.is_edited && (
              <span className="opacity-75 italic">(edited)</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;