import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, LogOut, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const updates: any = {};
      if (formData.username !== user?.username) {
        updates.username = formData.username;
      }
      if (formData.email !== user?.email) {
        updates.email = formData.email;
      }

      if (Object.keys(updates).length === 0) {
        setSuccess('No changes to save');
        setIsLoading(false);
        return;
      }

      await apiService.updateProfile(updates);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <User size={20} />
          <span>Profile Information</span>
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your username"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Save size={18} />
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Lock size={20} />
          <span>Password</span>
        </h2>
        <p className="text-gray-600 mb-4">
          Password changes are not available in this demo version.
        </p>
        <button
          disabled
          className="w-full bg-gray-200 text-gray-500 py-3 rounded-xl font-semibold cursor-not-allowed"
        >
          Change Password (Coming Soon)
        </button>
      </div>

      {/* Account Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Account</h2>
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;