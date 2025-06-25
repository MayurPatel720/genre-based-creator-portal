import React from 'react';
import { Creator } from '../types/Creator';
import { X, Users, Eye, Star, DollarSign, Play, Instagram } from 'lucide-react';
import { useInstagramData } from '../hooks/useInstagramData';

interface CreatorModalProps {
  creator: Creator;
  onClose: () => void;
}

const CreatorModal: React.FC<CreatorModalProps> = ({ creator, onClose }) => {
  const { media: instagramMedia, loading: instagramLoading } = useInstagramData(
    creator.platform === 'Instagram' ? creator.socialLink : ''
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-4 md:p-6 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Creator Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 md:p-6">
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Section - Creator Info */}
            <div className="lg:col-span-1">
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{creator.name}</h3>
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {creator.details.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-accent rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-foreground mb-3">Quick Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-purple-500" />
                      <span className="text-sm text-muted-foreground">Followers</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {creator.details.analytics.followers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye size={16} className="text-blue-500" />
                      <span className="text-sm text-muted-foreground">Total Views</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {creator.details.analytics.totalViews.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star size={16} className="text-yellow-500" />
                      <span className="text-sm text-muted-foreground">Engagement</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {creator.details.analytics.engagement}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Section - Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3">About</h4>
                <p className="text-muted-foreground leading-relaxed">{creator.details.bio}</p>
              </div>
              
              {/* Instagram Media Section */}
              {creator.platform === 'Instagram' && (
                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <Instagram size={20} className="text-pink-500" />
                    Instagram Content
                  </h4>
                  
                  {instagramLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-accent rounded-lg aspect-square animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {instagramMedia.map((item) => (
                        <div
                          key={item.id}
                          className="bg-accent rounded-lg aspect-square flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-200 group relative overflow-hidden"
                        >
                          {item.media_type === 'IMAGE' ? (
                            <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center">
                              <span className="text-sm text-muted-foreground">Image Post</span>
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                              <Play size={24} className="text-muted-foreground group-hover:text-purple-500 transition-colors" />
                            </div>
                          )}
                          
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                          
                          {item.caption && (
                            <div className="absolute bottom-2 left-2 right-2 text-xs text-white bg-black/50 rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {item.caption.length > 50 
                                ? `${item.caption.substring(0, 50)}...` 
                                : item.caption
                              }
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground mt-2">
                    * Instagram content is displayed for demonstration. Full integration requires Instagram API setup.
                  </p>
                </div>
              )}
              
              {/* Original Reels Section */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Portfolio Content</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {creator.details.reels.map((reel, index) => (
                    <div
                      key={index}
                      className="bg-accent rounded-lg aspect-video flex items-center justify-center cursor-pointer hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="text-center">
                        <Play size={32} className="text-muted-foreground mx-auto mb-2 group-hover:text-purple-500 transition-colors" />
                        <p className="text-sm text-muted-foreground">{reel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <DollarSign size={24} className="text-purple-600" />
                  <h4 className="text-lg font-semibold text-foreground">Pricing</h4>
                </div>
                <p className="text-foreground mb-4">{creator.details.pricing}</p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                    Contact Creator
                  </button>
                  <button className="px-6 py-3 border border-purple-200 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorModal;
