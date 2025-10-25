import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminLayout from '../components/layout/AdminLayout';
import { useAuth } from '../hooks/useAuth';
import { 
  ArrowLeft, Clock, User, Calendar, Tag, MessageSquare, 
  Paperclip, CheckCircle, Play, Send, CheckSquare, X,
  Edit, Trash2, AlertTriangle, Users, Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const TaskDetailPage = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTask(data.task);
      } else if (response.status === 404) {
        setTask(null);
      } else {
        throw new Error('Failed to load task');
      }
    } catch (error) {
      console.error('Error loading task:', error);
      toast.error('Failed to load task');
      setTask(null);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAction = async (action) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      let response;
      switch (action) {
        case 'start':
          response = await fetch(`http://localhost:5000/api/tasks/${taskId}/start`, {
            method: 'POST',
            headers
          });
          break;
        case 'submit':
          response = await fetch(`http://localhost:5000/api/tasks/${taskId}/submit`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ submissionNotes: 'Task completed and ready for review' })
          });
          break;
        case 'approve':
          response = await fetch(`http://localhost:5000/api/tasks/${taskId}/approve`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ approvalNotes: 'Task approved' })
          });
          break;
        case 'reject':
          const reason = prompt('Please provide a reason for sending back for rework:');
          if (!reason) return;
          response = await fetch(`http://localhost:5000/api/tasks/${taskId}/reject`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ rejectionReason: reason })
          });
          break;
        case 'delete':
          if (!window.confirm('Are you sure you want to delete this task?')) return;
          response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
            method: 'DELETE',
            headers
          });
          if (response.ok) {
            toast.success('Task deleted successfully');
            navigate('/tasks');
            return;
          }
          break;
        default:
          return;
      }

      if (response && response.ok) {
        toast.success(`Task ${action}ed successfully`);
        loadTask(); // Reload task data
      } else {
        throw new Error(`Failed to ${action} task`);
      }
    } catch (error) {
      console.error('Task action error:', error);
      toast.error(error.message || 'Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'to_do': case 'to do': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in_progress': case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under_review': case 'under review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatStatus = (status) => {
    const statusMap = {
      'to_do': 'To Do',
      'in_progress': 'In Progress',
      'under_review': 'Under Review',
      'completed': 'Completed',
      'rejected': 'Rejected'
    };
    return statusMap[status] || status;
  };

  const canPerformAction = (action) => {
    const isAdmin = ['Admin', 'Super Admin'].includes(user?.role);
    const isAssigned = task?.assignedUsers?.some(assignedUser => assignedUser.id === user?.id);
    
    switch (action) {
      case 'start':
        return (isAdmin || isAssigned) && task?.status === 'to_do';
      case 'submit':
        return (isAdmin || isAssigned) && task?.status === 'in_progress';
      case 'approve':
        return isAdmin && task?.status === 'under_review';
      case 'reject':
        return isAdmin && task?.status === 'under_review';
      case 'edit':
      case 'delete':
        return isAdmin;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading task...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!task) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Task not found</h3>
          <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or you don't have permission to view it.</p>
          <button onClick={() => navigate('/tasks')} className="btn btn-primary">
            Back to Tasks
          </button>
        </div>
      </AdminLayout>
    );
  }

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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
              <p className="text-gray-600">Task ID: {task.id}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              {canPerformAction('edit') && (
                <button
                  onClick={() => navigate(`/tasks/${taskId}/edit`)}
                  className="btn btn-outline"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
              )}
              
              {canPerformAction('delete') && (
                <button
                  onClick={() => handleTaskAction('delete')}
                  className="btn btn-danger"
                  disabled={actionLoading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Details */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
            </div>

            {/* Progress */}
            {task.progress > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Completion</span>
                  <span className="text-sm font-medium text-gray-900">{task.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Attachments */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <Paperclip className="w-5 h-5 inline mr-2" />
                Attachments ({task.attachments?.length || 0})
              </h3>
              
              {task.attachments && task.attachments.length > 0 ? (
                <div className="space-y-3">
                  {task.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <Paperclip className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900">{attachment.filename}</div>
                          <div className="text-sm text-gray-500">
                            {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB • {new Date(attachment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => window.open(`http://localhost:5000/api/tasks/${taskId}/attachments/${attachment.id}/download`)}
                        className="btn btn-outline btn-sm"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No attachments</p>
              )}
            </div>

            {/* Comments */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <MessageSquare className="w-5 h-5 inline mr-2" />
                Comments ({task.comments?.length || 0})
              </h3>
              
              {task.comments && task.comments.length > 0 ? (
                <div className="space-y-4">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="border-l-4 border-primary-200 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No comments yet</p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Actions</h3>
              
              <div className="space-y-4">
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
                    {formatStatus(task.status)}
                  </span>
                </div>

                <div className="space-y-2">
                  {canPerformAction('start') && (
                    <button
                      onClick={() => handleTaskAction('start')}
                      disabled={actionLoading}
                      className="btn btn-primary w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Task
                    </button>
                  )}
                  
                  {canPerformAction('submit') && (
                    <button
                      onClick={() => handleTaskAction('submit')}
                      disabled={actionLoading}
                      className="btn btn-success w-full"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit for Review
                    </button>
                  )}
                  
                  {canPerformAction('approve') && (
                    <button
                      onClick={() => handleTaskAction('approve')}
                      disabled={actionLoading}
                      className="btn btn-success w-full"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Task
                    </button>
                  )}
                  
                  {canPerformAction('reject') && (
                    <button
                      onClick={() => handleTaskAction('reject')}
                      disabled={actionLoading}
                      className="btn btn-warning w-full"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Send for Rework
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Task Info */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Created by:</span>
                  <span className="font-medium">{task.createdBy}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Assigned Users */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <Users className="w-5 h-5 inline mr-2" />
                Assigned Users ({task.assignedUsers?.length || 0})
              </h3>
              
              {task.assignedUsers && task.assignedUsers.length > 0 ? (
                <div className="space-y-3">
                  {task.assignedUsers.map((assignedUser) => (
                    <div key={assignedUser.id} className="flex items-center">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-primary-700">
                          {assignedUser.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{assignedUser.name}</div>
                        <div className="text-sm text-gray-500">{assignedUser.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No users assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default TaskDetailPage;