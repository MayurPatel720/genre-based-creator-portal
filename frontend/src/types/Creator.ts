
export interface Creator {
  id: string;
  genre: string;
  avatar: string;
  name: string;
  details: {
    bio: string;
    analytics: {
      followers: number;
      engagement: string;
      totalViews: number;
    };
    reels: string[];
    pricing: string;
    tags: string[];
  };
}
