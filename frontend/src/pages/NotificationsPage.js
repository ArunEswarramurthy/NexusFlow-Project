import React from 'react';
import { Bell, CheckCircle } from 'lucide-react';

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <button className="text-sm text-blue-600 hover:text-blue-500">
                Mark all as read
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
              <p className="mt-1 text-sm text-gray-500">
                You're all caught up! New notifications will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;