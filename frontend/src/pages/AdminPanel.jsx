import React from 'react';
import Layout from '../components/Layout';
import { Settings, Users, Shield, Database } from 'lucide-react';

const AdminPanel = () => {
  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p className="text-gray-500">Manage system settings, users, and security configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-blue-500 transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Users size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">User Management</h3>
          <p className="text-gray-500 text-sm">Add, remove, or modify roles for loan officers and underwriters.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-blue-500 transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Settings size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">System Settings</h3>
          <p className="text-gray-500 text-sm">Configure global application parameters and API keys.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-blue-500 transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <Shield size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Security Rules</h3>
          <p className="text-gray-500 text-sm">Define AI risk thresholds and auto-approval criteria.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100 hover:border-blue-500 transition-colors cursor-pointer group">
          <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <Database size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Database Backup</h3>
          <p className="text-gray-500 text-sm">Schedule and manage automated data backups.</p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
