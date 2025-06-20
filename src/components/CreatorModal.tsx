
import React from 'react';
import { Creator } from '../types/Creator';
import { X, Users, Eye, Star, DollarSign, Play, TrendingUp, BarChart3 } from 'lucide-react';
import { Progress } from './ui/progress';

interface CreatorModalProps {
  creator: Creator;
  onClose: () => void;
}

const CreatorModal: React.FC<CreatorModalProps> = ({ creator, onClose }) => {
  // Mock analytics data
  const monthlyViews = [
    { month: 'Jan', views: 12000 },
    { month: 'Feb', views: 15000 },
    { month: 'Mar', views: 18000 },
    { month: 'Apr', views: 22000 },
    { month: 'May', views: 25000 },
    { month: 'Jun', views: 28000 },
  ];

  const contentPerformance = [
    { type: 'Videos', engagement: 85, color: 'bg-blue-500' },
    { type: 'Tutorials', engagement: 92, color: 'bg-green-500' },
    { type: 'Reviews', engagement: 78, color: 'bg-purple-500' },
    { type: 'Live Streams', engagement: 67, color: 'bg-orange-500' },
  ];

  const maxViews = Math.max(...monthlyViews.map(item => item.views));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Creator Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 md:p-6">
          <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
            {/* Left Section - Creator Info */}
            <div className="lg:col-span-1">
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{creator.name}</h3>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {creator.details.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-purple-500" />
                      <span className="text-sm text-gray-600">Followers</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {creator.details.analytics.followers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye size={16} className="text-blue-500" />
                      <span className="text-sm text-gray-600">Total Views</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {creator.details.analytics.totalViews.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star size={16} className="text-yellow-500" />
                      <span className="text-sm text-gray-600">Engagement</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {creator.details.analytics.engagement}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Section - Details & Analytics */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">About</h4>
                <p className="text-gray-600 leading-relaxed">{creator.details.bio}</p>
              </div>

              {/* Analytics Section */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Monthly Views Chart */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp size={20} className="text-blue-500" />
                    <h4 className="font-semibold text-gray-900">Monthly Views</h4>
                  </div>
                  <div className="space-y-3">
                    {monthlyViews.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600 w-8">{item.month}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(item.views / maxViews) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-12 text-right">
                          {(item.views / 1000).toFixed(0)}k
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content Performance */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <BarChart3 size={20} className="text-green-500" />
                    <h4 className="font-semibold text-gray-900">Content Performance</h4>
                  </div>
                  <div className="space-y-4">
                    {contentPerformance.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">{item.type}</span>
                          <span className="text-sm font-medium text-gray-900">{item.engagement}%</span>
                        </div>
                        <Progress value={item.engagement} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Content</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {creator.details.reels.map((reel, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg aspect-video flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="text-center">
                        <Play size={32} className="text-gray-400 mx-auto mb-2 group-hover:text-purple-500 transition-colors" />
                        <p className="text-sm text-gray-600">{reel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <DollarSign size={24} className="text-purple-600" />
                  <h4 className="text-lg font-semibold text-gray-900">Pricing</h4>
                </div>
                <p className="text-gray-900 mb-4">{creator.details.pricing}</p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                    Contact Creator
                  </button>
                  <button className="px-6 py-3 border border-purple-200 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                    Save Profile
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

export default CreatorModal;
