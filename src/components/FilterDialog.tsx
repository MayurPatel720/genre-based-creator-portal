
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Checkbox } from './ui/checkbox';
import { X } from 'lucide-react';

interface FilterState {
  platform: string;
  locations: string[];
  priceRange: [number, number];
  followersRange: [number, number];
}

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const platforms = ['All', 'Instagram', 'YouTube', 'TikTok', 'Twitter', 'LinkedIn'];
  const locations = ['San Francisco', 'Los Angeles', 'New York', 'Austin', 'Miami', 'Seattle'];

  const handlePlatformChange = (platform: string) => {
    onFiltersChange({ ...filters, platform });
  };

  const handleLocationChange = (location: string, checked: boolean) => {
    if (checked) {
      onFiltersChange({
        ...filters,
        locations: [...filters.locations, location],
      });
    } else {
      onFiltersChange({
        ...filters,
        locations: filters.locations.filter((loc) => loc !== location),
      });
    }
  };

  const handleFollowersRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      followersRange: [value[0], value[1]],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Filters
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Platform Filter */}
          <div>
            <h3 className="text-sm font-medium mb-3">Platform</h3>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform}
                  onClick={() => handlePlatformChange(platform)}
                  className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                    filters.platform === platform
                      ? 'bg-purple-100 border-purple-300 text-purple-700'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div>
            <h3 className="text-sm font-medium mb-3">Location</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {locations.map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox
                    id={location}
                    checked={filters.locations.includes(location)}
                    onCheckedChange={(checked) =>
                      handleLocationChange(location, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={location}
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    {location}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Followers Range */}
          <div>
            <h3 className="text-sm font-medium mb-3">
              Followers Range ({filters.followersRange[0]}K - {filters.followersRange[1]}K)
            </h3>
            <Slider
              value={filters.followersRange}
              onValueChange={handleFollowersRangeChange}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="flex-1"
            >
              Clear All
            </Button>
            <Button onClick={onClose} className="flex-1">
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
