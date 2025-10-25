import React, { useState, useEffect } from 'react';
import { X, Users, Hash, User } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { userService } from '../../services/userService';
import { taskService } from '../../services/taskService';

const CreateRoomModal = ({ isOpen, onClose }) => {
  const { createRoom } = useChat();
  const [formData, setFormData] = useState({
    name: '',
    type: 'group',
    description: '',
    participants: [],
    taskId: ''
  });
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      loadTasks();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    try {
      const response = await userService.getAllUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadTasks = async () => {
    try {
      const response = await taskService.getAllTasks();
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createRoom(formData);
      onClose();
      setFormData({
        name: '',
        type: 'group',
        description: '',
        participants: [],
        taskId: ''
      });
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleParticipantToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(userId)
        ? prev.participants.filter(id => id !== userId)
        : [...prev.participants, userId]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Create Chat Room</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Room Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'group', label: 'Group', icon: Users },
                  { value: 'direct', label: 'Direct', icon: User },
                  { value: 'task', label: 'Task', icon: Hash }
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: value }))}
                    className={`p-3 border rounded-lg flex flex-col items-center space-y-1 ${
                      formData.type === value
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Room Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter room name"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter room description"
                rows="2"
              />
            </div>

            {/* Task Selection (for task rooms) */}
            {formData.type === 'task' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related Task
                </label>
                <select
                  value={formData.taskId}
                  onChange={(e) => setFormData(prev => ({ ...prev, taskId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a task</option>
                  {tasks.map(task => (
                    <option key={task.id} value={task.id}>
                      {task.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Participants */}
            {formData.type !== 'direct' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Participants
                </label>
                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                  {users.map(user => (
                    <label
                      key={user.id}
                      className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.participants.includes(user.id)}
                        onChange={() => handleParticipantToggle(user.id)}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Message User Selection */}
            {formData.type === 'direct' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select User
                </label>
                <select
                  value={formData.participants[0] || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    participants: e.target.value ? [parseInt(e.target.value)] : [] 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a user</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Room'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomModal;