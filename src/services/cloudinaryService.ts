
const CLOUDINARY_CLOUD_NAME = 'dxt8ylemj';
const CLOUDINARY_UPLOAD_PRESET = 'evar_study_material'; 

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
  url: string;
}


export const uploadToCloudinary = async (
  file: File,
  folder: string = 'evar_study_material'
): Promise<CloudinaryUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);
  formData.append('resource_type', 'raw');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    const data: CloudinaryUploadResponse = await response.json();
    console.log('✅ Cloudinary upload success:', data.secure_url);
    return data;
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
};


export const deleteFromCloudinary = async (publicId: string): Promise<void> => {

  console.warn('Delete operation should be performed from backend for security');
  throw new Error('Delete operation not supported from frontend');
};


export const getOptimizedPdfUrl = (publicId: string): string => {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/raw/upload/${publicId}`;
};

export default {
  uploadToCloudinary,
  deleteFromCloudinary,
  getOptimizedPdfUrl,
};
