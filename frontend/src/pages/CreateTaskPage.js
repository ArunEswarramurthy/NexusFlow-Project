import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../components/layout/AdminLayout';
import { ArrowLeft, Plus, X, Calendar, User, Users, Tag, AlertCircle, Paperclip } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CreateTaskPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedUsers: [],
    tags: [],
    category: '',
    attachments: null
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    loadUsers();
    // Set default due date to 7 days from now
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 7);
    setFormData(prev => ({
      ...prev,
      dueDate: defaultDueDate.toISOString().split('T')[0]
    }));
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('priority', formData.priority);
      submitData.append('dueDate', formData.dueDate);
      submitData.append('assignedUsers', JSON.stringify(formData.assignedUsers));
      submitData.append('tags', JSON.stringify(formData.tags));
      submitData.append('category', formData.category);
      
      // Add files if any
      if (formData.attachments) {
        Array.from(formData.attachments).forEach(file => {
          submitData.append('attachments', file);
        });
      }

      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: submitData
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Task created successfully');
        navigate('/tasks');
      } else {
        throw new Error(data.error || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(error.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleUserToggle = (userId) => {
    setFormData(prev => ({
      ...prev,
      assignedUsers: prev.assignedUsers.includes(userId)
        ? prev.assignedUsers.filter(id => id !== userId)
        : [...prev.assignedUsers, userId]
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/tasks')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tasks
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-gray-600">Fill in the details to create a new task</p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="input w-full"
                      placeholder="Enter task title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="input w-full"
                      rows="4"
                      placeholder="Describe the task in detail"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="input w-full"
                      placeholder="e.g., Development, Design, Marketing"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Paperclip className="w-4 h-4 inline mr-1" />
                      Attachments
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setFormData(prev => ({ ...prev, attachments: e.target.files }))}
                      className="input w-full"
                      accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported: PDF, DOC, DOCX, TXT, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF (Max 10MB each)
                    </p>
                    {formData.attachments && formData.attachments.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Selected files:</p>
                        <ul className="text-sm text-gray-500">
                          {Array.from(formData.attachments).map((file, index) => (
                            <li key={index}>• {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="input flex-1"
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="btn btn-outline"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 hover:text-primary-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Assignment */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  <Users className="w-5 h-5 inline mr-2" />
                  Assign to Users
                </h3>
                
                <div className="space-y-3">
                  {users.length === 0 ? (
                    <p className="text-gray-500">No users available</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {users.map((user) => (
                        <label
                          key={user.id}
                          className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.assignedUsers.includes(user.id)}
                            onChange={() => handleUserToggle(user.id)}
                            className="mr-3"
                          />
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-medium text-primary-700">
                                {user.avatar}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Priority & Due Date */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <div className="space-y-2">
                      {['urgent', 'high', 'medium', 'low'].map((priority) => (
                        <label key={priority} className="flex items-center">
                          <input
                            type="radio"
                            name="priority"
                            value={priority}
                            checked={formData.priority === priority}
                            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                            className="mr-2"
                          />
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(priority)}`}>
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="input w-full"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assigned Users:</span>
                    <span className="font-medium">{formData.assignedUsers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tags:</span>
                    <span className="font-medium">{formData.tags.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Attachments:</span>
                    <span className="font-medium">{formData.attachments ? formData.attachments.length : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(formData.priority)}`}>
                      {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                    </span>
                  </div>
                  {formData.dueDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="font-medium">
                        {new Date(formData.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="card p-6">
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Task
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/tasks')}
                    className="btn btn-outline w-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateTaskPage;