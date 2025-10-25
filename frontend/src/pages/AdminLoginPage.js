import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import NexusFlowLogo from '../components/common/NexusFlowLogo';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield,
  ArrowLeft,
  AlertCircle,
  Crown,
  Sparkles,
  Zap
} from 'lucide-react';

const AdminLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm({
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password, data.rememberMe, true); // isAdmin = true
      navigate('/redirect');
    } catch (error) {
      console.error('Admin login error:', error);
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      
      <div className="max-w-md w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center text-primary-500 hover:text-primary-600 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <motion.div 
            className="flex items-center justify-center space-x-3 mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <NexusFlowLogo size={48} />
            <span className="text-3xl font-bold text-gray-900">
              NexusFlow
            </span>
          </motion.div>
          
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-50 border border-primary-200 text-primary-600 text-sm font-medium mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Administrator Portal
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Sign In
          </h1>
          <p className="text-gray-600">
            Access your admin dashboard with secure credentials
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                  className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter your admin email"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required'
                  })}
                  className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-full py-3 px-6 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Signing in...
                </div>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2 inline" />
                  Admin Sign In
                </>
              )}
            </motion.button>


          </form>

          {/* User Login Link */}
          <div className="mt-6 text-center">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                Not an administrator?
              </p>
              <Link 
                to="/login" 
                className="text-primary-500 hover:text-primary-600 font-medium text-sm transition-colors"
              >
                ← User Login
              </Link>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Need to create an organization?{' '}
              <Link to="/register" className="text-primary-500 hover:text-primary-600 font-medium transition-colors">
                Get started
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <Shield className="w-5 h-5 text-primary-500 mr-2" />
              <h3 className="text-sm font-medium text-gray-900">
                Administrator Access Only
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              This portal is restricted to organization administrators. 
              All login attempts are monitored and logged for security purposes.
            </p>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-center text-xs text-gray-500"
        >
          <p>🔒 Enhanced security for administrative access</p>
        </motion.div>
      </div>

    </div>
  );
};

export default AdminLoginPage;