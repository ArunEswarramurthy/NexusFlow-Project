import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', text = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg', 
    xl: 'text-xl'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`${sizeClasses.xl} border-4 border-gray-200 border-t-primary-600 rounded-full mx-auto mb-4`}
          />
          <div className="text-xl font-medium text-gray-700 mb-2">🚀 NexusFlow</div>
          <div className="text-sm text-gray-500">Streamline Teams, Amplify Productivity</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-primary-600 rounded-full mb-4`}
      />
      {text && (
        <div className={`${textSizes[size]} text-gray-600 font-medium`}>
          {text}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;