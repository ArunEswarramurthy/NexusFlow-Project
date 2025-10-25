import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';
import { useChat } from '../../context/ChatContext';

const ConnectionStatus = () => {
  const { isConnected } = useChat();

  return (
    <AnimatePresence>
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className="bg-danger-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
            <WifiOff className="w-4 h-4" />
            <span className="text-sm font-medium">Connecting...</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectionStatus;