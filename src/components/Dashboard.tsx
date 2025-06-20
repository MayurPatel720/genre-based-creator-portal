
import React, { useState } from 'react';
import CreatorCard from './CreatorCard';
import { Creator } from '../types/Creator';
import { mockCreators } from '../data/mockData';
import { Users, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface DashboardProps {
  activeGenre: string;
  onCreatorClick: (creator: Creator) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ activeGenre, onCreatorClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');

  // Show all creators instead of filtering by genre
  let filteredCreators = mockCreators;

  // Apply search filter
  if (searchTerm) {
    filteredCreators = filteredCreators.filter(creator =>
      creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.details.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  // Apply tag filter
  if (filterBy !== 'all') {
    filteredCreators = filteredCreators.filter(creator =>
      creator.details.tags.some(tag => tag.toLowerCase().includes(filterBy.toLowerCase()))
    );
  }

  // Apply sorting
  filteredCreators = [...filteredCreators].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'followers':
        return b.details.analytics.followers - a.details.analytics.followers;
      case 'views':
        return b.details.analytics.totalViews - a.details.analytics.totalViews;
      default:
        return 0;
    }
  });

  // Get unique tags for filter dropdown
  const allTags = Array.from(new Set(mockCreators.flatMap(creator => creator.details.tags)));

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="bg-background shadow-sm border-b border-border p-4 md:p-6">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground">All Creators</h2>
            <p className="text-muted-foreground mt-1">
              {filteredCreators.length} creator{filteredCreators.length !== 1 ? 's' : ''} available
            </p>
          </div>
          
          <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
            
            {/* Filter */}
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full md:w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag.toLowerCase()}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="followers">Followers</SelectItem>
                <SelectItem value="views">Views</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
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
            <div className="text-muted-foreground mb-4">
              <Users size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No creators found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
