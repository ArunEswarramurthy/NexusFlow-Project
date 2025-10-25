import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Phone, Building } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-600">{user?.role}</p>
                <p className="text-sm text-gray-500">{user?.organization}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Organization</p>
                    <p className="text-sm text-gray-600">{user?.organization}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    Edit Profile
                  </button>
                  <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    Change Password
                  </button>
                  <button className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    Notification Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;