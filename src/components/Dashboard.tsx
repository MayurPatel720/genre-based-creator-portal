
import React from 'react';
import CreatorCard from './CreatorCard';
import { Creator } from '../types/Creator';
import { mockCreators } from '../data/mockData';

interface DashboardProps {
  activeGenre: string;
  onCreatorClick: (creator: Creator) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ activeGenre, onCreatorClick }) => {
  const filteredCreators = mockCreators.filter(creator => creator.genre === activeGenre);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-white shadow-sm border-b border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{activeGenre}</h2>
            <p className="text-slate-600 mt-1">
              {filteredCreators.length} creator{filteredCreators.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
              Filter
            </button>
            <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
              Sort
            </button>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCreators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onClick={() => onCreatorClick(creator)}
            />
          ))}
        </div>
        
        {filteredCreators.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Users size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No creators found</h3>
            <p className="text-slate-500">Try selecting a different genre</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
