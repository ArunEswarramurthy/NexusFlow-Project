import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const ModernCard = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  gradient, 
  bgColor, 
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {changeType === 'positive' ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {change}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${bgColor || 'bg-gray-100'}`}>
            <Icon className={`w-6 h-6 ${gradient ? 'text-white' : 'text-gray-600'}`} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const ActionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  gradient, 
  hoverGlow, 
  delay = 0,
  onClick 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${hoverGlow}`}
    >
      <div className="flex items-center mb-4">
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${gradient || 'bg-gray-100'}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        <div className="ml-3">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  gradient, 
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${gradient || 'bg-gray-100'}`}>
            <Icon className="w-5 h-5 text-gray-600" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ModernCard;