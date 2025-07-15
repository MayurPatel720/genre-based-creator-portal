
// Cloudinary service for image uploads
export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
}

export const cloudinaryService = {
  uploadImage: async (file: File): Promise<CloudinaryUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    return response.json();
  }
};
