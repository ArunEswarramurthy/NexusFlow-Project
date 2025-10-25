import React, { useState, useEffect } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { userService } from '../../services/userService';

const SimpleChatSidebar = () => {
  const { rooms, activeRoom, setActiveRoom, loadChatRooms, createRoom } = useChat();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
    loadChatRooms();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const startChat = async (user) => {
    console.log('Starting chat with user:', user);
    try {
      const roomName = `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim() || user.email;
      console.log('Creating room with name:', roomName);
      
      const newRoom = await createRoom({
        name: roomName,
        type: 'direct',
        participants: [user.id]
      });
      
      console.log('Room created:', newRoom);
      setActiveRoom(newRoom);
    } catch (error) {
      console.error('Failed to start chat:', error);
      alert('Failed to start chat: ' + error.message);
    }
  };

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const name = `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.toLowerCase();
    const email = (user.email || '').toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || email.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-primary-500 text-white">
        <h2 className="text-lg font-bold mb-3">Chat</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search colleagues..."
            className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:bg-white/30"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-xs font-semibold text-gray-500 mb-3 uppercase">Team Members</div>
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={(e) => {
              e.preventDefault();
              console.log('User clicked:', user);
              startChat(user);
            }}
            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer rounded-lg mb-2 border border-transparent hover:border-primary-200 transition-all"
            style={{ cursor: 'pointer' }}
          >
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
              {((user.first_name || user.firstName || '')[0] || (user.email || '')[0] || 'U').toUpperCase()}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">
                {`${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim() || user.email}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        ))}

        {/* Recent Chats */}
        {rooms.length > 0 && (
          <div className="mt-6">
            <div className="text-xs font-semibold text-gray-500 mb-3 uppercase border-t pt-4">Recent Chats</div>
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setActiveRoom(room)}
                className={`flex items-center p-3 cursor-pointer rounded-lg mb-2 ${
                  activeRoom?.id === room.id ? 'bg-primary-50 border border-primary-200' : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-10 h-10 bg-success-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  {(room.name?.[0] || 'C').toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{room.name || 'Chat'}</h3>
                  <p className="text-sm text-gray-500">Tap to open</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleChatSidebar;