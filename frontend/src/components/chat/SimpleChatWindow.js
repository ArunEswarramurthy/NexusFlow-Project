import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../hooks/useAuth';

const SimpleChatWindow = () => {
  const { activeRoom, messages, sendMessage } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const roomMessages = activeRoom ? messages[activeRoom.id] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!activeRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-primary-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a chat</h3>
          <p className="text-gray-500">Choose someone from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h3 className="font-semibold text-gray-900">{activeRoom.name || 'Chat'}</h3>
        <p className="text-sm text-gray-500">Online</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {roomMessages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          roomMessages.map((message) => {
            const isOwnMessage = message.user_id === (user?.userId || user?.id);
            return (
              <div key={message.id} className={`flex mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs px-4 py-2 rounded-lg ${
                  isOwnMessage 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p>{message.message}</p>
                  <p className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-100' : 'text-gray-500'}`}>
                    {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SimpleChatWindow;