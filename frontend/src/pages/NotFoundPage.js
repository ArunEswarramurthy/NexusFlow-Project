import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* 404 Animation */}
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-8xl font-bold text-primary-200 select-none"
            >
              404
            </motion.div>
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl"
            >
              🚀
            </motion.div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600">
              Oops! The page you're looking for seems to have drifted into space.
            </p>
            <p className="text-sm text-gray-500">
              Don't worry, even the best rockets sometimes take a wrong turn.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="btn btn-primary flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="btn btn-outline flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
          </div>

          {/* Search Suggestion */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-center mb-4">
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <span className="text-sm font-medium text-gray-700">
                Looking for something specific?
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link to="/login" className="text-primary-600 hover:text-primary-700 hover:underline">
                User Login
              </Link>
              <Link to="/admin/login" className="text-primary-600 hover:text-primary-700 hover:underline">
                Admin Login
              </Link>
              <Link to="/register" className="text-primary-600 hover:text-primary-700 hover:underline">
                Sign Up
              </Link>
              <Link to="/#features" className="text-primary-600 hover:text-primary-700 hover:underline">
                Features
              </Link>
            </div>
          </div>

          {/* Fun Fact */}
          <div className="text-xs text-gray-400">
            <p>💡 Fun fact: HTTP 404 errors were named after room 404 at CERN where the web was born!</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;