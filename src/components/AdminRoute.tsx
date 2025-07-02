
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const AdminRoute: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield size={40} className="text-white" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Admin Panel Access
        </h1>
        
        <p className="text-gray-600 mb-6">
          Manage creators, upload media, and control the platform from the admin dashboard.
        </p>
        
        <Link to="/admin">
          <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
            Access Admin Panel
            <ArrowRight size={20} />
          </Button>
        </Link>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Admin Features:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Add/Edit/Delete Creators</li>
            <li>• Upload Images and Videos</li>
            <li>• Manage Creator Stats (M/K format)</li>
            <li>• View Analytics Dashboard</li>
          </ul>
        </div>
        
        <Link to="/" className="inline-block mt-4 text-purple-600 hover:text-purple-700 text-sm font-medium">
          ← Back to Main Site
        </Link>
      </div>
    </div>
  );
};

export default AdminRoute;
