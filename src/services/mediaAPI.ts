
import axios from 'axios';
import { MediaFile } from '../types/Creator';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const mediaApi = axios.create({
  baseURL: `${API_BASE_URL}/media`,
  timeout: 30000,
});

export const mediaAPI = {
  uploadMedia: async (creatorId: string, file: File, caption: string): Promise<MediaFile> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);

    const response = await mediaApi.post(`/${creatorId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  deleteMedia: async (creatorId: string, mediaId: string): Promise<void> => {
    await mediaApi.delete(`/${creatorId}/${mediaId}`);
  },
};
