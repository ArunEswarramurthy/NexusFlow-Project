import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/layout/AdminLayout';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../hooks/useAuth';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, UserPlus, Mail, Phone, User, Shield, Users as UsersIcon, X, Check, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const UsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    employeeId: '',
    role: '',
    groups: '',
    status: ''
  });
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', employeeId: '', password: '', role: 'User', groups: [], status: 'active'
  });

  const roles = ['Super Admin', 'Admin', 'User', 'Guest'];
  const statuses = ['active', 'inactive', 'suspended'];

  const clearFilters = () => {
    setFilters({
      employeeId: '',
      role: '',
      groups: '',
      status: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(filter => filter !== '');
  const [availableGroups, setAvailableGroups] = useState(['Engineering', 'Marketing', 'Sales', 'HR']);

  useEffect(() => {
    const loadAvailableGroups = async () => {
      try {
        const groupsData = await dashboardService.getGroups();
        const userGroups = JSON.parse(localStorage.getItem('userCreatedGroups') || '[]');
        const allGroups = [...groupsData, ...userGroups];
        setAvailableGroups(allGroups.map(g => g.name));
      } catch (error) {
        console.error('Failed to load groups:', error);
      }
    };
    loadAvailableGroups();
  }, []);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = users.filter(user =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply filters
    if (filters.employeeId) {
      filtered = filtered.filter(user => 
        user.employeeId && user.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase())
      );
    }
    if (filters.role) {
      filtered = filtered.filter(user => user.role === filters.role);
    }
    if (filters.groups) {
      filtered = filtered.filter(user => 
        user.groups && user.groups.some(group => 
          group.toLowerCase().includes(filters.groups.toLowerCase())
        )
      );
    }
    if (filters.status) {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filters]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const usersData = await dashboardService.getUsers();
      const usersWithGroups = usersData.map(user => ({
        ...user,
        groups: user.groups || ['General']
      }));
      setUsers(usersWithGroups);
      setFilteredUsers(usersWithGroups);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          employeeId: formData.employeeId,
          password: formData.password,
          phone: formData.phone,
          role: formData.role,
          jobTitle: '',
          department: ''
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        await loadUsers();
        setShowAddModal(false);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', employeeId: '', password: '', role: 'User', groups: [], status: 'active' });
        toast.success('User created successfully');
      } else {
        console.error('Server response:', data);
        throw new Error(data.error || data.message || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      toast.error(error.message || 'Failed to create user');
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    try {
      await dashboardService.updateUser(selectedUser.id, formData);
      await loadUsers(); // Reload users
      setShowEditModal(false);
      setSelectedUser(null);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', employeeId: '', password: '', role: 'User', groups: [], status: 'active' });
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error(error.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await dashboardService.deleteUser(userId);
        await loadUsers(); // Reload users
        toast.success('User deleted successfully');
      } catch (error) {
        console.error('Failed to delete user:', error);
        toast.error(error.message || 'Failed to delete user');
      }
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      employeeId: user.employeeId || '',
      password: '',
      role: user.role,
      groups: user.groups,
      status: user.status
    });
    setShowEditModal(true);
  };

  const UserModal = ({ isOpen, onClose, onSubmit, title, isEdit = false }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={onSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="input"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="input"
                    placeholder="Last name"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID *</label>
                <input
                  type="text"
                  required
                  value={formData.employeeId}
                  onChange={(e) => {
                    const empId = e.target.value;
                    setFormData({...formData, employeeId: empId, password: empId});
                  }}
                  className="input"
                  placeholder="EMP001"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  disabled={isEdit}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`input ${isEdit ? 'bg-gray-100' : ''}`}
                  placeholder="email@example.com"
                />
              </div>
              
              {!isEdit && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="text"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="input bg-gray-50"
                    placeholder="Auto-filled with Employee ID"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Default password is set to Employee ID</p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="input"
                  placeholder="+1234567890"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                <select
                  required
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="input"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Groups</label>
                <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {availableGroups.map(group => (
                    <label key={group} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.groups.includes(group)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, groups: [...formData.groups, group]});
                          } else {
                            setFormData({...formData, groups: formData.groups.filter(g => g !== group)});
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{group}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Select groups for this user</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="input"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={onClose} className="btn btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">
                  {isEdit ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600">Manage team members at <span className="font-semibold text-primary-600">{user?.organization}</span></p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${hasActiveFilters ? 'btn-primary' : 'btn-outline'} flex items-center gap-2`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-white text-primary-600 text-xs px-1.5 py-0.5 rounded-full font-medium">
                {Object.values(filters).filter(f => f !== '').length}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-4 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Filter Users</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all filters
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
                <input
                  type="text"
                  placeholder="Filter by Employee ID"
                  value={filters.employeeId}
                  onChange={(e) => setFilters({...filters, employeeId: e.target.value})}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => setFilters({...filters, role: e.target.value})}
                  className="input"
                >
                  <option value="">All Roles</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Groups</label>
                <input
                  type="text"
                  placeholder="Filter by Group"
                  value={filters.groups}
                  onChange={(e) => setFilters({...filters, groups: e.target.value})}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="input"
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Groups</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <UsersIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {hasActiveFilters ? 'No users match your filters' : 'No users found'}
                        </h3>
                        <p className="text-gray-500">
                          {hasActiveFilters ? 'Try adjusting your filter criteria.' : 'Get started by adding your first user.'}
                        </p>
                        {hasActiveFilters && (
                          <button
                            onClick={clearFilters}
                            className="mt-4 btn btn-outline btn-sm"
                          >
                            Clear filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                          <span className="text-sm font-medium text-primary-700">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">{user.employeeId || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'Super Admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'Admin' ? 'bg-blue-100 text-blue-800' :
                        user.role === 'User' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.groups.map((group, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                            {group}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <UserModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddUser}
          title="Add New User"
        />

        <UserModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditUser}
          title="Edit User"
          isEdit={true}
        />
      </div>
    </AdminLayout>
  );
};

export default UsersPage;