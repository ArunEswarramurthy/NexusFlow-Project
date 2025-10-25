const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const groupService = {
  // Get all groups
  async getGroups() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/groups`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data.groups || [],
        message: 'Groups loaded successfully'
      };
    } catch (error) {
      console.error('Get groups error:', error);
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to load groups'
      };
    }
  },

  // Get group by ID
  async getGroupById(groupId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch group details');
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data.group || {},
        message: 'Group details loaded successfully'
      };
    } catch (error) {
      console.error('Get group by ID error:', error);
      return {
        success: false,
        data: {},
        message: error.message || 'Failed to load group details'
      };
    }
  },

  // Create new group
  async createGroup(groupData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/groups`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(groupData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create group');
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data.group || {},
        message: data.message || 'Group created successfully'
      };
    } catch (error) {
      console.error('Create group error:', error);
      return {
        success: false,
        data: {},
        message: error.message || 'Failed to create group'
      };
    }
  },

  // Update group
  async updateGroup(groupId, groupData) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(groupData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update group');
      }
      
      const data = await response.json();
      return {
        success: true,
        data: data.group || {},
        message: data.message || 'Group updated successfully'
      };
    } catch (error) {
      console.error('Update group error:', error);
      return {
        success: false,
        data: {},
        message: error.message || 'Failed to update group'
      };
    }
  },

  // Delete group
  async deleteGroup(groupId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete group');
      }
      
      const data = await response.json();
      return {
        success: true,
        message: data.message || 'Group deleted successfully'
      };
    } catch (error) {
      console.error('Delete group error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete group'
      };
    }
  },

  // Add user to group
  async addUserToGroup(groupId, userId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user to group');
      }
      
      const data = await response.json();
      return {
        success: true,
        message: data.message || 'User added to group successfully'
      };
    } catch (error) {
      console.error('Add user to group error:', error);
      return {
        success: false,
        message: error.message || 'Failed to add user to group'
      };
    }
  },

  // Remove user from group
  async removeUserFromGroup(groupId, userId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/groups/${groupId}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove user from group');
      }
      
      const data = await response.json();
      return {
        success: true,
        message: data.message || 'User removed from group successfully'
      };
    } catch (error) {
      console.error('Remove user from group error:', error);
      return {
        success: false,
        message: error.message || 'Failed to remove user from group'
      };
    }
  }
};

export default groupService;