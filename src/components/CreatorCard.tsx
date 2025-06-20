
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
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden border border-slate-200 hover:border-purple-200"
    >
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-20 h-20 rounded-full object-cover shadow-lg group-hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2">
          <Heart size={16} className="text-slate-600" />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-purple-600 transition-colors">
          {creator.name}
        </h3>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {creator.details.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center space-x-1">
            <Eye size={14} />
            <span>{creator.details.analytics.totalViews.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span>{creator.details.analytics.engagement}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorCard;
