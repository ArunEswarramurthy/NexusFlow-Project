import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/layout/AdminLayout';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../hooks/useAuth';
import { 
  Plus, 
  Search, 
  Users, 
  Edit, 
  Trash2, 
  Eye,
  UserPlus,
  Settings,
  Folder,
  FolderOpen,
  Crown,
  Shield,
  X
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const GroupsPage = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', parentId: null });
  const [editingGroup, setEditingGroup] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupUsers, setGroupUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingGroup, setViewingGroup] = useState(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoading(true);
      
      // Load and store users for view modal
      try {
        const allUsers = await dashboardService.getUsers();
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
      } catch (error) {
        console.log('Could not load users for view');
      }
      
      // Get base groups from API
      const apiGroups = await dashboardService.getGroups();
      
      // Get user-created groups from localStorage
      const userGroups = JSON.parse(localStorage.getItem('userCreatedGroups') || '[]');
      
      // Combine both
      const allGroups = [...apiGroups, ...userGroups];
      
      // Get user assignments from localStorage
      const groupAssignments = JSON.parse(localStorage.getItem('groupUserAssignments') || '{}');
      
      const transformedGroups = allGroups.map(group => ({
        ...group,
        parentId: group.parentId || null,
        level: 0,
        isExpanded: true,
        userCount: groupAssignments[group.id] ? groupAssignments[group.id].length : (group.memberCount || group.userCount || 0),
        subGroupCount: 0
      }));
      
      // Calculate levels for hierarchy and subgroup counts
      const calculateLevels = (groups) => {
        const setLevel = (group, level = 0) => {
          group.level = level;
          const children = groups.filter(g => g.parentId === group.id);
          group.subGroupCount = children.length;
          children.forEach(child => setLevel(child, level + 1));
        };
        
        groups.filter(g => !g.parentId).forEach(g => setLevel(g));
        return groups;
      };
      
      setGroups(calculateLevels(transformedGroups));
    } catch (error) {
      console.error('Load groups error:', error);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim()) {
      toast.error('Group name is required');
      return;
    }
    
    try {
      const newGroupData = {
        id: Date.now(),
        name: newGroup.name.trim(),
        description: newGroup.description?.trim() || '',
        parentId: newGroup.parentId ? parseInt(newGroup.parentId) : null,
        memberCount: 0,
        userCount: 0,
        lead: null,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      // Save to localStorage
      const userGroups = JSON.parse(localStorage.getItem('userCreatedGroups') || '[]');
      userGroups.push(newGroupData);
      localStorage.setItem('userCreatedGroups', JSON.stringify(userGroups));
      
      // Reload groups to show the new one
      await loadGroups();
      
      toast.success('Group created successfully');
      setShowCreateModal(false);
      setNewGroup({ name: '', description: '', parentId: null });
    } catch (error) {
      console.error('Create group error:', error);
      toast.error('Failed to create group');
    }
  };

  const handleEditGroup = (group) => {
    setEditingGroup({ ...group });
    setShowEditModal(true);
  };
  
  const handleUpdateGroup = async () => {
    if (!editingGroup.name.trim()) {
      toast.error('Group name is required');
      return;
    }
    
    try {
      // Update in localStorage if it's a user-created group
      const userGroups = JSON.parse(localStorage.getItem('userCreatedGroups') || '[]');
      const groupIndex = userGroups.findIndex(g => g.id === editingGroup.id);
      
      if (groupIndex !== -1) {
        userGroups[groupIndex] = {
          ...userGroups[groupIndex],
          name: editingGroup.name.trim(),
          description: editingGroup.description?.trim() || '',
          parentId: editingGroup.parentId ? parseInt(editingGroup.parentId) : null
        };
        localStorage.setItem('userCreatedGroups', JSON.stringify(userGroups));
      }
      
      // Reload groups
      await loadGroups();
      
      toast.success('Group updated successfully');
      setShowEditModal(false);
      setEditingGroup(null);
    } catch (error) {
      console.error('Update group error:', error);
      toast.error('Failed to update group');
    }
  };

  const handleViewGroup = async (group) => {
    try {
      setViewingGroup({
        ...group,
        userCount: group.userCount || 0,
        subGroupCount: group.subGroupCount || 0,
        status: 'active'
      });
      setShowViewModal(true);
    } catch (error) {
      console.error('View group error:', error);
      toast.error('Failed to load group details');
    }
  };

  const handleManageUsers = async (group) => {
    try {
      setSelectedGroup(group);
      
      // Get users data and store in localStorage for view modal
      const allUsers = await dashboardService.getUsers();
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
      
      // Get current group users from localStorage
      const groupAssignments = JSON.parse(localStorage.getItem('groupUserAssignments') || '{}');
      const assignedUserIds = groupAssignments[group.id] || [];
      const currentUsers = allUsers.filter(user => assignedUserIds.includes(user.id));
      const availableUsers = allUsers.filter(user => !assignedUserIds.includes(user.id));
      
      setGroupUsers(currentUsers);
      setAvailableUsers(availableUsers);
      setShowUserModal(true);
    } catch (error) {
      console.error('Manage users error:', error);
      toast.error('Failed to load group users');
    }
  };

  const handleAddUserToGroup = async (userId) => {
    try {
      const userToAdd = availableUsers.find(u => u.id === userId);
      if (userToAdd) {
        const newGroupUsers = [...groupUsers, userToAdd];
        setGroupUsers(newGroupUsers);
        setAvailableUsers(availableUsers.filter(u => u.id !== userId));
        
        // Save to localStorage
        const groupAssignments = JSON.parse(localStorage.getItem('groupUserAssignments') || '{}');
        groupAssignments[selectedGroup.id] = newGroupUsers.map(u => u.id);
        localStorage.setItem('groupUserAssignments', JSON.stringify(groupAssignments));
        
        // Update group user count in localStorage
        const userGroups = JSON.parse(localStorage.getItem('userCreatedGroups') || '[]');
        const groupIndex = userGroups.findIndex(g => g.id === selectedGroup.id);
        if (groupIndex !== -1) {
          userGroups[groupIndex].userCount = newGroupUsers.length;
          localStorage.setItem('userCreatedGroups', JSON.stringify(userGroups));
        }
        
        // Update state
        setGroups(groups.map(g => 
          g.id === selectedGroup.id 
            ? { ...g, userCount: newGroupUsers.length }
            : g
        ));
        
        toast.success('User added to group successfully');
      }
    } catch (error) {
      console.error('Add user error:', error);
      toast.error('Failed to add user to group');
    }
  };

  const handleRemoveUserFromGroup = async (userId) => {
    try {
      const userToRemove = groupUsers.find(u => u.id === userId);
      if (userToRemove) {
        const newGroupUsers = groupUsers.filter(u => u.id !== userId);
        setGroupUsers(newGroupUsers);
        setAvailableUsers([...availableUsers, userToRemove]);
        
        // Save to localStorage
        const groupAssignments = JSON.parse(localStorage.getItem('groupUserAssignments') || '{}');
        groupAssignments[selectedGroup.id] = newGroupUsers.map(u => u.id);
        localStorage.setItem('groupUserAssignments', JSON.stringify(groupAssignments));
        
        // Update group user count in localStorage
        const userGroups = JSON.parse(localStorage.getItem('userCreatedGroups') || '[]');
        const groupIndex = userGroups.findIndex(g => g.id === selectedGroup.id);
        if (groupIndex !== -1) {
          userGroups[groupIndex].userCount = newGroupUsers.length;
          localStorage.setItem('userCreatedGroups', JSON.stringify(userGroups));
        }
        
        // Update state
        setGroups(groups.map(g => 
          g.id === selectedGroup.id 
            ? { ...g, userCount: newGroupUsers.length }
            : g
        ));
        
        toast.success('User removed from group successfully');
      }
    } catch (error) {
      console.error('Remove user error:', error);
      toast.error('Failed to remove user from group');
    }
  };

  const handleDeleteGroup = async (group) => {
    if (window.confirm(`Are you sure you want to delete "${group.name}"? This action cannot be undone.`)) {
      try {
        // Remove from localStorage if it's a user-created group
        const userGroups = JSON.parse(localStorage.getItem('userCreatedGroups') || '[]');
        
        const removeGroupAndChildren = (groupId) => {
          const children = userGroups.filter(g => g.parentId === groupId);
          children.forEach(child => removeGroupAndChildren(child.id));
          
          const index = userGroups.findIndex(g => g.id === groupId);
          if (index !== -1) {
            userGroups.splice(index, 1);
          }
        };
        
        removeGroupAndChildren(group.id);
        localStorage.setItem('userCreatedGroups', JSON.stringify(userGroups));
        
        // Reload groups
        await loadGroups();
        
        toast.success('Group deleted successfully');
      } catch (error) {
        console.error('Delete group error:', error);
        toast.error('Failed to delete group');
      }
    }
  };

  const toggleGroupExpansion = (groupId) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, isExpanded: !group.isExpanded }
        : group
    ));
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (group.description && group.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getVisibleGroups = () => {
    const result = [];
    const addGroup = (group) => {
      result.push(group);
      if (group.isExpanded) {
        const children = filteredGroups.filter(g => g.parentId === group.id)
          .sort((a, b) => a.name.localeCompare(b.name));
        children.forEach(addGroup);
      }
    };
    
    const rootGroups = filteredGroups.filter(g => g.parentId === null)
      .sort((a, b) => a.name.localeCompare(b.name));
    rootGroups.forEach(addGroup);
    return result;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading groups...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Group Management</h1>
              <p className="mt-2 text-gray-600">
                Organize teams at <span className="font-semibold text-primary-600">{user?.organization}</span> into hierarchical groups
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </button>
          </div>
        </div>

        {/* Search and Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10 w-64"
              />
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div>Total Groups: <span className="font-medium text-gray-900">{groups.length}</span></div>
              <div>Total Users: <span className="font-medium text-gray-900">{groups.reduce((sum, g) => sum + g.userCount, 0)}</span></div>
            </div>
          </div>
        </motion.div>

        {/* Groups List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card overflow-hidden"
        >
          {getVisibleGroups().length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {groups.length === 0 ? 'No groups yet' : 'No groups found'}
              </h3>
              <p className="text-gray-500 mb-6">
                {groups.length === 0 
                  ? 'Create your first group to organize your team.'
                  : 'Try adjusting your search criteria.'
                }
              </p>
              {groups.length === 0 && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Group
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {getVisibleGroups().map((group, index) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 ${
                    group.level === 0 ? 'border-l-primary-500 bg-primary-50/30' :
                    group.level === 1 ? 'border-l-secondary-400 bg-secondary-50/20' :
                    'border-l-gray-300 bg-gray-50/20'
                  }`}
                  style={{ paddingLeft: `${24 + group.level * 32}px` }}
                  onClick={() => toggleGroupExpansion(group.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {group.subGroupCount > 0 ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleGroupExpansion(group.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          {group.isExpanded ? (
                            <FolderOpen className="w-5 h-5 text-primary-600" />
                          ) : (
                            <Folder className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                      ) : (
                        <div className="w-7 h-7 flex items-center justify-center">
                          {group.level > 0 ? (
                            <div className="w-1 h-4 bg-gray-300 rounded-full" />
                          ) : (
                            <div className="w-2 h-2 bg-gray-300 rounded-full" />
                          )}
                        </div>
                      )}
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-semibold text-gray-900 ${
                            group.level === 0 ? 'text-lg' : group.level === 1 ? 'text-base' : 'text-sm'
                          }`}>
                            {group.name}
                          </h3>
                          {group.level === 0 && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                          {group.level > 0 && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Level {group.level}
                            </span>
                          )}
                        </div>
                        <p className={`text-gray-600 mt-1 ${
                          group.level === 0 ? 'text-sm' : 'text-xs'
                        }`}>
                          {group.description || 'No description'}
                        </p>
                        <div className={`flex items-center space-x-4 mt-2 text-gray-500 ${
                          group.level === 0 ? 'text-sm' : 'text-xs'
                        }`}>
                          <div className="flex items-center">
                            <Users className={`mr-1 ${group.level === 0 ? 'w-4 h-4' : 'w-3 h-3'}`} />
                            {group.userCount} users
                          </div>
                          {group.subGroupCount > 0 && (
                            <div className="flex items-center">
                              <Folder className={`mr-1 ${group.level === 0 ? 'w-4 h-4' : 'w-3 h-3'}`} />
                              {group.subGroupCount} subgroups
                            </div>
                          )}
                          {group.parentId && (
                            <div className="flex items-center text-primary-600">
                              <span className="text-xs">↳ Sub-group</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleViewGroup(group)}
                        className="btn btn-outline btn-sm"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                      <button
                        onClick={() => handleManageUsers(group)}
                        className="btn btn-secondary btn-sm"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Users
                      </button>
                      <button
                        onClick={() => handleEditGroup(group)}
                        className="btn btn-primary btn-sm"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(group)}
                        className="btn btn-danger btn-sm"
                        disabled={group.userCount > 0 || group.subGroupCount > 0}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Create Group Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Group</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    className="input w-full"
                    placeholder="Enter group name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    className="input w-full h-20 resize-none"
                    placeholder="Enter group description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Group
                  </label>
                  <select
                    value={newGroup.parentId || ''}
                    onChange={(e) => setNewGroup({ ...newGroup, parentId: e.target.value || null })}
                    className="input w-full"
                  >
                    <option value="">No parent (Top level)</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>
                        {'  '.repeat(group.level)}{group.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewGroup({ name: '', description: '', parentId: null });
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  className="btn btn-primary"
                >
                  Create Group
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Edit Group Modal */}
        {showEditModal && editingGroup && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Group</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Group Name *
                  </label>
                  <input
                    type="text"
                    value={editingGroup.name || ''}
                    onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })}
                    className="input w-full"
                    placeholder="Enter group name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editingGroup.description || ''}
                    onChange={(e) => setEditingGroup({ ...editingGroup, description: e.target.value })}
                    className="input w-full h-20 resize-none"
                    placeholder="Enter group description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Group
                  </label>
                  <select
                    value={editingGroup.parentId || ''}
                    onChange={(e) => setEditingGroup({ ...editingGroup, parentId: e.target.value || null })}
                    className="input w-full"
                  >
                    <option value="">No parent (Top level)</option>
                    {groups.filter(g => g.id !== editingGroup.id).map(group => (
                      <option key={group.id} value={group.id}>
                        {'  '.repeat(group.level)}{group.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingGroup(null);
                  }}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateGroup}
                  className="btn btn-primary"
                >
                  Update Group
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* View Group Modal */}
        {showViewModal && viewingGroup && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Group Details</h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{viewingGroup.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{viewingGroup.description || 'No description'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">Team</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Parent Group</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {viewingGroup.parentId ? groups.find(g => g.id === viewingGroup.parentId)?.name || 'Unknown' : 'None (Top level)'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Group Lead</label>
                  <p className="mt-1 text-sm text-gray-900">No lead assigned</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Users in Group ({viewingGroup.userCount})</label>
                  <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                    {(() => {
                      const groupAssignments = JSON.parse(localStorage.getItem('groupUserAssignments') || '{}');
                      const assignedUserIds = groupAssignments[viewingGroup.id] || [];
                      
                      if (assignedUserIds.length === 0) {
                        return <p className="text-sm text-gray-500">No users assigned</p>;
                      }
                      
                      // Get user data from localStorage or use mock data
                      const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
                      const assignedUsers = assignedUserIds.map(id => 
                        allUsers.find(u => u.id === id) || { id, firstName: 'User', lastName: id, email: `user${id}@example.com` }
                      );
                      
                      return (
                        <div className="space-y-1">
                          {assignedUsers.map(user => (
                            <div key={user.id} className="flex items-center space-x-2 p-1">
                              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-xs font-medium text-primary-700">
                                {user.firstName[0]}{user.lastName[0]}
                              </div>
                              <span className="text-sm text-gray-900">{user.firstName} {user.lastName}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Users</label>
                    <p className="mt-1 text-2xl font-bold text-primary-600">{viewingGroup.userCount}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subgroups</label>
                    <p className="mt-1 text-2xl font-bold text-secondary-600">{viewingGroup.subGroupCount}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    viewingGroup.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {viewingGroup.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(viewingGroup.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="btn btn-outline"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* User Management Modal */}
        {showUserModal && selectedGroup && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Manage Users - {selectedGroup.name}
                </h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Current Users */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Current Users ({groupUsers.length})
                </h4>
                {groupUsers.length === 0 ? (
                  <p className="text-gray-500 text-sm">No users in this group</p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {groupUsers.map(user => (
                      <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {user.firstName[0]}{user.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveUserFromGroup(user.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Available Users */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Available Users
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableUsers.length === 0 ? (
                    <p className="text-gray-500 text-sm">No available users to add</p>
                  ) : availableUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddUserToGroup(user.id)}
                        className="btn btn-primary btn-sm"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                }
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="btn btn-outline"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default GroupsPage;