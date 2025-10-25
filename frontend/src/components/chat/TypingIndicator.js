import React from 'react';
import { motion } from 'framer-motion';

const TypingIndicator = ({ userName }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center space-x-3 px-4 py-2"
    >
      <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
        <span className="text-sm font-medium text-white">
          {userName?.[0]?.toUpperCase()}
        </span>
      </div>
      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">
        <div className="flex space-x-1">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            className="w-2 h-2 bg-gray-400 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="w-2 h-2 bg-gray-400 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            className="w-2 h-2 bg-gray-400 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default TypingIndicator;