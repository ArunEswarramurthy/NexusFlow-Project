import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';

const TestChatSidebar = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      console.log('Loading users...');
      const response = await userService.getAllUsers();
      console.log('Users response:', response);
      setUsers(response.users || []);
      setError(null);
    } catch (error) {
      console.error('Failed to load users:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testCreateRoom = async (user) => {
    try {
      console.log('Testing room creation for user:', user);
      
      const response = await fetch('http://localhost:5000/api/chat/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim() || user.email,
          type: 'direct',
          participants: [user.id]
        })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (response.ok) {
        alert('Chat room created successfully!');
      } else {
        alert('Failed to create room: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 bg-primary-500 text-white">
        <h2 className="text-lg font-bold">Test Chat</h2>
        <button 
          onClick={loadUsers}
          className="mt-2 px-3 py-1 bg-white/20 rounded text-sm"
        >
          Reload Users
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading && <div>Loading users...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        
        <div className="text-xs font-semibold text-gray-500 mb-3">
          USERS ({users.length})
        </div>
        
        {users.map((user) => (
          <div key={user.id} className="mb-2 p-2 border rounded">
            <div className="font-medium">
              {user.first_name || user.firstName || 'No First Name'} {user.last_name || user.lastName || 'No Last Name'}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
            <button
              onClick={() => testCreateRoom(user)}
              className="mt-1 px-2 py-1 bg-primary-500 text-white text-xs rounded"
            >
              Test Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestChatSidebar;