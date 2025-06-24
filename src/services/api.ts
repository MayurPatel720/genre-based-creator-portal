
import axios from 'axios';
import { Creator } from '../types/Creator';

const API_BASE_URL = 'https://genre-based-creator-portal.vercel.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CreateCreatorData {
  name: string;
  genre: string;
  avatar: string;
  bio: string;
  followers: number;
  engagement: string;
  totalViews: number;
  reels: string[];
  pricing: string;
  tags: string[];
}

export interface UpdateCreatorData extends Partial<CreateCreatorData> {}

export const creatorAPI = {
  // Get all creators
  getAll: async (): Promise<Creator[]> => {
    const response = await api.get('/creators');
    return response.data;
  },

  // Get creator by ID
  getById: async (id: string): Promise<Creator> => {
    const response = await api.get(`/creators/${id}`);
    return response.data;
  },

  // Create new creator
  create: async (data: CreateCreatorData): Promise<Creator> => {
    const creatorData = {
      name: data.name,
      genre: data.genre,
      avatar: data.avatar,
      details: {
        bio: data.bio,
        analytics: {
          followers: data.followers,
          engagement: data.engagement,
          totalViews: data.totalViews,
        },
        reels: data.reels,
        pricing: data.pricing,
        tags: data.tags,
      },
    };
    const response = await api.post('/creators', creatorData);
    return response.data;
  },

  // Update creator
  update: async (id: string, data: UpdateCreatorData): Promise<Creator> => {
    const updateData: any = {};
    
    if (data.name) updateData.name = data.name;
    if (data.genre) updateData.genre = data.genre;
    if (data.avatar) updateData.avatar = data.avatar;
    
    if (data.bio || data.followers || data.engagement || data.totalViews || data.reels || data.pricing || data.tags) {
      updateData.details = {};
      if (data.bio) updateData.details.bio = data.bio;
      if (data.followers || data.engagement || data.totalViews) {
        updateData.details.analytics = {};
        if (data.followers) updateData.details.analytics.followers = data.followers;
        if (data.engagement) updateData.details.analytics.engagement = data.engagement;
        if (data.totalViews) updateData.details.analytics.totalViews = data.totalViews;
      }
      if (data.reels) updateData.details.reels = data.reels;
      if (data.pricing) updateData.details.pricing = data.pricing;
      if (data.tags) updateData.details.tags = data.tags;
    }

    const response = await api.put(`/creators/${id}`, updateData);
    return response.data;
  },

  // Delete creator
  delete: async (id: string): Promise<void> => {
    await api.delete(`/creators/${id}`);
  },

  // Get creators by genre
  getByGenre: async (genre: string): Promise<Creator[]> => {
    const response = await api.get(`/creators?genre=${genre}`);
    return response.data;
  },
};

export default api;
