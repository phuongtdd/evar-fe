import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { 
  flashcardService, 
  chatbotService, 
  knowledgeBaseService,
  evarTutorUtils,
  type FlashcardRequest,
  type FlashcardResponse,
  type FlashcardUpdateRequest,
  type ChatRequest,
  type ChatResponse,
  type KnowledgeBase,
  type KnowledgeBaseStatus,
  type KnowledgeBaseUploadResponse
} from '../services/evarTutorService';

// Re-export services for direct use in components
export { knowledgeBaseService, flashcardService };

export const getCurrentUserId = (): string | null => {
  const explicit = localStorage.getItem('userId');
  if (explicit) return explicit;
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const [, payloadB64] = token.split('.');
    const payload = JSON.parse(atob(payloadB64));
    return payload?.userId || payload?.id || payload?.sub || payload?.user?.id || null;
  } catch {
    return null;
  }
};

// ==================== KNOWLEDGE BASE HOOKS ====================
export const useKnowledgeBases = () => {
  const userId = getCurrentUserId() || undefined;
  const [data, setData] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchKnowledgeBases = useCallback(async () => {
    if (!userId) {
      setData([]);
      setError('Missing user session');
      return;
    }
    
    console.log('📋 Frontend: Fetching KB for userId:', userId);
    console.log('📋 Frontend: userId type:', typeof userId, 'length:', userId.length);
    
    try {
      setLoading(true);
      setError(null);
      const response = await knowledgeBaseService.getUserKnowledgeBases(userId);
      console.log('📋 Frontend: Received response:', response);
      setData(response);
    } catch (err) {
      const anyErr = err as any;
      const status = anyErr?.response?.status;
      // On 400/404, do not break UI; show empty list silently
      if (status === 400 || status === 404) {
        // Fallback: hydrate from local cache and detail endpoint
        try {
          const cacheKey = `evar_kb_cache_${userId}`;
          const cached = JSON.parse(localStorage.getItem(cacheKey) || '[]') as Array<{ id: number; fileName?: string; createdAt?: string }>;
          if (cached.length > 0) {
            const hydrated: KnowledgeBase[] = [];
            for (const c of cached) {
              try {
                const kb = await knowledgeBaseService.getKnowledgeBaseDetail(c.id);
                hydrated.push(kb);
              } catch {
                hydrated.push({
                  id: c.id,
                  fileName: c.fileName || `KB-${c.id}`,
                  status: 'PROCESSING',
                  createdAt: c.createdAt || new Date().toISOString(),
                } as KnowledgeBase);
              }
            }
            setData(hydrated);
            setError(null);
            return;
          }
          setData([]);
          setError(null);
        } catch {
          setData([]);
          setError(null);
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch knowledge bases';
        setError(errorMessage);
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchKnowledgeBases();
  }, [fetchKnowledgeBases]);

  return {
    data,
    loading,
    error,
    refetch: fetchKnowledgeBases
  };
};

export const useKnowledgeBaseStatus = (knowledgeBaseId: number) => {
  const [data, setData] = useState<KnowledgeBaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await knowledgeBaseService.getKnowledgeBaseStatus(knowledgeBaseId);
      setData(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch status';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [knowledgeBaseId]);

  useEffect(() => {
    if (knowledgeBaseId) {
      fetchStatus();
    }
  }, [fetchStatus, knowledgeBaseId]);

  return {
    data,
    loading,
    error,
    refetch: fetchStatus
  };
};

export const usePdfUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadPdf = useCallback(async (file: File, userId?: string) => {
    try {
      setUploading(true);
      setError(null);
      
      const validation = evarTutorUtils.validatePdfFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      const response = await knowledgeBaseService.uploadPdf(file, userId);
      message.success('File uploaded successfully! Processing...');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return {
    uploadPdf,
    uploading,
    error
  };
};

// ==================== FLASHCARD HOOKS ====================
export const useFlashcards = (knowledgeBaseId?: number) => {
  const [data, setData] = useState<FlashcardResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiAvailable, setApiAvailable] = useState(true);

  const fetchFlashcards = useCallback(async () => {
    if (!knowledgeBaseId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await flashcardService.getFlashcardsByKnowledgeBaseId(knowledgeBaseId);
      setData(response);
    } catch (err) {
      const anyErr = err as any;
      const status = anyErr?.response?.status;
      if (status === 404) {
        setApiAvailable(false);
      }
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch flashcards';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [knowledgeBaseId]);

  const createFlashcard = useCallback(async (request: FlashcardRequest) => {
    try {
      setLoading(true);
      const response = await flashcardService.createFlashcard(request);
      message.success('Flashcard created successfully!');
      await fetchFlashcards();
      return response;
    } catch (err) {
      const anyErr = err as any;
      const status = anyErr?.response?.status;
      if (status === 404) {
        setApiAvailable(false);
      }
      const errorMessage = err instanceof Error ? err.message : 'Failed to create flashcard';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFlashcards]);

  const updateFlashcard = useCallback(async (id: string, request: FlashcardUpdateRequest) => {
    try {
      setLoading(true);
      const response = await flashcardService.updateFlashcard(id, request);
      message.success('Flashcard updated successfully!');
      await fetchFlashcards();
      return response;
    } catch (err) {
      const anyErr = err as any;
      const status = anyErr?.response?.status;
      if (status === 404) {
        setApiAvailable(false);
      }
      const errorMessage = err instanceof Error ? err.message : 'Failed to update flashcard';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFlashcards]);

  const deleteFlashcard = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await flashcardService.deleteFlashcard(id);
      message.success('Flashcard deleted successfully!');
      await fetchFlashcards();
      return;
    } catch (err) {
      const anyErr = err as any;
      const status = anyErr?.response?.status;
      if (status === 404) {
        setApiAvailable(false);
      }
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete flashcard';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFlashcards]);

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  return {
    data,
    loading,
    error,
    apiAvailable,
    refetch: fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard
  };
};

// ==================== CHATBOT HOOKS ====================
export const useChatbot = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (request: ChatRequest): Promise<ChatResponse> => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatbotService.chat(request);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sendMessage,
    loading,
    error
  };
};

// ==================== UTILITY HOOKS ====================
export const usePollingStatus = (
  knowledgeBaseId: number,
  onStatusUpdate?: (status: KnowledgeBaseStatus) => void,
  onComplete?: (status: KnowledgeBaseStatus) => void,
  onError?: (error: Error) => void
) => {
  const [isPolling, setIsPolling] = useState(false);

  const startPolling = useCallback(() => {
    setIsPolling(true);
    evarTutorUtils.pollKnowledgeBaseStatus(
      knowledgeBaseId,
      (status: KnowledgeBaseStatus) => {
        onStatusUpdate?.(status);
      },
      (status: KnowledgeBaseStatus) => {
        setIsPolling(false);
        onComplete?.(status);
      },
      (error: Error) => {
        setIsPolling(false);
        onError?.(error);
      }
    );
  }, [knowledgeBaseId, onStatusUpdate, onComplete, onError]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  return {
    isPolling,
    startPolling,
    stopPolling
  };
};

// ==================== LEGACY COMPATIBILITY ====================
// These hooks maintain compatibility with existing components while using the new API

export const useMaterials = (_params?: any) => {
  // Map to knowledge bases for compatibility
  const { data: knowledgeBases, loading, error, refetch } = useKnowledgeBases();
  
  const materials = knowledgeBases.map(kb => ({
    id: kb.id.toString(),
    title: kb.fileName,
    type: 'pdf' as const,
    fileName: kb.fileName,
    fileSize: 0, // Not available in current API
    uploadDate: kb.createdAt,
    lastModified: kb.createdAt,
    status: kb.status.toLowerCase() as 'processing' | 'ready' | 'error',
    tags: [],
    description: kb.studyGuide || kb.keyNotes,
    thumbnailUrl: undefined,
    content: kb.studyGuide,
    metadata: {
      pages: undefined,
      resolution: undefined
    }
  }));

  return {
    data: { data: materials, total: materials.length, page: 1, limit: 10, hasNext: false, hasPrev: false },
    loading,
    error,
    refetch,
    createMaterial: async () => { throw new Error('Use uploadPdf instead'); },
    updateMaterial: async () => { throw new Error('Not implemented'); },
    deleteMaterial: async () => { throw new Error('Not implemented'); }
  };
};

export const useFlashcardsLegacy = (materialId?: string) => {
  const knowledgeBaseId = materialId ? parseInt(materialId) : undefined;
  const { data, loading, error, refetch, createFlashcard, updateFlashcard, deleteFlashcard } = useFlashcards(knowledgeBaseId);
  
  // Map to legacy format
  const legacyData = data.map(fc => ({
    id: fc.id,
    front: fc.front,
    back: fc.back,
    materialId: fc.knowledgeBaseId.toString(),
    materialTitle: '', // Not available in current API
    difficulty: 'easy' as const, // Not available in current API
    createdAt: fc.createdAt,
    lastReviewed: undefined,
    nextReview: undefined,
    reviewCount: 0,
    successRate: 0,
    tags: []
  }));

  return {
    data: legacyData,
    loading,
    error,
    refetch,
    createFlashcard: async (flashcard: any) => {
      const request: FlashcardRequest = {
        front: flashcard.front,
        back: flashcard.back,
        knowledgeBaseId: parseInt(flashcard.materialId)
      };
      return createFlashcard(request);
    },
    updateFlashcard: async (id: string, updates: any) => {
      const request: FlashcardUpdateRequest = {
        id,
        front: updates.front,
        back: updates.back
      };
      return updateFlashcard(id, request);
    },
    deleteFlashcard
  };
};
