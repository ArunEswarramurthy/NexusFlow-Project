import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/layout/AdminLayout';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../hooks/useAuth';
import { 
  Plus, 
  Shield, 
  Users,
  TrendingUp,
  Activity,
  Search,
  Filter,
  Download,
  BarChart3,
  Edit,
  Trash2,
  Eye,
  Copy
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const RolesPage = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('priority');

  // Modal states
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'create', // 'create', 'edit', 'view', 'duplicate'
    role: null
  });

  useEffect(() => {
    loadRoles();
    loadStats();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/roles', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const rolesData = data.roles || data;
        setRoles(rolesData);
        
        // Calculate stats from roles data
        const stats = {
          totalRoles: rolesData.length,
          totalUsers: rolesData.reduce((sum, role) => sum + (role.userCount || 0), 0),
          activeRoles: rolesData.filter(role => role.status !== 'inactive').length,
          averagePermissions: rolesData.length > 0 ? Math.round(rolesData.reduce((sum, role) => sum + (role.permissions?.length || 0), 0) / rolesData.length) : 0,
          customRoles: rolesData.filter(role => !role.is_system).length,
          rolesWithUsers: rolesData.filter(role => (role.userCount || 0) > 0).length,
          emptyRoles: rolesData.filter(role => (role.userCount || 0) === 0).length,
          systemRoles: rolesData.filter(role => role.is_system).length
        };
        setStats(stats);
      } else {
        throw new Error('Failed to fetch roles');
      }
    } catch (error) {
      console.error('Failed to load roles:', error);
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = () => {
    // Stats are now calculated in loadRoles
  };

  // Modal handlers
  const openModal = (mode, role = null) => {
    setModalState({ isOpen: true, mode, role });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'create', role: null });
  };

  const handleModalSuccess = () => {
    loadRoles();
    loadStats();
  };

  // Action handlers
  const handleView = (role) => {
    openModal('view', role);
  };

  const handleEdit = (role) => {
    if (role.is_system) {
      toast.warning('System roles cannot be edited');
      return;
    }
    openModal('edit', role);
  };

  const handleDelete = async (role) => {
    if (role.is_system) {
      toast.error('System roles cannot be deleted');
      return;
    }
    if ((role.userCount || 0) > 0) {
      toast.error(`Cannot delete ${role.name} - it has ${role.userCount} users assigned`);
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete the "${role.name}" role?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/roles/${role.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          toast.success('Role deleted successfully');
          loadRoles();
        } else {
          throw new Error('Failed to delete role');
        }
      } catch (error) {
        console.error('Delete role error:', error);
        toast.error('Failed to delete role');
      }
    }
  };

  const handleDuplicate = (role) => {
    openModal('duplicate', role);
  };

  // Filter and sort roles
  const filteredAndSortedRoles = roles
    .filter(role => {
      const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = filterStatus === 'all' || role.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return a.priority - b.priority;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'users':
          return b.userCount - a.userCount;
        case 'permissions':
          return b.permissionCount - a.permissionCount;
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading roles...</p>
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
              <p className="mt-2 text-gray-600">
                Manage roles and permissions at <span className="font-semibold text-primary-600">{user?.organization}</span>
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => toast.success('Export functionality coming soon!')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
              <button
                onClick={() => openModal('create')}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Roles</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalRoles}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Roles</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeRoles}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Permissions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averagePermissions}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="priority">Sort by Priority</option>
                <option value="name">Sort by Name</option>
                <option value="users">Sort by Users</option>
                <option value="permissions">Sort by Permissions</option>
              </select>
            </div>
          </div>
        </div>

        {/* Roles Grid */}
        {filteredAndSortedRoles.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No roles found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first role'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => openModal('create')}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedRoles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      role.priority === 1 ? 'bg-purple-100' :
                      role.priority === 2 ? 'bg-blue-100' :
                      role.priority === 3 ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Shield className={`w-5 h-5 ${
                        role.priority === 1 ? 'text-purple-600' :
                        role.priority === 2 ? 'text-blue-600' :
                        role.priority === 3 ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                      <p className="text-sm text-gray-500">{role.userCount || 0} users</p>
                    </div>
                  </div>
                  {role.is_system && (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      System
                    </span>
                  )}
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {role.permissions?.length || 0} permissions
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {(role.permissions || []).slice(0, 2).map((permission, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    ))}
                    {(role.permissions?.length || 0) > 2 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        +{(role.permissions?.length || 0) - 2} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    role.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {role.status || 'active'}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleView(role)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(role)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      title="Edit"
                      disabled={role.is_system}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDuplicate(role)}
                      className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(role)}
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      title="Delete"
                      disabled={role.is_system || (role.userCount || 0) > 0}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Analytics Section */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Role Analytics</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.customRoles}</div>
                <div className="text-sm text-gray-500">Custom Roles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.rolesWithUsers}</div>
                <div className="text-sm text-gray-500">Roles in Use</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.emptyRoles}</div>
                <div className="text-sm text-gray-500">Empty Roles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.systemRoles}</div>
                <div className="text-sm text-gray-500">System Roles</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Role Modal */}
        {modalState.isOpen && <RoleModal modalState={modalState} closeModal={closeModal} onSuccess={handleModalSuccess} />}
      </div>
    </AdminLayout>
  );
};

// Role Modal Component
const RoleModal = ({ modalState, closeModal, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    priority: 1,
    description: '',
    permissions: [],
    color: '#6B7280'
  });
  const [loading, setLoading] = useState(false);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [showPermissions, setShowPermissions] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/roles/permissions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setAvailablePermissions(data.categories);
      }
    } catch (error) {
      console.error('Failed to load permissions:', error);
    }
  };

  useEffect(() => {
    if (modalState.role) {
      setFormData({
        name: modalState.role.name || '',
        priority: modalState.role.priority || 1,
        description: modalState.role.description || '',
        permissions: modalState.role.permissions || [],
        color: modalState.role.color || '#6B7280'
      });
    } else {
      setFormData({
        name: '',
        priority: 1,
        description: '',
        permissions: [],
        color: '#6B7280'
      });
    }
  }, [modalState.role]);

  const togglePermission = (permissionKey) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter(p => p !== permissionKey)
        : [...prev.permissions, permissionKey]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    try {
      setLoading(true);
      const url = modalState.mode === 'edit' 
        ? `http://localhost:5000/api/roles/${modalState.role.id}`
        : modalState.mode === 'duplicate'
        ? `http://localhost:5000/api/roles/${modalState.role.id}/duplicate`
        : 'http://localhost:5000/api/roles';
      
      const method = modalState.mode === 'edit' ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success(data.message);
        onSuccess();
        closeModal();
      } else {
        toast.error(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Role operation error:', error);
      toast.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  if (modalState.mode === 'view') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6">
          <h3 className="text-lg font-semibold mb-4">View Role</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Role Name</label>
              <p className="text-gray-900">{modalState.role.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <p className="text-gray-900">{modalState.role.priority}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Users</label>
              <p className="text-gray-900">{modalState.role.userCount || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Permissions</label>
              <p className="text-gray-900">{modalState.role.permissions?.length || 0} permissions</p>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button onClick={closeModal} className="btn btn-outline">Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">
          {modalState.mode === 'create' ? 'Create Role' :
           modalState.mode === 'edit' ? 'Edit Role' : 'Duplicate Role'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="input w-full"
              placeholder="Enter role name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
              className="input w-full"
            >
              <option value={1}>1 - Highest</option>
              <option value={2}>2 - High</option>
              <option value={3}>3 - Medium</option>
              <option value={4}>4 - Low</option>
              <option value={5}>5 - Lowest</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="input w-full h-20 resize-none"
              placeholder="Enter role description"
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Permissions</label>
              <button
                type="button"
                onClick={() => setShowPermissions(!showPermissions)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                {showPermissions ? 'Hide' : 'Show'} Permissions ({formData.permissions.length})
              </button>
            </div>
            
            {showPermissions && (
              <div className="border border-gray-200 rounded-md p-3 max-h-60 overflow-y-auto">
                {availablePermissions.map(category => (
                  <div key={category.name} className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">{category.name}</h4>
                    <div className="grid grid-cols-1 gap-1">
                      {category.permissions.map(permission => (
                        <label key={permission.key} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            checked={formData.permissions.includes(permission.key)}
                            onChange={() => togglePermission(permission.key)}
                            className="mr-2"
                          />
                          <span className="text-gray-700">{permission.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={closeModal} className="btn btn-outline flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary flex-1">
              {loading ? 'Saving...' : 
               modalState.mode === 'create' ? 'Create Role' :
               modalState.mode === 'edit' ? 'Update Role' : 'Duplicate Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolesPage;