
import React, { useState } from "react";
import { Creator } from "../../types/Creator";
import { useCreators } from "../../hooks/useCreators";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Search, Edit2, Trash2, Users, Eye, TrendingUp } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface CreatorListProps {
  onEdit: (creator: Creator) => void;
}

const CreatorList: React.FC<CreatorListProps> = ({ onEdit }) => {
  const { creators, loading, deleteCreator } = useCreators();
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  // Filter creators based on search and genre
  const filteredCreators = creators.filter((creator) => {
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creator.details.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesGenre = genreFilter === "all" || creator.genre === genreFilter;
    
    return matchesSearch && matchesGenre;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this creator?")) {
      setDeleteLoading(id);
      try {
        await deleteCreator(id);
      } catch (error) {
        console.error("Failed to delete creator:", error);
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  const getUniqueGenres = () => {
    return Array.from(new Set(creators.map(creator => creator.genre)));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Creator Management</h2>
        <div className="text-sm text-gray-600">
          {filteredCreators.length} of {creators.length} creators
        </div>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search creators..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={genreFilter} onValueChange={setGenreFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {getUniqueGenres().map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Creator List */}
      {filteredCreators.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No creators found</h3>
          <p className="text-gray-600">
            {searchTerm || genreFilter !== "all" 
              ? "Try adjusting your search or filters" 
              : "Add your first creator to get started"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCreators.map((creator) => (
            <div
              key={creator.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48?text=?';
                    }}
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{creator.name}</h3>
                    <p className="text-gray-600">{creator.genre}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {creator.details.analytics.followers.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {creator.details.analytics.engagement}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {creator.details.analytics.totalViews.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(creator)}
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(creator.id)}
                    disabled={deleteLoading === creator.id}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {deleteLoading === creator.id ? "..." : "Delete"}
                  </Button>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-2">
                {creator.details.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bio preview */}
              <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                {creator.details.bio}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreatorList;
