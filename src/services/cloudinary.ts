
import api from './api';

// Cloudinary service for image uploads
export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
}

export const cloudinaryService = {
  uploadImage: async (file: File): Promise<CloudinaryUploadResult> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      public_id: response.data.public_id,
      secure_url: response.data.url,
      url: response.data.url
    };
  }
};
