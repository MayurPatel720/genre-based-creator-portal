
import axios from 'axios';
import { MediaFile } from '../types/Creator';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const mediaAPI = axios.create({
  baseURL: `${API_BASE_URL}/media`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 30000, // 30 second timeout for media uploads
});

export const mediaService = {
  // Upload media for a creator
  uploadMedia: async (creatorId: string, file: File, caption?: string): Promise<MediaFile> => {
    const formData = new FormData();
    formData.append('media', file);
    if (caption) {
      formData.append('caption', caption);
    }

    const response = await mediaAPI.post(`/${creatorId}`, formData);
    return response.data;
  },

  // Delete media from a creator
  deleteMedia: async (creatorId: string, mediaId: string): Promise<void> => {
    // Encode the mediaId to handle special characters and slashes
    const encodedMediaId = encodeURIComponent(mediaId);
    await mediaAPI.delete(`/${creatorId}/${encodedMediaId}`);
  },

  // Get all media for a creator
  getCreatorMedia: async (creatorId: string): Promise<MediaFile[]> => {
    const response = await mediaAPI.get(`/${creatorId}`);
    return response.data;
  },

  // Add media to a creator (alias for uploadMedia for consistency)
  addMedia: async (creatorId: string, file: File, caption?: string): Promise<MediaFile> => {
    return await mediaService.uploadMedia(creatorId, file, caption);
  },
};

// Export the service as default and named export for flexibility
export default mediaService;
