
import { useState, useEffect } from 'react';
import { instagramAPI, InstagramMedia, InstagramProfile } from '../services/instagramAPI';

export const useInstagramData = (instagramUrl: string, accessToken?: string) => {
  const [media, setMedia] = useState<InstagramMedia[]>([]);
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!instagramUrl) return;

    const fetchInstagramData = async () => {
      setLoading(true);
      setError(null);

      try {
        if (accessToken) {
          // Use real Instagram API if access token is available
          // Note: You would need to get the user ID first
          console.log('Instagram API integration requires proper setup with access tokens');
        }
        
        // For now, use mock data for demonstration
        const mockMedia = instagramAPI.getMockInstagramData(instagramUrl);
        setMedia(mockMedia);
        
      } catch (err) {
        setError('Failed to fetch Instagram data');
        console.error('Instagram API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramData();
  }, [instagramUrl, accessToken]);

  return { media, profile, loading, error };
};
