import React, { useState, useEffect } from 'react';
import { Building2, Mail, Phone, Users, Calendar } from 'lucide-react';
import { organizationAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const OrganizationDetails = () => {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    try {
      setLoading(true);
      const response = await organizationAPI.getOrganization();
      setOrganization(response.data.organization);
    } catch (error) {
      console.error('Error fetching organization:', error);
      toast.error('Failed to load organization details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">No organization details found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-6">
        <Building2 className="w-8 h-8 text-primary-500 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Organization Details</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name
            </label>
            <p className="text-lg font-semibold text-gray-900">{organization.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="flex items-center">
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              <p className="text-gray-900">{organization.email}</p>
            </div>
          </div>

          {organization.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-gray-400 mr-2" />
                <p className="text-gray-900">{organization.phone}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              organization.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {organization.status}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Users
            </label>
            <div className="flex items-center">
              <Users className="w-4 h-4 text-gray-400 mr-2" />
              <p className="text-lg font-semibold text-gray-900">{organization.totalUsers}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Created Date
            </label>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 text-gray-400 mr-2" />
              <p className="text-gray-900">
                {new Date(organization.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization ID
            </label>
            <p className="text-sm text-gray-600 font-mono">{organization.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetails;