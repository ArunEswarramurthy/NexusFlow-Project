const API_BASE_URL = 'http://localhost:5000/api';

class TaskService {
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }

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

  async getAllTasks(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}/tasks${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  async createTask(taskData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(taskData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(taskId, taskData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(taskData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  async getTaskById(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  async submitTask(taskId, submissionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/submit`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(submissionData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error submitting task:', error);
      throw error;
    }
  }

  async approveTask(taskId, approvalData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/approve`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(approvalData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error approving task:', error);
      throw error;
    }
  }

  async rejectTask(taskId, rejectionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/reject`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(rejectionData)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error rejecting task:', error);
      throw error;
    }
  }

  async assignTask(taskId, userIds) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/assign`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ userIds })
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error assigning task:', error);
      throw error;
    }
  }

  async startTask(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/start`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error starting task:', error);
      throw error;
    }
  }

  async getTaskStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/stats`, {
        method: 'GET',
        headers: this.getAuthHeaders()
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error fetching task stats:', error);
      throw error;
    }
  }
}

export const taskService = new TaskService();