
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import CreatorModal from '../components/CreatorModal';
import { Creator } from '../types/Creator';

const Index = () => {
  const [activeGenre, setActiveGenre] = useState('AI Creators');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex h-screen">
        <Sidebar 
          activeGenre={activeGenre} 
          onGenreChange={setActiveGenre} 
        />
        <Dashboard 
          activeGenre={activeGenre} 
          onCreatorClick={setSelectedCreator}
        />
      </div>
      
      {selectedCreator && (
        <CreatorModal 
          creator={selectedCreator} 
          onClose={() => setSelectedCreator(null)} 
        />
      )}
    </div>
  );
};

export default Index;
