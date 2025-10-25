import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Target,
  Activity,
  ArrowRight,
  Play,
  Send,
  Eye,
  MessageSquare,
  Paperclip,
  User,
  Award,
  BarChart3
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const UserDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDashboardData({
          stats: {
            activeTasks: 5,
            completedThisWeek: 3,
            inReview: 1,
            overdue: 0
          },
          myTasks: [
            {
              id: 1,
              title: 'Implement user authentication system',
              description: 'Create secure login and registration functionality',
              status: 'In Progress',
              priority: 'High',
              dueDate: '2025-01-25',
              progress: 65,
              checklist: { completed: 3, total: 5 },
              comments: 5,
              attachments: 2
            },
            {
              id: 2,
              title: 'Fix login bug',
              description: 'Resolve issue with password reset functionality',
              status: 'Under Review',
              priority: 'Urgent',
              dueDate: '2025-01-20',
              progress: 100,
              checklist: { completed: 2, total: 2 },
              comments: 8,
              attachments: 0
            },
            {
              id: 3,
              title: 'Update API documentation',
              description: 'Document new endpoints and update examples',
              status: 'To Do',
              priority: 'Medium',
              dueDate: '2025-01-30',
              progress: 0,
              checklist: { completed: 0, total: 4 },
              comments: 1,
              attachments: 1
            }
          ],
          recentActivity: [
            { action: 'Completed Task #124', time: '2 hours ago', type: 'completed' },
            { action: 'Submitted Task #123 for review', time: '4 hours ago', type: 'submitted' },
            { action: 'Started working on Task #125', time: '6 hours ago', type: 'started' },
            { action: 'Commented on Task #122', time: '1 day ago', type: 'commented' }
          ],
          upcomingDeadlines: [
            { id: 1, title: 'Fix login bug', dueDate: '2025-01-20', priority: 'Urgent' },
            { id: 2, title: 'Implement authentication', dueDate: '2025-01-25', priority: 'High' },
            { id: 3, title: 'Update documentation', dueDate: '2025-01-30', priority: 'Medium' }
          ]
        });
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'To Do': return 'text-gray-600 bg-gray-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Under Review': return 'text-yellow-600 bg-yellow-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleTaskAction = (taskId, action) => {
    const updatedTasks = dashboardData.myTasks.map(task => {
      if (task.id === taskId) {
        switch (action) {
          case 'start':
            return { ...task, status: 'In Progress' };
          case 'submit':
            return { ...task, status: 'Under Review' };
          default:
            return task;
        }
      }
      return task;
    });

    setDashboardData({
      ...dashboardData,
      myTasks: updatedTasks
    });

    const actionMessages = {
      start: 'Task started successfully',
      submit: 'Task submitted for review'
    };

    toast.success(actionMessages[action]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img src="/logo.png" alt="NexusFlow" className="h-8 w-8 object-cover rounded" />
              <span className="text-xl font-bold text-gray-900">NexusFlow</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center sm:text-left"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600">
              Here's what you need to focus on today.
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: 'Active Tasks',
              value: dashboardData?.stats.activeTasks || 0,
              icon: Clock,
              color: 'from-blue-500 to-blue-600',
              change: '+2 this week'
            },
            {
              title: 'Completed',
              value: dashboardData?.stats.completedThisWeek || 0,
              icon: CheckCircle,
              color: 'from-green-500 to-green-600',
              change: 'This week'
            },
            {
              title: 'In Review',
              value: dashboardData?.stats.inReview || 0,
              icon: Eye,
              color: 'from-yellow-500 to-yellow-600',
              change: 'Pending approval'
            },
            {
              title: 'Overdue',
              value: dashboardData?.stats.overdue || 0,
              icon: AlertTriangle,
              color: 'from-red-500 to-red-600',
              change: 'Need attention'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary-500 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* My Tasks */}
          <div className="xl:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">My Tasks</h3>
                <Link to="/tasks" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center">
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {dashboardData?.myTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => window.location.href = `/tasks/${task.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{task.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {task.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{task.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Due {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                        {task.checklist && (
                          <div className="flex items-center">
                            <Target className="w-3 h-3 mr-1" />
                            {task.checklist.completed}/{task.checklist.total}
                          </div>
                        )}
                        {task.comments > 0 && (
                          <div className="flex items-center">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {task.comments}
                          </div>
                        )}
                        {task.attachments > 0 && (
                          <div className="flex items-center">
                            <Paperclip className="w-3 h-3 mr-1" />
                            {task.attachments}
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        {task.status === 'To Do' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskAction(task.id, 'start');
                            }}
                            className="btn btn-sm btn-primary"
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Start
                          </button>
                        )}
                        {task.status === 'In Progress' && task.progress === 100 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskAction(task.id, 'submit');
                            }}
                            className="btn btn-sm btn-success"
                          >
                            <Send className="w-3 h-3 mr-1" />
                            Submit
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {dashboardData?.myTasks.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No tasks assigned</h4>
                  <p className="text-gray-600">You're all caught up! New tasks will appear here when assigned.</p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Deadlines */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
              <div className="space-y-3">
                {dashboardData?.upcomingDeadlines.map((deadline, index) => (
                  <div key={deadline.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{deadline.title}</p>
                      <p className="text-xs text-gray-500">
                        Due {new Date(deadline.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(deadline.priority)}`}>
                      {deadline.priority}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {dashboardData?.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'completed' ? 'bg-green-400' :
                      activity.type === 'submitted' ? 'bg-yellow-400' :
                      activity.type === 'started' ? 'bg-blue-400' : 'bg-gray-400'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Performance Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Week</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Tasks Completed</span>
                  </div>
                  <span className="text-lg font-semibold text-green-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-600">Completion Rate</span>
                  </div>
                  <span className="text-lg font-semibold text-blue-600">85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="text-sm text-gray-600">Active Days</span>
                  </div>
                  <span className="text-lg font-semibold text-purple-600">5/7</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'View All Tasks', icon: CheckCircle, href: '/tasks', color: 'from-blue-500 to-blue-600' },
              { title: 'My Profile', icon: User, href: '/profile', color: 'from-green-500 to-green-600' },
              { title: 'Notifications', icon: Activity, href: '/notifications', color: 'from-purple-500 to-purple-600' },
              { title: 'Help Center', icon: MessageSquare, href: '/help', color: 'from-orange-500 to-orange-600' }
            ].map((action, index) => (
              <Link
                key={action.title}
                to={action.href}
                className="card p-4 text-center hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-primary-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{action.title}</h4>
                <div className="flex items-center justify-center text-primary-600 group-hover:text-primary-700">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserDashboard;