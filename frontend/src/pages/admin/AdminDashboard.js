import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { useAuth } from '../../hooks/useAuth';
import { dashboardService } from '../../services/dashboardService';
import ProgressBar from '../../components/common/ProgressBar';
import { StatsCard, ActionCard, MetricCard } from '../../components/common/ModernCard';
import { PrimaryButton, OutlineButton } from '../../components/common/ModernButton';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Activity,
  Plus,
  ArrowRight,
  Calendar,
  Target,
  BarChart3,
  FileText,
  Zap,
  Star,
  Award
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Load all data in parallel
        const [statsData, tasksData, usersData] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getTasks(),
          dashboardService.getUsers()
        ]);
        
        // Calculate real-time stats
        const activeTasks = tasksData.filter(t => 
          t.status === 'In Progress' || t.status === 'To Do'
        ).length;
        
        const completedTasks = tasksData.filter(t => 
          t.status === 'Completed'
        ).length;
        
        const overdueTasks = tasksData.filter(t => 
          new Date(t.dueDate) < new Date() && t.status !== 'Completed'
        ).length;
        
        // Generate recent activity from tasks
        const recentActivity = tasksData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map(task => {
            const createdDate = new Date(task.createdAt);
            const now = new Date();
            const diffTime = Math.abs(now - createdDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            let timeAgo;
            if (diffDays === 1) {
              timeAgo = 'Today';
            } else if (diffDays === 2) {
              timeAgo = 'Yesterday';
            } else if (diffDays <= 7) {
              timeAgo = `${diffDays - 1} days ago`;
            } else {
              timeAgo = createdDate.toLocaleDateString();
            }
            
            return {
              user: task.assignee || 'System',
              action: `${task.status === 'Completed' ? 'completed' : 'working on'} "${task.title}"`,
              time: timeAgo,
              type: task.status === 'Completed' ? 'completed' : 'created'
            };
          });
        
        // Calculate dynamic metrics
        const totalTasks = activeTasks + completedTasks + overdueTasks;
        const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        const teamEfficiency = Math.max(0, 100 - (overdueTasks * 10));
        const activeUsers = usersData.filter(u => u.status === 'active').length;
        
        setDashboardData({
          stats: {
            totalUsers: usersData.length,
            activeUsers,
            activeTasks,
            completedTasks,
            overdueTasks,
            totalTasks,
            completionRate,
            teamEfficiency
          },
          recentActivity,
          lastUpdated: new Date().toLocaleTimeString()
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const calculateChange = (current, total) => {
    if (total === 0) return { change: '0%', changeType: 'neutral' };
    const percentage = Math.round((current / total) * 100);
    return {
      change: `${percentage}%`,
      changeType: percentage > 50 ? 'positive' : percentage < 30 ? 'negative' : 'neutral'
    };
  };

  const totalTasks = (dashboardData?.stats.activeTasks || 0) + (dashboardData?.stats.completedTasks || 0) + (dashboardData?.stats.overdueTasks || 0);
  const completionRate = calculateChange(dashboardData?.stats.completedTasks || 0, totalTasks);
  const overdueRate = calculateChange(dashboardData?.stats.overdueTasks || 0, totalTasks);

  const stats = [
    {
      title: 'Total Users',
      value: dashboardData?.stats.totalUsers || '0',
      change: `${dashboardData?.stats.activeUsers || 0} active`,
      changeType: 'positive',
      icon: Users,
      gradient: 'bg-primary-500',
      bgColor: 'bg-primary-50',
      href: '/admin/users'
    },
    {
      title: 'Active Tasks',
      value: dashboardData?.stats.activeTasks || '0',
      change: `${Math.round(((dashboardData?.stats.activeTasks || 0) / Math.max(totalTasks, 1)) * 100)}% of total`,
      changeType: 'neutral',
      icon: Clock,
      gradient: 'bg-secondary-500',
      bgColor: 'bg-secondary-50',
      href: '/tasks'
    },
    {
      title: 'Completed',
      value: dashboardData?.stats.completedTasks || '0',
      change: completionRate.change + ' completion rate',
      changeType: completionRate.changeType,
      icon: CheckCircle,
      gradient: 'bg-success-500',
      bgColor: 'bg-success-50',
      href: '/tasks?status=completed'
    },
    {
      title: 'Overdue',
      value: dashboardData?.stats.overdueTasks || '0',
      change: overdueRate.change + ' of total',
      changeType: overdueRate.changeType === 'positive' ? 'negative' : 'positive',
      icon: AlertTriangle,
      gradient: 'bg-danger-500',
      bgColor: 'bg-danger-50',
      href: '/tasks?status=overdue'
    }
  ];

  const quickActions = [
    {
      title: 'Add User',
      description: 'Invite team members',
      icon: Users,
      gradient: 'bg-primary-500',
      hoverGlow: 'hover:shadow-md',
      href: '/admin/users/add'
    },
    {
      title: 'Create Task',
      description: 'Assign new work',
      icon: CheckCircle,
      gradient: 'bg-success-500',
      hoverGlow: 'hover:shadow-md',
      href: '/tasks/create'
    },
    {
      title: 'View Reports',
      description: 'Analyze performance',
      icon: BarChart3,
      gradient: 'bg-info-500',
      hoverGlow: 'hover:shadow-md',
      href: '/admin/reports'
    },
    {
      title: 'Manage Groups',
      description: 'Organize teams',
      icon: Target,
      gradient: 'bg-secondary-500',
      hoverGlow: 'hover:shadow-md',
      href: '/admin/groups'
    }
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-full bg-white min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="mt-3 text-lg text-gray-600">
                Here's what's happening at <span className="font-semibold text-primary-600">{user?.organization || 'Demo Organization'}</span> today.
              </p>
              {dashboardData?.lastUpdated && (
                <p className="mt-1 text-sm text-gray-500">
                  Last updated: {dashboardData.lastUpdated}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <Activity className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <Link to="/admin/users">
                <OutlineButton icon={Users} size="lg">
                  Manage Users
                </OutlineButton>
              </Link>
              <Link to="/tasks/create">
                <PrimaryButton icon={Plus} size="lg">
                  Create Task
                </PrimaryButton>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full"
            >
              <Link to={stat.href} className="block h-full">
                <StatsCard
                  title={stat.title}
                  value={stat.value}
                  change={stat.change}
                  changeType={stat.changeType}
                  icon={stat.icon}
                  gradient={stat.gradient}
                  bgColor={stat.bgColor}
                  delay={index * 0.1}
                />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Charts and Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {/* Task Completion Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card p-6 w-full"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
              <h3 className="text-xl font-bold text-gray-900">Task Completion Trend</h3>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                dashboardData?.stats.completionRate >= 70 ? 'bg-green-100' :
                dashboardData?.stats.completionRate >= 40 ? 'bg-yellow-100' : 'bg-red-100'
              }`}>
                <TrendingUp className={`w-5 h-5 ${
                  dashboardData?.stats.completionRate >= 70 ? 'text-green-600' :
                  dashboardData?.stats.completionRate >= 40 ? 'text-yellow-600' : 'text-red-600'
                }`} />
                <span className={`text-sm font-bold ${
                  dashboardData?.stats.completionRate >= 70 ? 'text-green-700' :
                  dashboardData?.stats.completionRate >= 40 ? 'text-yellow-700' : 'text-red-700'
                }`}>
                  {dashboardData?.stats.completionRate || 0}% completion rate
                </span>
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <p className="text-gray-800 font-bold text-lg">Interactive Chart</p>
                <p className="text-gray-600">Coming soon with real-time data</p>
                
                {/* Dynamic Progress Bars */}
                <div className="mt-6 space-y-4 max-w-sm mx-auto">
                  <ProgressBar
                    value={dashboardData?.stats.totalTasks > 0 ? Math.round(((dashboardData?.stats.completedTasks || 0) / dashboardData.stats.totalTasks) * 100) : 0}
                    color="success"
                    label={`Completed Tasks (${dashboardData?.stats.completedTasks || 0}/${dashboardData?.stats.totalTasks || 0})`}
                    size="md"
                    animated={true}
                  />
                  
                  <ProgressBar
                    value={dashboardData?.stats.totalTasks > 0 ? Math.round(((dashboardData?.stats.activeTasks || 0) / dashboardData.stats.totalTasks) * 100) : 0}
                    color="primary"
                    label={`Active Tasks (${dashboardData?.stats.activeTasks || 0}/${dashboardData?.stats.totalTasks || 0})`}
                    size="md"
                    animated={true}
                  />
                  
                  <ProgressBar
                    value={dashboardData?.stats.totalTasks > 0 ? Math.round(((dashboardData?.stats.overdueTasks || 0) / dashboardData.stats.totalTasks) * 100) : 0}
                    color="warning"
                    label={`Overdue Tasks (${dashboardData?.stats.overdueTasks || 0}/${dashboardData?.stats.totalTasks || 0})`}
                    size="md"
                    animated={true}
                  />
                  
                  <ProgressBar
                    value={dashboardData?.stats.teamEfficiency || 0}
                    color="secondary"
                    label={`Team Efficiency ${dashboardData?.stats.teamEfficiency || 0}%`}
                    size="md"
                    animated={true}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card p-4 lg:p-6 w-full"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Link to="/admin/activity-logs" className="text-sm text-primary-500 hover:text-primary-600 font-medium flex items-center">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            <div className="space-y-3">
              {dashboardData?.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-primary-600">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    activity.type === 'completed' ? 'bg-green-400' :
                    activity.type === 'created' ? 'bg-blue-400' :
                    activity.type === 'submitted' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <p className="text-sm text-gray-500">Frequently used features</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={action.title}
                to={action.href}
                className="group w-full"
              >
                <ActionCard
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  gradient={action.gradient}
                  hoverGlow={action.hoverGlow}
                  delay={0.7 + index * 0.1}
                  onClick={() => window.location.href = action.href}
                />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          <MetricCard
            title="This Week"
            value={dashboardData?.stats.completedTasks || '0'}
            icon={Calendar}
            gradient="gradient-pastel-blue"
            delay={0.8}
          />
          
          <MetricCard
            title="Team Performance"
            value={`${dashboardData?.stats.teamEfficiency || 0}%`}
            icon={Target}
            gradient="gradient-pastel-green"
            delay={0.9}
          />
          
          <MetricCard
            title="Active Users"
            value={dashboardData?.stats.activeUsers || '0'}
            icon={Activity}
            gradient="gradient-purple-pink"
            delay={1.0}
          />
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;