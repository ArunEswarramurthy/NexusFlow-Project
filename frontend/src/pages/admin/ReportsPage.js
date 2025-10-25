import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/layout/AdminLayout';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../hooks/useAuth';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  Filter,
  RefreshCw,
  FileText,
  PieChart,
  Activity,
  Target
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ReportsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [reportData, setReportData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadReportData();
  }, [selectedPeriod]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const data = await dashboardService.getReportData(selectedPeriod);
      setReportData(data);
    } catch (error) {
      console.error('Failed to load report data:', error);
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    // Generate CSV data
    const csvData = [
      ['Metric', 'Value'],
      ['Total Tasks', reportData?.overview?.totalTasks || 0],
      ['Completed Tasks', reportData?.overview?.completedTasks || 0],
      ['Active Tasks', reportData?.overview?.activeTasks || 0],
      ['Overdue Tasks', reportData?.overview?.overdueTasks || 0],
      ['Completion Rate', `${reportData?.overview?.completionRate || 0}%`],
      ['Productivity Score', `${reportData?.overview?.productivityScore || 0}/100`]
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully');
  };

  const handleRefreshData = () => {
    loadReportData();
    toast.success('Data refreshed');
  };

  const periods = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'groups', label: 'Groups', icon: Target }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading reports...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="mt-2 text-gray-600">
                Comprehensive insights into <span className="font-semibold text-primary-600">{user?.organization}</span>'s performance
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="input"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
              <button
                onClick={handleRefreshData}
                className="btn btn-outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={handleExportReport}
                className="btn btn-primary"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Total Tasks',
                  value: reportData.overview.totalTasks.toLocaleString(),
                  change: '+12%',
                  changeType: 'positive',
                  icon: FileText,
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  title: 'Completed',
                  value: reportData.overview.completedTasks.toLocaleString(),
                  change: '+18%',
                  changeType: 'positive',
                  icon: CheckCircle,
                  color: 'from-green-500 to-green-600'
                },
                {
                  title: 'Active Tasks',
                  value: reportData.overview.activeTasks.toLocaleString(),
                  change: '-5%',
                  changeType: 'negative',
                  icon: Clock,
                  color: 'from-yellow-500 to-yellow-600'
                },
                {
                  title: 'Overdue',
                  value: reportData.overview.overdueTasks.toLocaleString(),
                  change: '+3%',
                  changeType: 'negative',
                  icon: AlertTriangle,
                  color: 'from-red-500 to-red-600'
                }
              ].map((metric, index) => (
                <motion.div
                  key={metric.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                      <div className="flex items-center mt-2">
                        {metric.changeType === 'positive' ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {metric.change}
                        </span>
                        <span className="text-sm text-gray-500 ml-1">vs last period</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center`}>
                      <metric.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Completion Trend</h3>
                <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">Interactive Chart</p>
                    <p className="text-sm text-gray-500">Completion Rate: {reportData.overview.completionRate}%</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="card p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Metrics</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold text-gray-900">{reportData.overview.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                      style={{ width: `${reportData.overview.completionRate}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-gray-600">Avg. Completion Time</span>
                    <span className="font-semibold text-gray-900">{reportData.overview.avgCompletionTime} days</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Productivity Score</span>
                    <span className="font-semibold text-gray-900">{reportData.overview.productivityScore}/100</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
              <div className="space-y-4">
                {reportData.topPerformers.map((performer, index) => (
                  <div key={`performer-${index}-${performer.name}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-700">
                          {performer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{performer.name}</p>
                        <p className="text-sm text-gray-500">{performer.completed} tasks completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{performer.rate}%</p>
                      <p className="text-sm text-gray-500">Success rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Groups Tab */}
        {activeTab === 'groups' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Group Performance</h3>
              <div className="space-y-4">
                {reportData.groupPerformance.map((group, index) => (
                  <div key={`group-${index}-${group.name}`} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{group.name}</h4>
                      <p className="text-sm text-gray-500">{group.members} members</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{group.tasks} tasks</p>
                      <p className="text-sm text-green-600">{group.completion}% completion</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Analytics</h3>
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Detailed user analytics coming soon</p>
            </div>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ReportsPage;