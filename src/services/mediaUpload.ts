
import api from './api';

export interface MediaUploadResponse {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  caption?: string;
  createdAt: string;
}

export const mediaUploadAPI = {
  uploadMedia: async (creatorId: string, file: File, caption?: string): Promise<MediaUploadResponse> => {
    const formData = new FormData();
    formData.append('media', file);
    if (caption) {
      formData.append('caption', caption);
    }
    
    const response = await api.post(`/media/${creatorId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  deleteMedia: async (creatorId: string, mediaId: string): Promise<void> => {
    await api.delete(`/media/${creatorId}/${mediaId}`);
  },

  getMedia: async (creatorId: string): Promise<MediaUploadResponse[]> => {
    const response = await api.get(`/media/${creatorId}`);
    return response.data;
  },
};
