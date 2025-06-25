
// Instagram Basic Display API service
// Note: This requires Instagram App ID and Access Token
// For production, these should be stored securely

export interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  caption?: string;
  permalink: string;
  timestamp: string;
}

export interface InstagramProfile {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
}

class InstagramAPIService {
  private baseURL = 'https://graph.instagram.com';
  
  // Extract username from Instagram URL
  private extractUsername(instagramUrl: string): string | null {
    const match = instagramUrl.match(/instagram\.com\/([^/?]+)/);
    return match ? match[1] : null;
  }

  // Get user media (requires access token)
  async getUserMedia(accessToken: string, userId: string): Promise<InstagramMedia[]> {
    try {
      const response = await fetch(
        `${this.baseURL}/${userId}/media?fields=id,media_type,media_url,thumbnail_url,caption,permalink,timestamp&access_token=${accessToken}`
      );
      
      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch Instagram media:', error);
      return [];
    }
  }

  // Get user profile info
  async getUserProfile(accessToken: string, userId: string): Promise<InstagramProfile | null> {
    try {
      const response = await fetch(
        `${this.baseURL}/${userId}?fields=id,username,account_type,media_count&access_token=${accessToken}`
      );
      
      if (!response.ok) {
        throw new Error(`Instagram API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch Instagram profile:', error);
      return null;
    }
  }

  // For demo purposes - mock data when no access token is available
  getMockInstagramData(instagramUrl: string): InstagramMedia[] {
    const username = this.extractUsername(instagramUrl);
    
    return [
      {
        id: '1',
        media_type: 'VIDEO',
        media_url: 'https://example.com/reel1.mp4',
        thumbnail_url: 'https://example.com/thumb1.jpg',
        caption: `Latest reel from @${username}`,
        permalink: `${instagramUrl}/p/mock1/`,
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        media_type: 'IMAGE',
        media_url: 'https://example.com/post2.jpg',
        caption: `Amazing content from @${username}`,
        permalink: `${instagramUrl}/p/mock2/`,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '3',
        media_type: 'VIDEO',
        media_url: 'https://example.com/reel3.mp4',
        thumbnail_url: 'https://example.com/thumb3.jpg',
        caption: `Creative video by @${username}`,
        permalink: `${instagramUrl}/p/mock3/`,
        timestamp: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
  }
}

export const instagramAPI = new InstagramAPIService();
