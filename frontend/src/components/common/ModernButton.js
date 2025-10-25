import React from 'react';

const ModernButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 focus:ring-purple-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-gradient-to-r from-green-600 to-teal-600 text-white hover:from-green-700 hover:to-teal-700 focus:ring-green-500 shadow-lg hover:shadow-xl',
    outline: 'border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105';
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

export const PrimaryButton = ({ children, icon: Icon, size = 'md', ...props }) => (
  <ModernButton variant="primary" size={size} icon={Icon} {...props}>
    {children}
  </ModernButton>
);

export const OutlineButton = ({ children, icon: Icon, size = 'md', ...props }) => (
  <ModernButton variant="outline" size={size} icon={Icon} {...props}>
    {children}
  </ModernButton>
);

export default ModernButton;