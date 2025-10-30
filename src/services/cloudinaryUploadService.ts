/**
 * Cloudinary Upload Service with Signed Upload
 * This service generates signature from backend to securely upload files
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

interface SignatureResponse {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  bytes: number;
}

/**
 * Get upload signature from backend
 */
const getUploadSignature = async (folder: string = 'evar-knowledge-base'): Promise<SignatureResponse> => {
  const response = await fetch(`${API_BASE_URL}/cloudinary/signature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ folder }),
  });

  if (!response.ok) {
    throw new Error('Failed to get upload signature');
  }

  return response.json();
};

/**
 * Upload file to Cloudinary using signed upload
 */
export const uploadPdfToCloudinary = async (
  file: File,
  folder: string = 'evar-knowledge-base'
): Promise<CloudinaryUploadResponse> => {
  console.log('🚀 Starting signed PDF upload to Cloudinary...');

  try {
    // Step 1: Get signature from backend
    console.log('📝 Getting upload signature from backend...');
    const signatureData = await getUploadSignature(folder);

    // Step 2: Upload to Cloudinary with signature
    console.log('📤 Uploading to Cloudinary with signature...');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('signature', signatureData.signature);
    formData.append('timestamp', signatureData.timestamp.toString());
    formData.append('api_key', signatureData.apiKey);
    formData.append('folder', signatureData.folder);
    formData.append('resource_type', 'raw');

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/raw/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text();
      console.error('❌ Cloudinary upload failed:', errorText);
      throw new Error(`Cloudinary upload failed: ${cloudinaryResponse.status}`);
    }

    const data: CloudinaryUploadResponse = await cloudinaryResponse.json();
    console.log('✅ Cloudinary upload success:', data.secure_url);
    
    return data;
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
};

/**
 * Get optimized PDF URL
 */
export const getOptimizedPdfUrl = (publicId: string, cloudName: string = 'dxt8ylemj'): string => {
  return `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;
};

export default {
  uploadPdfToCloudinary,
  getOptimizedPdfUrl,
};
