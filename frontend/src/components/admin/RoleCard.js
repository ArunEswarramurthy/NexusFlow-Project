import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Edit, Trash2, Eye, Users, Settings, Crown, Star, Copy, MoreVertical
} from 'lucide-react';

const RoleCard = ({ 
  role, 
  index, 
  onView, 
  onEdit, 
  onDelete, 
  onDuplicate 
}) => {
  const getRoleIcon = (roleName) => {
    switch (roleName.toLowerCase()) {
      case 'super admin': return Crown;
      case 'admin': return Shield;
      case 'user': return Users;
      case 'guest': return Eye;
      default: return Settings;
    }
  };

  const getRoleColor = (color) => {
    const colors = {
      purple: 'from-purple-500 to-purple-600',
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      gray: 'from-gray-500 to-gray-600',
      indigo: 'from-indigo-500 to-indigo-600',
      red: 'from-red-500 to-red-600',
      orange: 'from-orange-500 to-orange-600',
      yellow: 'from-yellow-500 to-yellow-600',
      pink: 'from-pink-500 to-pink-600',
      teal: 'from-teal-500 to-teal-600'
    };
    return colors[color] || colors.gray;
  };

  const getColorFromHex = (hex) => {
    const colorMap = {
      '#8B5CF6': 'purple',
      '#3B82F6': 'blue', 
      '#10B981': 'green',
      '#6B7280': 'gray',
      '#6366F1': 'indigo',
      '#EF4444': 'red',
      '#F97316': 'orange',
      '#EAB308': 'yellow',
      '#EC4899': 'pink',
      '#14B8A6': 'teal'
    };
    return colorMap[hex] || 'gray';
  };

  const IconComponent = getRoleIcon(role.name);
  const colorClass = getRoleColor(getColorFromHex(role.color));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClass} flex items-center justify-center`}>
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center space-x-2">
          {role.isSystem && (
            <div className="flex items-center text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              <Star className="w-3 h-3 mr-1" />
              System
            </div>
          )}
          <div className={`text-xs px-2 py-1 rounded-full ${
            role.status === 'active' 
              ? 'text-green-700 bg-green-50' 
              : 'text-gray-700 bg-gray-50'
          }`}>
            {role.status}
          </div>
        </div>
      </div>

      {/* Role Info */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {role.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          Priority Level: {role.priority}
        </p>
        {role.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {role.description}
          </p>
        )}
      </div>

      {/* Permissions Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Permissions</span>
          <span className="font-medium text-gray-900">
            {role.permissionCount}/{role.totalPermissions}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${colorClass}`}
            style={{ 
              width: `${role.totalPermissions > 0 ? (role.permissionCount / role.totalPermissions) * 100 : 0}%` 
            }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {role.totalPermissions > 0 
            ? Math.round((role.permissionCount / role.totalPermissions) * 100)
            : 0}% coverage
        </div>
      </div>

      {/* User Count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-gray-500">
          <Users className="w-4 h-4 mr-1" />
          {role.userCount} {role.userCount === 1 ? 'user' : 'users'}
        </div>
        {role.userCount > 0 && (
          <div className="flex -space-x-1">
            {[...Array(Math.min(role.userCount, 3))].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-600"
              >
                {i + 1}
              </div>
            ))}
            {role.userCount > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-500">
                +{role.userCount - 3}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onView(role)}
          className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </button>
        
        {!role.isSystem && (
          <>
            <button
              onClick={() => onEdit(role)}
              className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDuplicate(role)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(role)}
              className="px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
        
        {role.isSystem && (
          <button
            onClick={() => onDuplicate(role)}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center"
          >
            <Copy className="w-4 h-4 mr-1" />
            Duplicate
          </button>
        )}
      </div>

      {/* Hover overlay for additional info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl pointer-events-none" />
    </motion.div>
  );
};

export default RoleCard;