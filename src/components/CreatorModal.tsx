
import React from 'react';
import { Creator } from '../types/Creator';
import { X, Users, Eye, Star, DollarSign, Play } from 'lucide-react';

interface CreatorModalProps {
  creator: Creator;
  onClose: () => void;
}

const CreatorModal: React.FC<CreatorModalProps> = ({ creator, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">Creator Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Section - Creator Info */}
            <div className="lg:col-span-1">
              <div className="text-center mb-6">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg"
                />
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{creator.name}</h3>
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
              
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-slate-800 mb-3">Quick Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-purple-500" />
                      <span className="text-sm text-slate-600">Followers</span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {creator.details.analytics.followers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye size={16} className="text-blue-500" />
                      <span className="text-sm text-slate-600">Total Views</span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {creator.details.analytics.totalViews.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star size={16} className="text-yellow-500" />
                      <span className="text-sm text-slate-600">Engagement</span>
                    </div>
                    <span className="font-semibold text-slate-800">
                      {creator.details.analytics.engagement}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Section - Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3">About</h4>
                <p className="text-slate-600 leading-relaxed">{creator.details.bio}</p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-slate-800 mb-3">Recent Content</h4>
                <div className="grid grid-cols-2 gap-4">
                  {creator.details.reels.map((reel, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg aspect-video flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="text-center">
                        <Play size={32} className="text-slate-500 mx-auto mb-2 group-hover:text-purple-500 transition-colors" />
                        <p className="text-sm text-slate-600">{reel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <DollarSign size={24} className="text-purple-600" />
                  <h4 className="text-lg font-semibold text-slate-800">Pricing</h4>
                </div>
                <p className="text-slate-700 mb-4">{creator.details.pricing}</p>
                <div className="flex space-x-3">
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
