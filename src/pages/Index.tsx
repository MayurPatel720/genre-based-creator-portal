
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import CreatorModal from '../components/CreatorModal';
import { Creator } from '../types/Creator';

const Index = () => {
  const [activeGenre, setActiveGenre] = useState('All Creators');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed md:relative z-50 md:z-0 h-full
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <Sidebar 
            activeGenre={activeGenre} 
            onGenreChange={(genre) => {
              setActiveGenre(genre);
              setIsMobileMenuOpen(false);
            }}
          />
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile header */}
          <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CreatorHub
            </h1>
            <div className="w-10" />
          </div>
          
          <Dashboard 
            activeGenre={activeGenre} 
            onCreatorClick={setSelectedCreator}
          />
        </div>
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
