import apiClient from '../../../configs/axiosConfig';

// ==================== TYPES ====================
export interface FlashcardRequest {
  front: string;
  back: string;
  knowledgeBaseId: number;
}

export interface FlashcardResponse {
  id: string;
  front: string;
  back: string;
  knowledgeBaseId: number;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardUpdateRequest {
  id: string;
  front: string;
  back: string;
}

export interface ChatRequest {
  knowledgeBaseId: number;
  question: string;
  topK?: number;
}

export interface SourceReference {
  pageNumber: number;
  snippet: string;
  similarity: number;
}

export interface ChatResponse {
  answer: string;
  sources: SourceReference[];
  chunksUsed: number;
}

export interface KnowledgeBaseUploadResponse {
  message: string;
  knowledgeBaseId: number;
  status: string;
}

export interface KnowledgeBaseStatus {
  id: number;
  fileName: string;
  status: string;
  createdAt: string;
}

export interface KnowledgeBase {
  id: number;
  userId?: string;
  fileName: string;
  fileUrl?: string;
  status: string;
  studyGuide?: string;
  keyNotes?: string;
  userNote?: string;
  createdAt: string;
}

export interface KeyNoteItem {
  id: string;
  content: string;
  pageNumber: number | null;
  relevance: number;
}

export interface KeyNotesResponse {
  notes: KeyNoteItem[];
  totalNotes: number;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  pageMetadata?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

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
  // Upload PDF file
  uploadPdf: async (file: File, userId?: string): Promise<KnowledgeBaseUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    if (userId) {
      formData.append('userId', userId);
    }

    const response = await apiClient.post('/knowledge/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Kiểm tra status của knowledge base
  getKnowledgeBaseStatus: async (id: number): Promise<KnowledgeBaseStatus> => {
    const response = await apiClient.get(`/knowledge/${id}/status`);
    return response.data;
  },

  // Lấy danh sách knowledge base của user
  getUserKnowledgeBases: async (userId: string): Promise<KnowledgeBase[]> => {
    const response = await apiClient.get(`/knowledge/user/${userId}`);
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
