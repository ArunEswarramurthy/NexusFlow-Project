import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Users, Check, Search, ChevronDown, ChevronRight } from 'lucide-react';
import roleService from '../../services/roleService';
import { toast } from 'react-hot-toast';

const RoleModal = ({ 
  isOpen, 
  onClose, 
  mode, // 'create', 'edit', 'view', 'duplicate'
  role = null,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    priority: 5,
    description: '',
    permissions: [],
    color: '#6366F1',
    status: 'active'
  });
  
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});

  const colorOptions = [
    { value: '#8B5CF6', name: 'Purple', class: 'bg-purple-500' },
    { value: '#3B82F6', name: 'Blue', class: 'bg-blue-500' },
    { value: '#10B981', name: 'Green', class: 'bg-green-500' },
    { value: '#6B7280', name: 'Gray', class: 'bg-gray-500' },
    { value: '#6366F1', name: 'Indigo', class: 'bg-indigo-500' },
    { value: '#EF4444', name: 'Red', class: 'bg-red-500' },
    { value: '#F97316', name: 'Orange', class: 'bg-orange-500' },
    { value: '#EAB308', name: 'Yellow', class: 'bg-yellow-500' },
    { value: '#EC4899', name: 'Pink', class: 'bg-pink-500' },
    { value: '#14B8A6', name: 'Teal', class: 'bg-teal-500' }
  ];

  useEffect(() => {
    if (isOpen) {
      loadPermissions();
      if (role && (mode === 'edit' || mode === 'view' || mode === 'duplicate')) {
        setFormData({
          name: mode === 'duplicate' ? `${role.name} (Copy)` : role.name,
          priority: mode === 'duplicate' ? role.priority + 1 : role.priority,
          description: role.description || '',
          permissions: role.permissions || [],
          color: role.color || '#6366F1',
          status: role.status || 'active'
        });
      } else {
        setFormData({
          name: '',
          priority: 5,
          description: '',
          permissions: [],
          color: '#6366F1',
          status: 'active'
        });
      }
    }
  }, [isOpen, role, mode]);

  const loadPermissions = async () => {
    try {
      setLoadingPermissions(true);
      const response = await roleService.getPermissions();
      setPermissions(response.categories || []);
      
      // Expand all categories by default
      const expanded = {};
      response.categories?.forEach(category => {
        expanded[category.name] = true;
      });
      setExpandedCategories(expanded);
    } catch (error) {
      toast.error('Failed to load permissions');
    } finally {
      setLoadingPermissions(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Role name is required');
      return;
    }

    try {
      setLoading(true);
      let response;

      if (mode === 'create' || mode === 'duplicate') {
        response = await roleService.createRole(formData);
      } else if (mode === 'edit') {
        response = await roleService.updateRole(role.id, formData);
      }

      toast.success(response.message || 'Role saved successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.error || 'Failed to save role');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (permissionKey) => {
    if (mode === 'view') return;
    
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter(p => p !== permissionKey)
        : [...prev.permissions, permissionKey]
    }));
  };

  const handleCategoryToggle = (categoryName) => {
    if (mode === 'view') return;
    
    const category = permissions.find(c => c.name === categoryName);
    if (!category) return;

    const categoryPermissions = category.permissions.map(p => p.key);
    const allSelected = categoryPermissions.every(p => formData.permissions.includes(p));

    setFormData(prev => ({
      ...prev,
      permissions: allSelected
        ? prev.permissions.filter(p => !categoryPermissions.includes(p))
        : [...new Set([...prev.permissions, ...categoryPermissions])]
    }));
  };

  const toggleCategoryExpansion = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  const filteredPermissions = permissions.map(category => ({
    ...category,
    permissions: category.permissions.filter(permission =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.key.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.permissions.length > 0);

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Create New Role';
      case 'edit': return 'Edit Role';
      case 'view': return 'View Role Details';
      case 'duplicate': return 'Duplicate Role';
      default: return 'Role';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {getModalTitle()}
                </h3>
                {role && mode === 'view' && (
                  <p className="text-sm text-gray-500">
                    {role.userCount} users assigned
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex h-[calc(90vh-140px)]">
            {/* Left Panel - Basic Info */}
            <div className="w-1/3 p-6 border-r border-gray-200 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter role name"
                    disabled={mode === 'view'}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Level
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={mode === 'view'}
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers = higher priority</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    rows="3"
                    placeholder="Enter role description"
                    disabled={mode === 'view'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Theme
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                        className={`w-8 h-8 rounded-lg ${color.class} ${
                          formData.color === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                        disabled={mode === 'view'}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {mode !== 'view' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                )}

                {/* Permission Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Permissions</span>
                    <span className="text-sm text-gray-500">
                      {formData.permissions.length} selected
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-indigo-500"
                      style={{ 
                        width: `${permissions.length > 0 
                          ? (formData.permissions.length / permissions.reduce((sum, cat) => sum + cat.permissions.length, 0)) * 100 
                          : 0}%` 
                      }}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Right Panel - Permissions */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-medium text-gray-900">Permissions</h4>
                  {mode !== 'view' && (
                    <div className="text-sm text-gray-500">
                      {formData.permissions.length} of {permissions.reduce((sum, cat) => sum + cat.permissions.length, 0)} selected
                    </div>
                  )}
                </div>
                
                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search permissions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              {loadingPermissions ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPermissions.map((category) => {
                    const categoryPermissions = category.permissions.map(p => p.key);
                    const selectedCount = categoryPermissions.filter(p => formData.permissions.includes(p)).length;
                    const allSelected = selectedCount === categoryPermissions.length;
                    const someSelected = selectedCount > 0 && selectedCount < categoryPermissions.length;
                    const isExpanded = expandedCategories[category.name];

                    return (
                      <div key={category.name} className="border border-gray-200 rounded-lg">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={() => toggleCategoryExpansion(category.name)}
                                className="mr-2 p-1 hover:bg-gray-200 rounded"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                              <h5 className="font-medium text-gray-900">{category.name}</h5>
                              <span className="ml-2 text-sm text-gray-500">
                                ({category.permissions.length})
                              </span>
                            </div>
                            {mode !== 'view' && (
                              <button
                                type="button"
                                onClick={() => handleCategoryToggle(category.name)}
                                className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                  allSelected
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : someSelected
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {allSelected ? 'Deselect All' : 'Select All'}
                                {selectedCount > 0 && (
                                  <span className="ml-1">({selectedCount})</span>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="p-4 space-y-2">
                            {category.permissions.map((permission) => (
                              <div
                                key={permission.key}
                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                  formData.permissions.includes(permission.key)
                                    ? 'border-indigo-200 bg-indigo-50'
                                    : 'border-gray-200 hover:bg-gray-50'
                                } ${mode === 'view' ? '' : 'cursor-pointer'}`}
                                onClick={() => handlePermissionToggle(permission.key)}
                              >
                                <div className="flex items-center">
                                  <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                                    formData.permissions.includes(permission.key)
                                      ? 'border-indigo-500 bg-indigo-500'
                                      : 'border-gray-300'
                                  }`}>
                                    {formData.permissions.includes(permission.key) && (
                                      <Check className="w-3 h-3 text-white" />
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {permission.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      {permission.description}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {mode === 'view' ? 'Close' : 'Cancel'}
            </button>
            {mode !== 'view' && (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                )}
                {mode === 'create' || mode === 'duplicate' ? 'Create Role' : 'Update Role'}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RoleModal;