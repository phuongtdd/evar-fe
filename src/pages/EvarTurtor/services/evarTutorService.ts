import apiClient from '../../../configs/axiosConfig';
import { ApiResponse, ChatRequest, ChatResponse, FlashcardRequest, FlashcardResponse, FlashcardUpdateRequest, KeyNotesResponse, KnowledgeBase, KnowledgeBaseOverview, KnowledgeBaseStatus, KnowledgeBaseUploadResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Helper to get real userId
const getRealUserId = (): string => {
  // Try explicit userId first
  const explicit = localStorage.getItem('userId');
  if (explicit && explicit !== 'default-user') return explicit;
  
  // Try to extract from JWT token
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const [, payloadB64] = token.split('.');
      const payload = JSON.parse(atob(payloadB64));
      const userId = payload?.userId || payload?.id || payload?.sub || payload?.user?.id;
      if (userId) {
        console.log('✅ Extracted userId from token:', userId);
        return userId;
      }
    } catch (e) {
      console.error('❌ Failed to parse JWT token:', e);
    }
  }
  
  console.warn('⚠️ No valid userId found, using default-user');
  return 'default-user';
};

export const flashcardService = {
  createFlashcard: async (request: FlashcardRequest): Promise<FlashcardResponse> => {
    const userId = getRealUserId();
    
    const setsResponse = await apiClient.get(`/card-set/my?userId=${userId}`);
    const sets = Array.isArray(setsResponse.data) ? setsResponse.data : [];
    
    let targetSet = sets.find((s: any) => s.knowledgeBaseId === request.knowledgeBaseId);
    
    if (!targetSet) {
      const createSetResponse = await apiClient.post('/card-set/generate/ai', null, {
        params: {
          knowledgeBaseId: request.knowledgeBaseId,
          count: 0
        }
      });
      targetSet = createSetResponse.data;
    }
    
    const response = await apiClient.post(`/card-set/${targetSet.id}/flashcards`, {
      userId: userId,
      knowledgeBaseId: request.knowledgeBaseId,
      front: request.front,
      back: request.back
    });
    return response.data;
  },

  getFlashcardById: async (id: string): Promise<ApiResponse<FlashcardResponse>> => {
    throw new Error('Get flashcard by ID is not available in current backend');
  },

  getFlashcardsByKnowledgeBaseId: async (knowledgeBaseId: number): Promise<FlashcardResponse[]> => {
    const userId = getRealUserId();
    console.log('🔍 [FLASHCARDS] Fetching card sets for userId:', userId, 'KB:', knowledgeBaseId);
    
    // Lấy thông tin KB để biết tên file
    const kbResponse = await apiClient.get(`/knowledge/${knowledgeBaseId}`);
    const fileName = kbResponse.data?.fileName;
    console.log('📄 [FLASHCARDS] KB fileName:', fileName);
    
    const response = await apiClient.get(`/card-set/my?userId=${userId}`);
    const sets = Array.isArray(response.data) ? response.data : [];
    
    console.log('📦 [FLASHCARDS] Received', sets.length, 'card sets:', sets.map((s: any) => ({
      id: s.id,
      name: s.name,
      knowledgeBaseId: s.knowledgeBaseId,
      totalCards: s.totalCards || s.flashcardCount
    })));
    
    // Lọc theo knowledgeBaseId HOẶC theo tên file (fallback nếu knowledgeBaseId null)
    const kbSets = sets.filter((s: any) => {
      // Ưu tiên filter theo knowledgeBaseId nếu có
      if (s.knowledgeBaseId === knowledgeBaseId) {
        return true;
      }
      // Fallback: filter theo tên file nếu knowledgeBaseId là null
      if (s.knowledgeBaseId === null && fileName && s.name) {
        return s.name.includes(fileName);
      }
      return false;
    });
    console.log('🎯 [FLASHCARDS] Found', kbSets.length, 'sets for KB', knowledgeBaseId);
    
    if (kbSets.length === 0) {
      console.warn('⚠️ [FLASHCARDS] No card sets found for this KB. This might mean:');
      console.warn('  1. Flashcards were not generated yet');
      console.warn('  2. UserId mismatch between KB and CardSet');
      console.warn('  3. KnowledgeBaseId mismatch or null');
      return [];
    }
    
    const allFlashcards: FlashcardResponse[] = [];
    for (const set of kbSets) {
      console.log('📥 [FLASHCARDS] Fetching details for set:', set.id);
      const detailResponse = await apiClient.get(`/card-set/${set.id}`);
      if (detailResponse.data && Array.isArray(detailResponse.data.flashcards)) {
        console.log('✅ [FLASHCARDS] Set', set.id, 'has', detailResponse.data.flashcards.length, 'flashcards');
        allFlashcards.push(...detailResponse.data.flashcards);
      }
    }
    
    console.log('✅ [FLASHCARDS] Total flashcards:', allFlashcards.length);
    return allFlashcards;
  },

  updateFlashcard: async (id: string, request: FlashcardUpdateRequest): Promise<FlashcardResponse> => {
    const response = await apiClient.put('/card-set/flashcards/update', {
      id: id,
      front: request.front,
      back: request.back
    });
    return response.data;
  },

  deleteFlashcard: async (id: string): Promise<void> => {
    await apiClient.delete(`/card-set/flashcards/${id}`);
  },

  generateFlashcards: async (knowledgeBaseId: number, count: number = 5): Promise<any> => {
    console.log('🤖 Generating flashcards for KB:', knowledgeBaseId, 'count:', count);
    const response = await apiClient.post('/card-set/generate/ai', null, {
      params: {
        knowledgeBaseId: knowledgeBaseId,
        count: count
      }
    });
    console.log('✅ Flashcard generation response:', response.data);
    // Backend returns CardSetResponse with flashcards array
    return response.data;
  },

  countFlashcardsByKnowledgeBaseId: async (knowledgeBaseId: number): Promise<number> => {
    const flashcards = await flashcardService.getFlashcardsByKnowledgeBaseId(knowledgeBaseId);
    return flashcards.length;
  }
};

export const chatbotService = {
  // Chat với AI dựa trên knowledge base
  chat: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await apiClient.post('/chat', request);
    return response.data;
  }
};

export const knowledgeBaseService = {
  uploadPdf: async (file: File, userId?: string): Promise<KnowledgeBaseUploadResponse> => {
    console.log('🚀 Starting PDF upload process...', {
      fileName: file.name,
      fileSize: file.size,
      userId: userId || 'not provided'
    });

    try {
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

      console.log('Cloudinary response status:', cloudinaryUpload.status);

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

      const backendFormData = new FormData();
      backendFormData.append('file', file);
      backendFormData.append('fileUrl', fileUrl);
      if (userId) {
        backendFormData.append('userId', userId);
      }

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

      if (!response.data.fileUrl) {
        console.warn('⚠️ WARNING: Backend response does not contain fileUrl!');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw error;
    }
  },

  getKnowledgeBaseStatus: async (id: number): Promise<KnowledgeBaseStatus> => {
    const response = await apiClient.get(`/knowledge/${id}/status`);
    return response.data;
  },

  getUserKnowledgeBases: async (userId: string): Promise<KnowledgeBase[]> => {
    console.log('📋 Fetching knowledge bases for user:', userId);
    const response = await apiClient.get<KnowledgeBaseOverview[]>(`/knowledge/user/${userId}`);
    
    // Backend returns List<KnowledgeBaseOverview>
    const data = response.data;
    
    if (!Array.isArray(data)) {
      console.error('❌ Expected array but got:', typeof data);
      return [];
    }
    
    // Map KnowledgeBaseOverview to KnowledgeBase for frontend compatibility
    const knowledgeBases: KnowledgeBase[] = data.map((overview: KnowledgeBaseOverview) => ({
      id: overview.id,
      userId: overview.userId,
      fileName: overview.fileName,
      fileUrl: overview.fileUrl,
      status: overview.status,
      createdAt: overview.createdAt,
      // These fields are not in overview, will be loaded when detail is fetched
      studyGuide: '',
      keyNotes: '',
      userNote: ''
    }));
    
    console.log('✅ Fetched knowledge bases:', {
      count: knowledgeBases.length,
      items: knowledgeBases.map(kb => ({
        id: kb.id,
        fileName: kb.fileName,
        status: kb.status,
        hasFileUrl: !!kb.fileUrl
      }))
    });
    
    return knowledgeBases;
  },

  getKnowledgeBaseDetail: async (id: number): Promise<KnowledgeBase> => {
    const response = await apiClient.get(`/knowledge/${id}`);
    return response.data;
  },

  getKeyNotes: async (id: number): Promise<KeyNotesResponse> => {
    const response = await apiClient.get(`/knowledge/${id}/key-notes`);
    return response.data;
  },

  updateUserNote: async (id: number, note: string): Promise<void> => {
    await apiClient.put(`/knowledge/${id}/user-note`, { note });
  },

  regenerateStudyGuide: async (id: number): Promise<string> => {
    const response = await apiClient.post(`/knowledge/${id}/regenerate-study-guide`);
    return response.data;
  },

  regenerateKeyNotes: async (id: number): Promise<string> => {
    const response = await apiClient.post(`/knowledge/${id}/regenerate-key-notes`);
    return response.data;
  }
};


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
