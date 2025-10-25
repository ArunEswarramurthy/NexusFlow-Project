const API_BASE_URL = 'http://localhost:5000/api';

class UserService {
  // Get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

  // Handle API response
  async handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    return response.json();
  }

  // Get all users
  async getAllUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      const data = await this.handleResponse(response);
      console.log('User service response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Create user
  async createUser(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Update user
  async updateUser(userId, userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(userData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }
}

export const userService = new UserService();