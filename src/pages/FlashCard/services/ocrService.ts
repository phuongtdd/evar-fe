import apiClient from '../../../configs/axiosConfig';
import { getUserIdFromToken } from '../utils/auth';

const API_BASE_URL = 'http://localhost:8080/api/ocr';

export interface GenerateFlashcardRequest {
  imageFile: File;
  userId: string;
  knowledgeBaseId?: string;
}

export interface GenerateFlashcardResponse {
  cardSetId: string;
  message: string;
  totalCards: number;
}

/**
 * Upload ảnh và generate flashcard bằng OCR
 */
export const generateFlashcardFromImage = async (
  imageFile: File,
  knowledgeBaseId?: string,
  count: number = 5,
  name: string = 'Flashcard từ ảnh',
  description: string = 'Tự động tạo từ OCR'
): Promise<GenerateFlashcardResponse> => {
  try {
    const userId = getUserIdFromToken();
    
    if (!userId) {
      throw new Error('Không tìm thấy user id trong token. Vui lòng đăng nhập lại.');
    }

    console.log('🌐 Upload ảnh để generate flashcard:', imageFile.name);
    console.log('👤 User ID:', userId);
    console.log('📊 Count:', count);
    console.log('📝 Name:', name);
    console.log('📄 Description:', description);
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', imageFile);
    
    if (knowledgeBaseId) {
      formData.append('knowledgeBaseId', knowledgeBaseId);
    }

    // userId, count, name, description được gửi như query parameter
    const response = await apiClient.post<GenerateFlashcardResponse>(
      `${API_BASE_URL}/generate-flashcard?userId=${userId}&count=${count}&name=${encodeURIComponent(name)}&description=${encodeURIComponent(description)}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('✅ Generate flashcard thành công:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Lỗi khi generate flashcard từ ảnh:', error);
    throw error;
  }
};

