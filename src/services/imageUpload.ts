
import api from './api';

export interface ImageUploadResponse {
  url: string;
  public_id: string;
}

export const imageUploadAPI = {
  uploadImage: async (file: File): Promise<ImageUploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  deleteImage: async (publicId: string): Promise<void> => {
    await api.delete(`/upload/image/${publicId}`);
  },
};
