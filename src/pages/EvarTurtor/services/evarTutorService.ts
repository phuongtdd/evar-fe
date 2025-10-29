import apiClient from '../../../configs/axiosConfig';
import { ApiResponse, ChatRequest, ChatResponse, FlashcardRequest, FlashcardResponse, FlashcardUpdateRequest, KeyNotesResponse, KnowledgeBase, KnowledgeBaseStatus, KnowledgeBaseUploadResponse } from '../types';

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// ==================== TYPES ====================


// ==================== FLASHCARD SERVICES ====================
export const flashcardService = {
  // Tạo flashcard mới (backend: /api/flashcards)
  createFlashcard: async (request: FlashcardRequest): Promise<FlashcardResponse> => {
    const response = await apiClient.post('/flashcards', request);
    return response.data;
  },

  // Lấy flashcard theo ID
  getFlashcardById: async (id: string): Promise<ApiResponse<FlashcardResponse>> => {
    const response = await apiClient.get(`/v1/flashcards/${id}`);
    return response.data;
  },

  // Lấy tất cả flashcard theo knowledge base ID (backend: /api/flashcards/knowledge-base/{id})
  getFlashcardsByKnowledgeBaseId: async (knowledgeBaseId: number): Promise<FlashcardResponse[]> => {
    const response = await apiClient.get(`/flashcards/knowledge-base/${knowledgeBaseId}`);
    return response.data;
  },

  // Cập nhật flashcard (not available on backend currently) - keep for forward compatibility
  updateFlashcard: async (id: string, request: FlashcardUpdateRequest): Promise<FlashcardResponse> => {
    throw new Error('Update flashcard API is not available');
  },

  // Xóa flashcard (backend: /api/flashcards/{id})
  deleteFlashcard: async (id: string): Promise<void> => {
    await apiClient.delete(`/flashcards/${id}`);
  },

  // Gọi AI để sinh và lưu flashcards (backend: /api/flashcards/generate/{knowledgeBaseId}?count=5)
  generateFlashcards: async (knowledgeBaseId: number, count: number = 5): Promise<FlashcardResponse[]> => {
    const response = await apiClient.post(`/flashcards/generate/${knowledgeBaseId}?count=${count}`);
    return response.data;
  },

  // Đếm số lượng flashcard theo knowledge base ID (not available on backend)
  countFlashcardsByKnowledgeBaseId: async (_knowledgeBaseId: number): Promise<number> => {
    throw new Error('Count flashcards API is not available');
  }
};

// ==================== CHATBOT RAG SERVICES ====================
export const chatbotService = {
  // Chat với AI dựa trên knowledge base
  chat: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post('/chat', request);
    return response.data;
  }
};

// ==================== KNOWLEDGE BASE SERVICES ====================
export const knowledgeBaseService = {
  // Upload PDF file - First upload to Cloudinary using signed upload, then send metadata to backend
  uploadPdf: async (file: File, userId?: string): Promise<KnowledgeBaseUploadResponse> => {
    console.log('🚀 Starting PDF upload process...', {
      fileName: file.name,
      fileSize: file.size,
      userId: userId || 'not provided'
    });

    try {
      // Step 1: Get upload signature from backend
      console.log('📝 Step 1: Getting upload signature from backend...');
      const signatureResponse = await fetch(`${API_BASE_URL}/cloudinary/signature`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ folder: 'evar-knowledge-base' }),
      });

      if (!signatureResponse.ok) {
        throw new Error('Failed to get upload signature from backend');
      }

      const signatureData = await signatureResponse.json();
      console.log('✅ Signature received');

      // Step 2: Upload PDF to Cloudinary with signature
      console.log('📤 Step 2: Uploading PDF to Cloudinary with signature...');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signatureData.signature);
      formData.append('timestamp', signatureData.timestamp.toString());
      formData.append('api_key', signatureData.apiKey);
      formData.append('folder', signatureData.folder);
      formData.append('resource_type', 'raw');

      const cloudinaryUpload = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/raw/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      console.log('📡 Cloudinary response status:', cloudinaryUpload.status);

      if (!cloudinaryUpload.ok) {
        const errorText = await cloudinaryUpload.text();
        console.error('❌ Cloudinary upload failed:', {
          status: cloudinaryUpload.status,
          statusText: cloudinaryUpload.statusText,
          error: errorText
        });
        throw new Error(`Cloudinary upload failed: ${cloudinaryUpload.status} - ${errorText}`);
      }

      const cloudinaryData = await cloudinaryUpload.json();
      const fileUrl = cloudinaryData.secure_url;
      
      if (!fileUrl) {
        console.error('❌ No secure_url in Cloudinary response:', cloudinaryData);
        throw new Error('Cloudinary did not return a file URL');
      }

      console.log('✅ Cloudinary upload success:', {
        fileUrl,
        publicId: cloudinaryData.public_id,
        format: cloudinaryData.format,
        bytes: cloudinaryData.bytes,
        resourceType: cloudinaryData.resource_type
      });

      // Step 3: Send file + fileUrl to backend
      const backendFormData = new FormData();
      backendFormData.append('file', file);
      backendFormData.append('fileUrl', fileUrl); // Add Cloudinary URL
      if (userId) {
        backendFormData.append('userId', userId);
      }

      // Log FormData contents (cannot log FormData directly)
      console.log('📦 Step 3: Sending to backend:', {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        fileUrl: fileUrl,
        fileUrlLength: fileUrl?.length,
        userId: userId,
        hasFile: !!file,
        hasFileUrl: !!fileUrl,
        hasUserId: !!userId,
        endpoint: '/knowledge/upload'
      });

      const response = await apiClient.post('/knowledge/upload', backendFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('✅ Step 3: Backend response received:', {
        status: response.status,
        data: response.data,
        hasFileUrlInResponse: !!response.data.fileUrl
      });

      // Verify fileUrl was saved
      if (!response.data.fileUrl) {
        console.warn('⚠️ WARNING: Backend response does not contain fileUrl!');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw error;
    }
  },

  // Kiểm tra status của knowledge base
  getKnowledgeBaseStatus: async (id: number): Promise<KnowledgeBaseStatus> => {
    const response = await apiClient.get(`/knowledge/${id}/status`);
    return response.data;
  },

  // Lấy danh sách knowledge base của user
  getUserKnowledgeBases: async (userId: string): Promise<KnowledgeBase[]> => {
    console.log('📋 Fetching knowledge bases for user:', userId);
    const response = await apiClient.get(`/knowledge/user/${userId}`);
    console.log('📋 Knowledge bases received:', {
      count: response.data.length,
      knowledgeBases: response.data.map((kb: any) => ({
        id: kb.id,
        fileName: kb.fileName,
        fileUrl: kb.fileUrl,
        hasFileUrl: !!kb.fileUrl,
        status: kb.status
      }))
    });
    return response.data;
  },

  // Lấy chi tiết knowledge base (study guide, key notes, user note)
  getKnowledgeBaseDetail: async (id: number): Promise<KnowledgeBase> => {
    const response = await apiClient.get(`/knowledge/${id}`);
    return response.data;
  },

  // Lấy key notes đã parse
  getKeyNotes: async (id: number): Promise<KeyNotesResponse> => {
    const response = await apiClient.get(`/knowledge/${id}/key-notes`);
    return response.data;
  },

  // Cập nhật user note
  updateUserNote: async (id: number, note: string): Promise<void> => {
    await apiClient.put(`/knowledge/${id}/user-note`, { note });
  },

  // Regenerate study guide bằng AI
  regenerateStudyGuide: async (id: number): Promise<string> => {
    const response = await apiClient.post(`/knowledge/${id}/regenerate-study-guide`);
    return response.data;
  },

  // Regenerate key notes bằng AI
  regenerateKeyNotes: async (id: number): Promise<string> => {
    const response = await apiClient.post(`/knowledge/${id}/regenerate-key-notes`);
    return response.data;
  }
};

// ==================== UTILITY FUNCTIONS ====================
export const evarTutorUtils = {
  // Polling để kiểm tra status của knowledge base
  pollKnowledgeBaseStatus: async (
    knowledgeBaseId: number,
    onStatusUpdate: (status: KnowledgeBaseStatus) => void,
    onComplete: (status: KnowledgeBaseStatus) => void,
    onError: (error: Error) => void,
    maxAttempts: number = 30,
    intervalMs: number = 2000
  ): Promise<void> => {
    let attempts = 0;
    
    const poll = async () => {
      try {
        attempts++;
        const status = await knowledgeBaseService.getKnowledgeBaseStatus(knowledgeBaseId);
        
        onStatusUpdate(status);
        
        if (status.status === 'READY' || status.status === 'FAILED') {
          onComplete(status);
          return;
        }
        
        if (attempts >= maxAttempts) {
          onError(new Error('Timeout: Knowledge base processing took too long'));
          return;
        }
        
        setTimeout(poll, intervalMs);
      } catch (error) {
        onError(error as Error);
      }
    };
    
    poll();
  },

  // Format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Validate PDF file
  validatePdfFile: (file: File): { isValid: boolean; error?: string } => {
    if (!file) {
      return { isValid: false, error: 'Vui lòng chọn file' };
    }
    
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return { isValid: false, error: 'Chỉ chấp nhận file PDF' };
    }
    
    if (file.size > 10 * 1024 * 1024) {
      return { isValid: false, error: 'File quá lớn (tối đa 10MB)' };
    }
    
    return { isValid: true };
  }
};

export default {
  flashcardService,
  chatbotService,
  knowledgeBaseService,
  evarTutorUtils
};
