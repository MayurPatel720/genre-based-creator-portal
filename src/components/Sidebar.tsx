
import React from 'react';
import { Users, Video, Lightbulb, Laptop, Heart, Building2, Sun, Moon } from 'lucide-react';

interface SidebarProps {
  activeGenre: string;
  onGenreChange: (genre: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const genres = [
  { name: 'All Creators', icon: Users },
  { name: 'Video Editing/AI', icon: Video },
  { name: 'Tips & Tricks/AI', icon: Lightbulb },
  { name: 'Tech Products', icon: Laptop },
  { name: 'Lifestyle', icon: Heart },
  { name: 'Business', icon: Building2 },
];

const Sidebar: React.FC<SidebarProps> = ({ activeGenre, onGenreChange, isDarkMode, onToggleDarkMode }) => {
  return (
    <div className="w-full md:w-64 bg-background shadow-xl border-r border-border flex flex-col">
      <div className="p-4 md:p-6 border-b border-border">
        <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          CreatorHub
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Discover amazing creators</p>
      </div>
      
      <nav className="flex-1 p-2 md:p-4 space-y-1 md:space-y-2">
        {genres.map((genre) => {
          const Icon = genre.icon;
          const isActive = activeGenre === genre.name;
          
          return (
            <button
              key={genre.name}
              onClick={() => onGenreChange(genre.name)}
              className={`w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-200 text-left text-sm md:text-base ${
                isActive
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-foreground hover:bg-accent hover:text-purple-600'
              }`}
            >
              <Icon size={18} className="md:w-5 md:h-5" />
              <span className="font-medium">{genre.name}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="p-2 md:p-4 border-t border-border">
        <button
          onClick={onToggleDarkMode}
          className="w-full flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-200 text-foreground hover:bg-accent"
        >
          {isDarkMode ? <Sun size={18} className="md:w-5 md:h-5" /> : <Moon size={18} className="md:w-5 md:h-5" />}
          <span className="font-medium text-sm md:text-base">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
