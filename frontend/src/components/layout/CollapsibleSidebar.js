import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const CollapsibleSidebar = ({ navigation, user, isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const gradients = [
    'from-blue-500 to-cyan-400',
    'from-emerald-500 to-teal-400', 
    'from-purple-500 to-pink-400',
    'from-pink-500 to-rose-400',
    'from-amber-500 to-orange-400',
    'from-orange-500 to-red-400',
    'from-indigo-500 to-blue-400',
    'from-violet-500 to-purple-400',
    'from-cyan-500 to-blue-400'
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed inset-y-0 left-0 z-50 bg-white shadow-2xl border-r border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 bg-gradient-to-r from-primary-600 to-primary-500">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-3"
            >
              <span className="text-xl font-bold text-white">NexusFlow</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto"
          >
            <span className="text-lg font-bold text-white">N</span>
          </motion.div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/20 transition-colors text-white"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-3">
        <div className="space-y-2">
          {navigation.map((item, index) => {
            const isActive = location.pathname === item.href;
            const gradient = gradients[index % gradients.length];
            
            return (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Link
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className={`relative z-10 ${isCollapsed ? 'mx-auto' : 'mr-3'}`}>
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} ${isActive ? 'shadow-lg' : 'shadow-md'}`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-10"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Active background gradient */}
                  {isActive && (
                    <motion.div
                      layoutId="activeBackground"
                      className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>

                {/* Tooltip for collapsed state */}
                <AnimatePresence>
                  {isCollapsed && hoveredItem === item.name && (
                    <motion.div
                      initial={{ opacity: 0, x: -10, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -10, scale: 0.8 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 z-50"
                    >
                      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                        {item.name}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </nav>

      {/* User info at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-3 p-3 rounded-xl bg-white shadow-sm"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-sm font-bold text-white">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-600 truncate">{user?.role}</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="flex justify-center"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CollapsibleSidebar;