import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { 
  StudyMaterial, 
  Quiz, 
  Flashcard, 
  FlashcardSet, 
  ChatSession, 
  Note, 
  UserProgress,
  SearchParams,
  PaginatedResponse
} from '../types';
import { 
  MaterialService, 
  QuizService, 
  FlashcardService, 
  ChatService, 
  NoteService, 
  UserProgressService 
} from '../services';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMaterials = (params?: SearchParams): UseApiState<PaginatedResponse<StudyMaterial>> & {
  createMaterial: (material: Omit<StudyMaterial, 'id' | 'uploadDate' | 'lastModified'>) => Promise<void>;
  updateMaterial: (id: string, updates: Partial<StudyMaterial>) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
} => {
  const [data, setData] = useState<PaginatedResponse<StudyMaterial> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await MaterialService.getAllMaterials(params);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch materials');
      message.error('Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  }, [params]);

  const createMaterial = useCallback(async (material: Omit<StudyMaterial, 'id' | 'uploadDate' | 'lastModified'>) => {
    try {
      setLoading(true);
      const response = await MaterialService.createMaterial(material);
      if (response.success) {
        message.success('Material created successfully');
        await fetchMaterials();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create material';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchMaterials]);

  const updateMaterial = useCallback(async (id: string, updates: Partial<StudyMaterial>) => {
    try {
      setLoading(true);
      const response = await MaterialService.updateMaterial(id, updates);
      if (response.success) {
        message.success('Material updated successfully');
        await fetchMaterials();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update material';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchMaterials]);

  const deleteMaterial = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await MaterialService.deleteMaterial(id);
      if (response.success) {
        message.success('Material deleted successfully');
        await fetchMaterials();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete material';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchMaterials]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  return {
    data,
    loading,
    error,
    refetch: fetchMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial
  };
};

// Single Material Hook
export const useMaterial = (id: string): UseApiState<StudyMaterial> => {
  const [data, setData] = useState<StudyMaterial | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterial = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await MaterialService.getMaterialById(id);
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch material');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMaterial();
  }, [fetchMaterial]);

  return {
    data,
    loading,
    error,
    refetch: fetchMaterial
  };
};

// Quizzes Hook
export const useQuizzes = (materialId?: string): UseApiState<Quiz[]> & {
  createQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateQuiz: (id: string, updates: Partial<Quiz>) => Promise<void>;
  deleteQuiz: (id: string) => Promise<void>;
} => {
  const [data, setData] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await QuizService.getAllQuizzes(materialId);
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch quizzes');
      message.error('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  }, [materialId]);

  const createQuiz = useCallback(async (quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const response = await QuizService.createQuiz(quiz);
      if (response.success) {
        message.success('Quiz created successfully');
        await fetchQuizzes();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create quiz';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchQuizzes]);

  const updateQuiz = useCallback(async (id: string, updates: Partial<Quiz>) => {
    try {
      setLoading(true);
      const response = await QuizService.updateQuiz(id, updates);
      if (response.success) {
        message.success('Quiz updated successfully');
        await fetchQuizzes();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update quiz';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchQuizzes]);

  const deleteQuiz = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await QuizService.deleteQuiz(id);
      if (response.success) {
        message.success('Quiz deleted successfully');
        await fetchQuizzes();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete quiz';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchQuizzes]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  return {
    data,
    loading,
    error,
    refetch: fetchQuizzes,
    createQuiz,
    updateQuiz,
    deleteQuiz
  };
};

// Flashcards Hook
export const useFlashcards = (materialId?: string): UseApiState<Flashcard[]> & {
  createFlashcard: (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'reviewCount' | 'successRate'>) => Promise<void>;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => Promise<void>;
  deleteFlashcard: (id: string) => Promise<void>;
} => {
  const [data, setData] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFlashcards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await FlashcardService.getAllFlashcards(materialId);
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch flashcards');
      message.error('Failed to fetch flashcards');
    } finally {
      setLoading(false);
    }
  }, [materialId]);

  const createFlashcard = useCallback(async (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'reviewCount' | 'successRate'>) => {
    try {
      setLoading(true);
      const response = await FlashcardService.createFlashcard(flashcard);
      if (response.success) {
        message.success('Flashcard created successfully');
        await fetchFlashcards();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create flashcard';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFlashcards]);

  const updateFlashcard = useCallback(async (id: string, updates: Partial<Flashcard>) => {
    try {
      setLoading(true);
      const response = await FlashcardService.updateFlashcard(id, updates);
      if (response.success) {
        message.success('Flashcard updated successfully');
        await fetchFlashcards();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update flashcard';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFlashcards]);

  const deleteFlashcard = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await FlashcardService.deleteFlashcard(id);
      if (response.success) {
        message.success('Flashcard deleted successfully');
        await fetchFlashcards();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete flashcard';
      setError(errorMessage);
      message.error(errorMessage);
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
    refetch: fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard
  };
};

// Chat Hook
export const useChat = (sessionId?: string): UseApiState<ChatSession[]> & {
  createSession: (session: Omit<ChatSession, 'id' | 'createdAt' | 'updatedAt' | 'messages'>) => Promise<void>;
  addMessage: (sessionId: string, message: Omit<import('../types').ChatMessage, 'id' | 'timestamp'>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
} => {
  const [data, setData] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ChatService.getAllChatSessions();
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch chat sessions');
      message.error('Failed to fetch chat sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  const createSession = useCallback(async (session: Omit<ChatSession, 'id' | 'createdAt' | 'updatedAt' | 'messages'>) => {
    try {
      setLoading(true);
      const response = await ChatService.createChatSession(session);
      if (response.success) {
        message.success('Chat session created successfully');
        await fetchSessions();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create chat session';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchSessions]);

  const addMessage = useCallback(async (sessionId: string, chatMessage: Omit<import('../types').ChatMessage, 'id' | 'timestamp'>) => {
    try {
      setLoading(true);
      const response = await ChatService.addMessage(sessionId, chatMessage);
      if (response.success) {
        await fetchSessions();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add message';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchSessions]);

  const deleteSession = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await ChatService.deleteChatSession(id);
      if (response.success) {
        message.success('Chat session deleted successfully');
        await fetchSessions();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete chat session';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchSessions]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    data,
    loading,
    error,
    refetch: fetchSessions,
    createSession,
    addMessage,
    deleteSession
  };
};

// Notes Hook
export const useNotes = (materialId?: string): UseApiState<Note[]> & {
  createNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
} => {
  const [data, setData] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await NoteService.getAllNotes(materialId);
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notes');
      message.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, [materialId]);

  const createNote = useCallback(async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      const response = await NoteService.createNote(note);
      if (response.success) {
        message.success('Note created successfully');
        await fetchNotes();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create note';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchNotes]);

  const updateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    try {
      setLoading(true);
      const response = await NoteService.updateNote(id, updates);
      if (response.success) {
        message.success('Note updated successfully');
        await fetchNotes();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update note';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchNotes]);

  const deleteNote = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await NoteService.deleteNote(id);
      if (response.success) {
        message.success('Note deleted successfully');
        await fetchNotes();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete note';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchNotes]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    data,
    loading,
    error,
    refetch: fetchNotes,
    createNote,
    updateNote,
    deleteNote
  };
};

// User Progress Hook
export const useUserProgress = (materialId?: string): UseApiState<UserProgress[]> & {
  updateProgress: (materialId: string, updates: Partial<UserProgress>) => Promise<void>;
} => {
  const [data, setData] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await UserProgressService.getUserProgress(materialId);
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress');
      message.error('Failed to fetch progress');
    } finally {
      setLoading(false);
    }
  }, [materialId]);

  const updateProgress = useCallback(async (materialId: string, updates: Partial<UserProgress>) => {
    try {
      setLoading(true);
      const response = await UserProgressService.updateProgress(materialId, updates);
      if (response.success) {
        message.success('Progress updated successfully');
        await fetchProgress();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update progress';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchProgress]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    data,
    loading,
    error,
    refetch: fetchProgress,
    updateProgress
  };
};
