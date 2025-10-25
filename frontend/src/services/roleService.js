import api from './api';

const roleService = {
  // Get all roles
  getAllRoles: async () => {
    try {
      const response = await api.get('/roles');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch roles' };
    }
  },

  // Get role by ID
  getRoleById: async (id) => {
    try {
      const response = await api.get(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch role' };
    }
  },

  // Create role
  createRole: async (roleData) => {
    try {
      const response = await api.post('/roles', roleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to create role' };
    }
  },

  // Update role
  updateRole: async (id, roleData) => {
    try {
      const response = await api.put(`/roles/${id}`, roleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update role' };
    }
  },

  // Delete role
  deleteRole: async (id) => {
    try {
      const response = await api.delete(`/roles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete role' };
    }
  },

  // Duplicate role
  duplicateRole: async (id, name) => {
    try {
      const response = await api.post(`/roles/${id}/duplicate`, { name });
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to duplicate role' };
    }
  },

  // Get all permissions
  getPermissions: async () => {
    try {
      const response = await api.get('/roles/permissions');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch permissions' };
    }
  },

  // Get role statistics
  getRoleStats: async () => {
    try {
      const response = await api.get('/roles/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch role statistics' };
    }
  }
};

export default roleService;