import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-hot-toast';

// Initial state
const initialState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  SET_TOKEN: 'SET_TOKEN',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case AUTH_ACTIONS.SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Set token in axios headers
        authService.setAuthToken(token);
        
        // Verify token and get user data
        const userData = await authService.getProfile();
        
        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user: userData.user,
            token: token,
          },
        });
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      // Clear invalid token
      localStorage.removeItem('token');
      authService.removeAuthToken();
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Register new organization
  const register = async (registrationData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await authService.register(registrationData);
      
      toast.success('Registration successful! Please check your email for OTP verification.');
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Verify OTP
  const verifyOTP = async (email, otp) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await authService.verifyOTP(email, otp);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      authService.setAuthToken(response.token);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: response.user,
          token: response.token,
        },
      });
      
      toast.success('Account verified successfully! Welcome to NexusFlow!');
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'OTP verification failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Resend OTP
  const resendOTP = async (email) => {
    try {
      const response = await authService.resendOTP(email);
      toast.success('New OTP sent to your email');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to resend OTP';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Login
  const login = async (email, password, rememberMe = false, isAdmin = false) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await authService.login(email, password, rememberMe, isAdmin);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      authService.setAuthToken(response.token);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: response.user,
          token: response.token,
        },
      });
      
      toast.success(`Welcome back, ${response.user.firstName}!`);
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Google OAuth Login
  const googleLogin = async (googleToken) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await authService.googleAuth(googleToken);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      authService.setAuthToken(response.token);
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user: response.user,
          token: response.token,
        },
      });
      
      toast.success(`Welcome back, ${response.user.firstName}!`);
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Google login failed';
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Forgot Password
  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      toast.success('Password reset instructions sent to your email');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to send reset email';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Reset Password
  const resetPassword = async (token, password) => {
    try {
      const response = await authService.resetPassword(token, password);
      toast.success('Password reset successfully! You can now login with your new password.');
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Password reset failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('token');
      authService.removeAuthToken();
      
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      
      toast.success('Logged out successfully');
    }
  };

  // Update user profile
  const updateUser = (userData) => {
    dispatch({
      type: AUTH_ACTIONS.UPDATE_USER,
      payload: userData,
    });
  };

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!state.user || !state.user.permissions) return false;
    return state.user.permissions.includes(permission);
  };

  // Check if user is admin
  const isAdmin = () => {
    return state.user && ['Super Admin', 'Admin'].includes(state.user.role);
  };

  // Check if user is super admin
  const isSuperAdmin = () => {
    return state.user && state.user.role === 'Super Admin';
  };

  // Context value
  const value = {
    // State
    user: state.user,
    token: state.token,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    
    // Actions
    register,
    verifyOTP,
    resendOTP,
    login,
    googleLogin,
    forgotPassword,
    resetPassword,
    logout,
    updateUser,
    
    // Utilities
    hasPermission,
    isAdmin,
    isSuperAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;