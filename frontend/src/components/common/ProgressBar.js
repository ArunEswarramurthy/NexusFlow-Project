import React from 'react';

const ProgressBar = ({ 
  value = 0, 
  color = 'primary', 
  label = '', 
  size = 'md', 
  animated = false,
  showValue = true 
}) => {
  const colorClasses = {
    primary: 'bg-gradient-to-r from-purple-500 to-pink-500',
    secondary: 'bg-gradient-to-r from-green-500 to-teal-500',
    success: 'bg-gradient-to-r from-green-400 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    danger: 'bg-gradient-to-r from-red-400 to-red-600',
    info: 'bg-gradient-to-r from-blue-400 to-blue-600'
  };

  const sizeClasses = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showValue && (
            <span className="text-sm text-gray-500">{value}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} rounded-full transition-all duration-500 ${colorClasses[color]} ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;