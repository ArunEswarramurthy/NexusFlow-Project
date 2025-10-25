import axios from 'axios';

// Create axios instance
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class AuthService {
  // Set auth token in headers
  setAuthToken(token) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }

  // Remove auth token
  removeAuthToken() {
    delete api.defaults.headers.common['Authorization'];
  }

  // Register new organization
  async register(registrationData) {
    try {
      const response = await api.post('/auth/register', registrationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Verify OTP
  async verifyOTP(email, otp) {
    try {
      const response = await api.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Resend OTP
  async resendOTP(email) {
    try {
      const response = await api.post('/auth/resend-otp', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Login
  async login(email, password, rememberMe = false, isAdmin = false) {
    try {
      const endpoint = isAdmin ? '/auth/admin-login' : '/auth/login';
      const response = await api.post(endpoint, {
        email,
        password,
        rememberMe,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Google OAuth
  async googleAuth(googleToken) {
    try {
      const response = await api.post('/auth/google', { googleToken });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Reset password
  async resetPassword(token, password) {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Logout
  async logout() {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get current user profile
  async getProfile() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Refresh token
  async refreshToken(refreshToken) {
    try {
      const response = await api.post('/auth/refresh-token', { refreshToken });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  }

  // Store token
  setToken(token) {
    localStorage.setItem('token', token);
    this.setAuthToken(token);
  }

  // Remove token
  removeToken() {
    localStorage.removeItem('token');
    this.removeAuthToken();
  }
}

export const authService = new AuthService();
export default api;