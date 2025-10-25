import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/layout/AdminLayout';
import { useAuth } from '../../hooks/useAuth';
import { 
  Activity, 
  Search, 
  Filter,
  Calendar,
  User,
  Settings,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  Clock,
  MapPin
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ActivityLogsPage = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    loadActivities();
  }, [filterType, filterUser, dateRange]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActivities([
        {
          id: 1,
          type: 'user_login',
          action: 'User logged in',
          user: 'John Doe',
          userEmail: 'john@example.com',
          timestamp: '2024-01-20T10:30:00Z',
          ipAddress: '192.168.1.100',
          userAgent: 'Chrome 120.0.0.0',
          details: 'Successful login from desktop',
          severity: 'info'
        },
        {
          id: 2,
          type: 'task_created',
          action: 'Task created',
          user: 'Sarah Wilson',
          userEmail: 'sarah@example.com',
          timestamp: '2024-01-20T10:25:00Z',
          ipAddress: '192.168.1.101',
          userAgent: 'Firefox 121.0.0.0',
          details: 'Created task "Implement user authentication"',
          severity: 'success'
        },
        {
          id: 3,
          type: 'user_failed_login',
          action: 'Failed login attempt',
          user: 'Unknown',
          userEmail: 'hacker@malicious.com',
          timestamp: '2024-01-20T10:20:00Z',
          ipAddress: '203.0.113.1',
          userAgent: 'curl/7.68.0',
          details: 'Multiple failed login attempts detected',
          severity: 'warning'
        },
        {
          id: 4,
          type: 'role_updated',
          action: 'User role updated',
          user: 'Admin User',
          userEmail: 'admin@example.com',
          timestamp: '2024-01-20T10:15:00Z',
          ipAddress: '192.168.1.102',
          userAgent: 'Chrome 120.0.0.0',
          details: 'Changed Mike Johnson role from User to Admin',
          severity: 'info'
        },
        {
          id: 5,
          type: 'system_error',
          action: 'System error occurred',
          user: 'System',
          userEmail: 'system@nexusflow.com',
          timestamp: '2024-01-20T10:10:00Z',
          ipAddress: 'localhost',
          userAgent: 'Server',
          details: 'Database connection timeout in user service',
          severity: 'error'
        },
        {
          id: 6,
          type: 'task_completed',
          action: 'Task completed',
          user: 'Emily Davis',
          userEmail: 'emily@example.com',
          timestamp: '2024-01-20T10:05:00Z',
          ipAddress: '192.168.1.103',
          userAgent: 'Safari 17.0',
          details: 'Completed task "Design landing page"',
          severity: 'success'
        },
        {
          id: 7,
          type: 'user_created',
          action: 'New user created',
          user: 'Admin User',
          userEmail: 'admin@example.com',
          timestamp: '2024-01-20T10:00:00Z',
          ipAddress: '192.168.1.102',
          userAgent: 'Chrome 120.0.0.0',
          details: 'Created new user account for Alex Johnson',
          severity: 'info'
        },
        {
          id: 8,
          type: 'settings_updated',
          action: 'System settings updated',
          user: 'Super Admin',
          userEmail: 'superadmin@example.com',
          timestamp: '2024-01-20T09:55:00Z',
          ipAddress: '192.168.1.104',
          userAgent: 'Chrome 120.0.0.0',
          details: 'Updated email notification settings',
          severity: 'info'
        }
      ]);
    } catch (error) {
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_login':
      case 'user_logout':
        return User;
      case 'task_created':
      case 'task_completed':
      case 'task_updated':
        return CheckCircle;
      case 'user_failed_login':
      case 'system_error':
        return AlertTriangle;
      case 'role_updated':
      case 'user_created':
      case 'user_updated':
        return Shield;
      case 'settings_updated':
        return Settings;
      default:
        return Activity;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesUser = filterUser === 'all' || activity.user === filterUser;
    
    return matchesSearch && matchesType && matchesUser;
  });

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'user_login', label: 'User Logins' },
    { value: 'task_created', label: 'Task Created' },
    { value: 'task_completed', label: 'Task Completed' },
    { value: 'user_created', label: 'User Created' },
    { value: 'role_updated', label: 'Role Updated' },
    { value: 'system_error', label: 'System Errors' }
  ];

  const uniqueUsers = [...new Set(activities.map(a => a.user))].filter(u => u !== 'System');

  const handleExportLogs = () => {
    toast.success('Activity logs exported successfully');
  };

  const handleRefreshLogs = () => {
    loadActivities();
    toast.success('Activity logs refreshed');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading activity logs...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
              <p className="mt-2 text-gray-600">
                Monitor all activities at <span className="font-semibold text-primary-600">{user?.organization}</span> in real-time
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="input"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
              </select>
              <button
                onClick={handleRefreshLogs}
                className="btn btn-outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={handleExportLogs}
                className="btn btn-primary"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-64"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input"
              >
                {activityTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="input"
              >
                <option value="all">All Users</option>
                {uniqueUsers.map(user => (
                  <option key={user} value={user}>{user}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-500">
              Showing {filteredActivities.length} of {activities.length} activities
            </div>
          </div>
        </motion.div>

        {/* Activity List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card overflow-hidden"
        >
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activities.length === 0 ? 'No activities yet' : 'No activities found'}
              </h3>
              <p className="text-gray-500">
                {activities.length === 0 
                  ? 'Activity logs will appear here as users interact with the system.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredActivities.map((activity, index) => {
                const IconComponent = getActivityIcon(activity.type);
                const timestamp = formatTimestamp(activity.timestamp);
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getSeverityColor(activity.severity)}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {activity.action}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {activity.details}
                            </p>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {timestamp.time}
                            </div>
                            <div className="mt-1">{timestamp.date}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <div className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {activity.user}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {activity.ipAddress}
                            </div>
                            <div className="hidden md:block">
                              {activity.userAgent.split(' ')[0]}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              getSeverityColor(activity.severity)
                            }`}>
                              {activity.severity.charAt(0).toUpperCase() + activity.severity.slice(1)}
                            </span>
                            <button
                              onClick={() => toast.success(`Viewing details for activity ${activity.id}`)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Summary Stats */}
        {activities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{activities.length}</div>
              <div className="text-sm text-gray-500">Total Activities</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {activities.filter(a => a.severity === 'success').length}
              </div>
              <div className="text-sm text-gray-500">Successful Actions</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {activities.filter(a => a.severity === 'warning').length}
              </div>
              <div className="text-sm text-gray-500">Warnings</div>
            </div>
            <div className="card p-4 text-center">
              <div className="text-2xl font-bold text-red-600">
                {activities.filter(a => a.severity === 'error').length}
              </div>
              <div className="text-sm text-gray-500">Errors</div>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ActivityLogsPage;