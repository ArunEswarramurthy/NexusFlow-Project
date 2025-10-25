import api from './api';

class DashboardService {
  // Dashboard Stats
  async getDashboardStats() {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      // Generate dynamic stats from actual data
      const tasks = await this.getTasks();
      const users = await this.getUsers();
      
      const activeTasks = tasks.filter(t => t.status === 'In Progress' || t.status === 'To Do').length;
      const completedTasks = tasks.filter(t => t.status === 'Completed').length;
      const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Completed').length;
      
      return {
        totalUsers: users.length,
        activeTasks,
        completedTasks,
        overdueTasks,
        recentActivity: [
          { user: 'John Doe', action: 'completed authentication system', time: '2 hours ago', type: 'completed' },
          { user: 'Sarah Wilson', action: 'started homepage design', time: '4 hours ago', type: 'created' },
          { user: 'Mike Johnson', action: 'submitted bug fix for review', time: '6 hours ago', type: 'submitted' },
          { user: 'Emily Davis', action: 'updated documentation', time: '8 hours ago', type: 'commented' },
        ]
      };
    }
  }

  // Users Management
  async getUsers() {
    try {
      const response = await api.get('/users');
      return response.data.users || [];
    } catch (error) {
      // Return mock data if API fails
      return [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '+1234567890', role: 'Admin', status: 'active', lastLogin: '2 hours ago' },
        { id: 2, firstName: 'Sarah', lastName: 'Wilson', email: 'sarah@example.com', phone: '+1234567891', role: 'User', status: 'active', lastLogin: '5 hours ago' },
        { id: 3, firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', phone: '+1234567892', role: 'User', status: 'inactive', lastLogin: '2 days ago' }
      ];
    }
  }

  async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      // Save to localStorage
      const userUsers = JSON.parse(localStorage.getItem('userCreatedUsers') || '[]');
      const newUser = {
        ...userData,
        id: Date.now(),
        status: 'active',
        lastLogin: 'Never',
        createdAt: new Date().toISOString()
      };
      userUsers.push(newUser);
      localStorage.setItem('userCreatedUsers', JSON.stringify(userUsers));
      return newUser;
    }
  }

  async updateUser(userId, userData) {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to update user');
    }
  }

  async deleteUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to delete user');
    }
  }

  // Roles Management
  async getRoles() {
    try {
      const response = await api.get('/roles');
      return response.data.roles || [];
    } catch (error) {
      return [
        { id: 1, name: 'Super Admin', priority: 1, userCount: 2, permissions: ['all'] },
        { id: 2, name: 'Admin', priority: 2, userCount: 5, permissions: ['manage_users', 'manage_tasks'] },
        { id: 3, name: 'User', priority: 3, userCount: 45, permissions: ['view_tasks', 'edit_own_tasks'] },
        { id: 4, name: 'Guest', priority: 4, userCount: 8, permissions: ['view_tasks'] }
      ];
    }
  }

  // Groups Management
  async getGroups() {
    try {
      const response = await api.get('/groups');
      return response.data.groups || [];
    } catch (error) {
      return [
        { id: 1, name: 'Engineering', description: 'Software development team', memberCount: 15, lead: 'John Doe' },
        { id: 2, name: 'Marketing', description: 'Marketing and promotion team', memberCount: 8, lead: 'Sarah Wilson' },
        { id: 3, name: 'Sales', description: 'Sales and customer relations', memberCount: 12, lead: 'Mike Johnson' },
        { id: 4, name: 'HR', description: 'Human resources department', memberCount: 5, lead: 'Emily Davis' }
      ];
    }
  }

  // Tasks Management
  async getTasks() {
    try {
      const response = await api.get('/tasks');
      return response.data.tasks || [];
    } catch (error) {
      // Get user-created tasks from localStorage
      const userTasks = JSON.parse(localStorage.getItem('userCreatedTasks') || '[]');
      
      const defaultTasks = [
        {
          id: 1,
          title: 'Implement user authentication system',
          description: 'Create secure login and registration functionality',
          status: 'In Progress',
          priority: 'High',
          assignee: 'John Doe',
          assigneeAvatar: 'JD',
          dueDate: '2025-01-25',
          createdAt: '2025-01-18',
          tags: ['Frontend', 'Security'],
          attachments: 2,
          comments: 5,
          progress: 65,
          checklist: { completed: 3, total: 5 }
        },
        {
          id: 2,
          title: 'Design homepage layout',
          description: 'Create responsive design for the main landing page',
          status: 'To Do',
          priority: 'Medium',
          assignee: 'Sarah Wilson',
          assigneeAvatar: 'SW',
          dueDate: '2025-01-30',
          createdAt: '2025-01-19',
          tags: ['Design', 'UI/UX'],
          attachments: 1,
          comments: 2,
          progress: 0,
          checklist: { completed: 0, total: 3 }
        },
        {
          id: 3,
          title: 'Fix login bug',
          description: 'Resolve issue with password reset functionality',
          status: 'Under Review',
          priority: 'Urgent',
          assignee: 'Mike Johnson',
          assigneeAvatar: 'MJ',
          dueDate: '2025-01-20',
          createdAt: '2025-01-17',
          tags: ['Bug', 'Backend'],
          attachments: 0,
          comments: 8,
          progress: 100,
          checklist: { completed: 2, total: 2 }
        }
      ];
      
      return [...defaultTasks, ...userTasks];
    }
  }

  async createTask(taskData) {
    try {
      const response = await api.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      // Save to localStorage
      const userTasks = JSON.parse(localStorage.getItem('userCreatedTasks') || '[]');
      const newTask = {
        ...taskData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        progress: 0,
        attachments: 0,
        comments: 0
      };
      userTasks.push(newTask);
      localStorage.setItem('userCreatedTasks', JSON.stringify(userTasks));
      return newTask;
    }
  }

  async updateTask(taskId, taskData) {
    try {
      const response = await api.put(`/tasks/${taskId}`, taskData);
      return response.data;
    } catch (error) {
      // Update in localStorage
      const userTasks = JSON.parse(localStorage.getItem('userCreatedTasks') || '[]');
      const taskIndex = userTasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        userTasks[taskIndex] = { ...userTasks[taskIndex], ...taskData };
        localStorage.setItem('userCreatedTasks', JSON.stringify(userTasks));
        return userTasks[taskIndex];
      }
      throw error;
    }
  }

  async deleteTask(taskId) {
    try {
      const response = await api.delete(`/tasks/${taskId}`);
      return response.data;
    } catch (error) {
      // Remove from localStorage
      const userTasks = JSON.parse(localStorage.getItem('userCreatedTasks') || '[]');
      const filteredTasks = userTasks.filter(t => t.id !== taskId);
      localStorage.setItem('userCreatedTasks', JSON.stringify(filteredTasks));
      return { success: true };
    }
  }

  // Reports
  async getReports() {
    try {
      const response = await api.get('/reports');
      return response.data.reports || [];
    } catch (error) {
      return [
        { id: 1, name: 'User Activity Report', type: 'user_activity', generatedAt: '2024-01-10', status: 'completed' },
        { id: 2, name: 'Task Completion Report', type: 'task_completion', generatedAt: '2024-01-09', status: 'completed' },
        { id: 3, name: 'Performance Analytics', type: 'performance', generatedAt: '2024-01-08', status: 'completed' }
      ];
    }
  }

  async getReportData(period = '7d') {
    try {
      const response = await api.get(`/reports/data?period=${period}`);
      return response.data;
    } catch (error) {
      // Generate dynamic mock data based on current tasks and users
      const tasks = await this.getTasks();
      const users = await this.getUsers();
      const groups = await this.getGroups();
      
      const completedTasks = tasks.filter(t => t.status === 'Completed').length;
      const activeTasks = tasks.filter(t => t.status === 'In Progress').length;
      const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Completed').length;
      
      return {
        overview: {
          totalTasks: tasks.length,
          completedTasks,
          activeTasks,
          overdueTasks,
          completionRate: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
          avgCompletionTime: 3.2,
          productivityScore: Math.min(95, Math.max(60, 100 - (overdueTasks * 5)))
        },
        trends: {
          tasksCreated: [45, 52, 38, 67, 43, 58, tasks.length],
          tasksCompleted: [38, 45, 32, 58, 41, 52, completedTasks],
          userActivity: [89, 92, 85, 94, 88, 91, Math.min(100, users.length * 10)]
        },
        topPerformers: users.slice(0, 4).map((user, index) => ({
          name: `${user.firstName} ${user.lastName}`,
          completed: Math.floor(Math.random() * 50) + 20,
          rate: Math.floor(Math.random() * 20) + 80
        })),
        groupPerformance: groups.map(group => ({
          name: group.name,
          tasks: Math.floor(Math.random() * 100) + 20,
          completion: Math.floor(Math.random() * 30) + 70,
          members: group.memberCount || Math.floor(Math.random() * 20) + 5
        }))
      };
    }
  }

  // Activity Logs
  async getActivityLogs() {
    try {
      const response = await api.get('/activity');
      return response.data.activities || [];
    } catch (error) {
      return [
        { id: 1, user: 'John Doe', action: 'User login', timestamp: '2024-01-10 14:30:00', ip: '192.168.1.1' },
        { id: 2, user: 'Sarah Wilson', action: 'Task created', timestamp: '2024-01-10 14:25:00', ip: '192.168.1.2' },
        { id: 3, user: 'Mike Johnson', action: 'User updated', timestamp: '2024-01-10 14:20:00', ip: '192.168.1.3' }
      ];
    }
  }

  // Settings
  async getSettings() {
    try {
      const response = await api.get('/settings');
      return response.data.settings || {};
    } catch (error) {
      return {
        organizationName: 'NexusFlow Demo',
        timezone: 'UTC',
        dateFormat: 'MM/DD/YYYY',
        emailNotifications: true,
        pushNotifications: false
      };
    }
  }

  async updateSettings(settings) {
    try {
      const response = await api.put('/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Failed to update settings:', error);
      // Save to localStorage as fallback
      localStorage.setItem('userSettings', JSON.stringify(settings));
      return { success: true, settings };
    }
  }

  async getUserSettings() {
    try {
      const response = await api.get('/settings');
      return response.data.settings || {};
    } catch (error) {
      console.error('Failed to load user settings:', error);
      // Get from localStorage as fallback
      const userSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
      return {
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          avatar: null,
          timezone: 'UTC',
          language: 'en'
        },
        notifications: {
          email: true,
          push: false,
          desktop: true,
          taskUpdates: true,
          mentions: true,
          deadlines: true
        },
        security: {
          twoFactorEnabled: false,
          sessionTimeout: 30,
          loginAlerts: true
        },
        privacy: {
          profileVisibility: 'team',
          activityTracking: true,
          dataSharing: false
        },
        ...userSettings
      };
    }
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;