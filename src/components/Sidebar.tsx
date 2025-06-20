
import React from 'react';
import { Users, Video, Lightbulb, Laptop, Heart, Building2 } from 'lucide-react';

interface SidebarProps {
  activeGenre: string;
  onGenreChange: (genre: string) => void;
}

const genres = [
  { name: 'AI Creators', icon: Users },
  { name: 'Video Editing/AI', icon: Video },
  { name: 'Tips & Tricks/AI', icon: Lightbulb },
  { name: 'Tech Products', icon: Laptop },
  { name: 'Lifestyle', icon: Heart },
  { name: 'Business', icon: Building2 },
];

const Sidebar: React.FC<SidebarProps> = ({ activeGenre, onGenreChange }) => {
  return (
    <div className="w-64 bg-white shadow-xl border-r border-slate-200 flex flex-col">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          CreatorHub
        </h1>
        <p className="text-sm text-slate-600 mt-1">Discover amazing creators</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {genres.map((genre) => {
          const Icon = genre.icon;
          const isActive = activeGenre === genre.name;
          
          return (
            <button
              key={genre.name}
              onClick={() => onGenreChange(genre.name)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-purple-600'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{genre.name}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-200">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-slate-800 mb-1">Go Premium</h3>
          <p className="text-xs text-slate-600 mb-3">Unlock exclusive creators</p>
          <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
