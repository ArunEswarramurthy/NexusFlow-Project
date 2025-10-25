import React, { useState, useEffect } from 'react';
import { Search, Plus, MessageCircle, Users, User, MoreVertical } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { userService } from '../../services/userService';
import { motion, AnimatePresence } from 'framer-motion';

const ChatSidebar = () => {
  const { rooms, activeRoom, setActiveRoom, loadChatRooms, createRoom } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChatRooms();
    loadAllUsers();
  }, []);

  const loadAllUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      console.log('Loaded users:', response);
      setAllUsers(response.users || response || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = allUsers.filter(user => {
    if (!searchQuery.trim()) return true;
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().trim();
    const email = (user.email || '').toLowerCase();
    const searchTerm = searchQuery.toLowerCase();
    return fullName.includes(searchTerm) || email.includes(searchTerm);
  });

  const startDirectChat = async (user) => {
    try {
      const roomName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email;
      const newRoom = await createRoom({
        name: roomName,
        type: 'direct',
        participants: [user.id]
      });
      setActiveRoom(newRoom);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to start chat:', error);
    }
  };

  const getInitials = (user) => {
    if (!user) return 'U';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    if (!firstName && !lastName) return (user.email?.[0] || 'U').toUpperCase();
    return `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  };

  const getUserName = (user) => {
    if (!user) return 'Unknown User';
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || user.email || 'Unknown User';
  };

  const getLastMessageTime = (messages) => {
    if (!messages || messages.length === 0) return '';
    const lastMessage = messages[0];
    const date = new Date(lastMessage.created_at);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    return date.toLocaleDateString();
  };

  const formatLastMessage = (messages) => {
    if (!messages || messages.length === 0) return 'Tap to start chatting';
    const lastMessage = messages[0];
    const prefix = lastMessage.message_type === 'file' ? '📎 ' : '';
    const text = lastMessage.message.length > 35 
      ? `${lastMessage.message.substring(0, 35)}...` 
      : lastMessage.message;
    return prefix + text;
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
      {/* Professional Header */}
      <div className="p-6 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <MessageCircle className="w-6 h-6 mr-2" />
            Chat
          </h2>
          <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {/* Enhanced Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search colleagues..."
            className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all"
          />
        </div>
      </div>

      {/* Enhanced Search Results or Chat List */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4">
          {/* Always show users list */}
          <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            {searchQuery ? 'Search Results' : 'Team Members'}
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500">Loading colleagues...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">
                {searchQuery ? 'No colleagues found' : 'No team members'}
              </p>
              <p className="text-sm text-gray-400">
                {searchQuery ? 'Try a different search term' : 'Add team members to start chatting'}
              </p>
            </div>
          ) : (
            <div className="space-y-2 mb-6">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => startDirectChat(user)}
                  className="flex items-center p-3 bg-white rounded-xl hover:bg-primary-50 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md border border-gray-100"
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold mr-3 shadow-sm">
                      {getInitials(user)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {getUserName(user)}
                    </h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Recent Chats */}
          {rooms.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide border-t pt-4">
                Recent Chats
              </div>
              <div className="space-y-2">
                {rooms.slice(0, 5).map((room) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setActiveRoom(room)}
                    className={`flex items-center p-3 cursor-pointer rounded-xl transition-all duration-200 ${
                      activeRoom?.id === room.id
                        ? 'bg-primary-50 border-2 border-primary-200 shadow-md'
                        : 'bg-white hover:bg-gray-50 border border-gray-100 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold mr-3 shadow-sm ${
                        room.type === 'direct' ? 'bg-gradient-to-br from-success-400 to-success-600' :
                        room.type === 'group' ? 'bg-gradient-to-br from-info-400 to-info-600' :
                        'bg-gradient-to-br from-warning-400 to-warning-600'
                      }`}>
                        {room.type === 'direct' ? 
                          (room.name?.[0] || 'U').toUpperCase() :
                          room.type === 'group' ? <Users className="w-6 h-6" /> :
                          '#'
                        }
                      </div>
                      {room.type === 'direct' && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {room.name || 'Unknown Chat'}
                        </h3>
                        <span className="text-xs text-gray-400 ml-2 flex-shrink-0">
                          {getLastMessageTime(room.ChatMessages)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 truncate">
                          {formatLastMessage(room.ChatMessages)}
                        </p>
                        {room.unreadCount > 0 && (
                          <div className="bg-primary-500 text-white text-xs rounded-full px-2 py-1 min-w-[18px] text-center ml-2 font-medium">
                            {room.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
};

export default ChatSidebar;