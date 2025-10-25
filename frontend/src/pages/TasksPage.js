import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AdminLayout from '../components/layout/AdminLayout';
import { 
  Plus, Search, Filter, Calendar, List, Grid3X3, Clock, CheckCircle,
  AlertTriangle, User, Users, MoreHorizontal, Eye, Edit, Trash2, Play,
  Send, CheckSquare, X, ArrowRight, Tag, Paperclip, MessageSquare
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const TasksPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState('kanban');
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    assignee: 'all',
    dueDate: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Load tasks from API
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:5000/api/tasks', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Transform API data to match UI expectations
          const transformedTasks = (data.tasks || []).map(task => ({
            ...task,
            status: formatStatus(task.status),
            priority: formatPriority(task.priority),
            assignee: task.assignedTo || 'Unassigned',
            assigneeAvatar: task.assigneeAvatar || 'UN',
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          }));
          
          setTasks(transformedTasks);
          setFilteredTasks(transformedTasks);
        } else if (response.status === 401) {
          toast.error('Please log in again');
          navigate('/login');
        } else {
          console.error('Failed to fetch tasks:', response.status);
          setTasks([]);
          setFilteredTasks([]);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
        setTasks([]);
        setFilteredTasks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Helper functions to format status and priority
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

  const formatPriority = (priority) => {
    const priorityMap = {
      'urgent': 'Urgent',
      'high': 'High',
      'medium': 'Medium',
      'low': 'Low'
    };
    return priorityMap[priority] || priority;
  };

  // Filter and search tasks
  useEffect(() => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    if (filters.assignee !== 'all') {
      filtered = filtered.filter(task => task.assignee === filters.assignee);
    }

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, filters]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleTaskAction = async (taskId, action) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      switch (action) {
        case 'view':
          navigate(`/tasks/${taskId}`);
          break;
        case 'edit':
          navigate(`/tasks/${taskId}/edit`);
          break;
        case 'delete':
          if (window.confirm('Are you sure you want to delete this task?')) {
            const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
              method: 'DELETE',
              headers
            });
            
            if (response.ok) {
              setTasks(tasks.filter(task => task.id !== taskId));
              setFilteredTasks(filteredTasks.filter(task => task.id !== taskId));
              toast.success('Task deleted successfully');
            } else {
              throw new Error('Failed to delete task');
            }
          }
          break;
        case 'start':
          const startResponse = await fetch(`http://localhost:5000/api/tasks/${taskId}/start`, {
            method: 'POST',
            headers
          });
          
          if (startResponse.ok) {
            setTasks(tasks.map(task => 
              task.id === taskId ? { ...task, status: 'In Progress' } : task
            ));
            setFilteredTasks(filteredTasks.map(task => 
              task.id === taskId ? { ...task, status: 'In Progress' } : task
            ));
            toast.success('Task started');
          } else {
            throw new Error('Failed to start task');
          }
          break;
        case 'submit':
          const submitResponse = await fetch(`http://localhost:5000/api/tasks/${taskId}/submit`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ submissionNotes: 'Task completed and ready for review' })
          });
          
          if (submitResponse.ok) {
            setTasks(tasks.map(task => 
              task.id === taskId ? { ...task, status: 'Under Review', progress: 100 } : task
            ));
            setFilteredTasks(filteredTasks.map(task => 
              task.id === taskId ? { ...task, status: 'Under Review', progress: 100 } : task
            ));
            toast.success('Task submitted for review');
          } else {
            throw new Error('Failed to submit task');
          }
          break;
        case 'approve':
          const approveResponse = await fetch(`http://localhost:5000/api/tasks/${taskId}/approve`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ approvalNotes: 'Task approved' })
          });
          
          if (approveResponse.ok) {
            setTasks(tasks.map(task => 
              task.id === taskId ? { ...task, status: 'Completed', progress: 100 } : task
            ));
            setFilteredTasks(filteredTasks.map(task => 
              task.id === taskId ? { ...task, status: 'Completed', progress: 100 } : task
            ));
            toast.success('Task approved and completed');
          } else {
            throw new Error('Failed to approve task');
          }
          break;
        case 'reject':
          const reason = prompt('Please provide a reason for sending back for rework:');
          if (!reason) return;
          
          const rejectResponse = await fetch(`http://localhost:5000/api/tasks/${taskId}/reject`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ rejectionReason: reason })
          });
          
          if (rejectResponse.ok) {
            setTasks(tasks.map(task => 
              task.id === taskId ? { ...task, status: 'In Progress', progress: Math.max(0, task.progress - 20) } : task
            ));
            setFilteredTasks(filteredTasks.map(task => 
              task.id === taskId ? { ...task, status: 'In Progress', progress: Math.max(0, task.progress - 20) } : task
            ));
            toast.success('Task sent back for rework');
          } else {
            throw new Error('Failed to reject task');
          }
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Task action error:', error);
      toast.error(error.message || 'Action failed');
    }
  };

  const TaskCard = ({ task, isDragging = false }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`card p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${
        isDragging ? 'opacity-50 rotate-2' : ''
      }`}
      onClick={() => navigate(`/tasks/${task.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {task.description}
          </p>
        </div>
      </div>

      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {task.progress > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {task.attachments > 0 && (
            <div className="flex items-center text-xs text-gray-500">
              <Paperclip className="w-3 h-3 mr-1" />
              {task.attachments}
            </div>
          )}
          
          <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-primary-700">
              {task.assigneeAvatar}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex space-x-2">
          {/* User actions */}
          {(user?.role === 'User' || task.assignedUsers?.some(u => u.id === user?.id)) && (
            <>
              {task.status === 'To Do' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTaskAction(task.id, 'start');
                  }}
                  className="btn btn-sm btn-primary flex-1"
                >
                  <Play className="w-3 h-3 mr-1" />
                  Start
                </button>
              )}
              {task.status === 'In Progress' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTaskAction(task.id, 'submit');
                  }}
                  className="btn btn-sm btn-success flex-1"
                >
                  <Send className="w-3 h-3 mr-1" />
                  Submit for Review
                </button>
              )}
            </>
          )}
          
          {/* Admin actions */}
          {['Admin', 'Super Admin'].includes(user?.role) && (
            <>
              {task.status === 'Under Review' && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskAction(task.id, 'approve');
                    }}
                    className="btn btn-sm btn-success flex-1"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskAction(task.id, 'reject');
                    }}
                    className="btn btn-sm btn-warning flex-1"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Rework
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );

  const KanbanView = () => {
    const columns = [
      { id: 'To Do', title: 'To Do', color: 'border-gray-300', bgColor: 'bg-gray-50' },
      { id: 'In Progress', title: 'In Progress', color: 'border-blue-300', bgColor: 'bg-blue-50' },
      { id: 'Under Review', title: 'Under Review', color: 'border-yellow-300', bgColor: 'bg-yellow-50' },
      { id: 'Completed', title: 'Completed', color: 'border-green-300', bgColor: 'bg-green-50' }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter(task => task.status === column.id);
          
          return (
            <div key={column.id} className="flex flex-col">
              <div className={`flex items-center justify-between p-4 ${column.bgColor} rounded-lg border-t-4 ${column.color} mb-4 shadow-sm`}>
                <h3 className="font-semibold text-gray-900">{column.title}</h3>
                <span className="bg-white text-gray-600 text-sm px-2 py-1 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
              
              <div className="space-y-4 flex-1">
                <AnimatePresence>
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </AnimatePresence>
                
                {columnTasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <p>No tasks in {column.title.toLowerCase()}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage and track all your tasks in one place
            </p>
          </div>
          
          {(user?.role === 'Admin' || user?.role === 'Super Admin') && (
            <div className="mt-4 sm:mt-0">
              <Link to="/tasks/create" className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Link>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>

            <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setView('kanban')}
                className={`p-2 rounded ${view === 'kanban' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded ${view === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card p-4 mb-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="input"
                  >
                    <option value="all">All Statuses</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Needs Rework</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                    className="input"
                  >
                    <option value="all">All Priorities</option>
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
                  <select
                    value={filters.assignee}
                    onChange={(e) => setFilters({ ...filters, assignee: e.target.value })}
                    className="input"
                  >
                    <option value="all">All Assignees</option>
                    <option value="Unassigned">Unassigned</option>
                    {[...new Set(tasks.map(task => task.assignee))]
                      .filter(assignee => assignee && assignee !== 'Unassigned')
                      .map(assignee => (
                        <option key={assignee} value={assignee}>{assignee}</option>
                      ))
                    }
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({ status: 'all', priority: 'all', assignee: 'all', dueDate: 'all' })}
                    className="btn btn-outline w-full"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tasks Content */}
        <div className="min-h-96">
          {view === 'kanban' && <KanbanView />}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckSquare className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || Object.values(filters).some(f => f !== 'all') ? 'No tasks found' : 'No tasks yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || Object.values(filters).some(f => f !== 'all') 
                ? 'Try adjusting your search or filters' 
                : 'Get started by creating your first task'
              }
            </p>
            {(user?.role === 'Admin' || user?.role === 'Super Admin') && (
              <Link to="/tasks/create" className="btn btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create First Task
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default TasksPage;