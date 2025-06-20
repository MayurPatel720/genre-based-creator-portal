
import React from 'react';
import { Creator } from '../types/Creator';
import { Eye, Heart, Star } from 'lucide-react';

interface CreatorCardProps {
  creator: Creator;
  onClick: () => void;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100 hover:border-purple-200"
    >
      <div className="relative">
        <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden rounded-t-2xl">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-sm flex items-center space-x-1">
          <Star size={12} className="text-yellow-500 fill-current" />
          <span className="text-xs font-medium text-gray-700">
            {creator.details.analytics.engagement}
          </span>
        </div>
      </div>
      
      <div className="p-3">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors flex-1 truncate text-sm">
            {creator.name}
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {creator.details.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Eye size={12} />
            <span>{creator.details.analytics.totalViews.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Heart size={12} className="text-red-400" />
            <span>{(creator.details.analytics.followers / 1000).toFixed(1)}k</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorCard;
