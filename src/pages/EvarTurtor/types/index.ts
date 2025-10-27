export interface StudyMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'image' | 'document';
  fileName: string;
  fileSize: number;
  uploadDate: string;
  lastModified: string;
  status: 'processing' | 'ready' | 'error';
  tags: string[];
  description?: string;
  thumbnailUrl?: string;
  content?: string;
  metadata?: {
    pages?: number;
    resolution?: string;
  };
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  materialId: string;
  materialTitle: string;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number; 
  isGenerated: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'essay';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  materialId: string;
  materialTitle: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  lastReviewed?: string;
  nextReview?: string;
  reviewCount: number;
  successRate: number;
  tags: string[];
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  materialId: string;
  materialTitle: string;
  flashcards: Flashcard[];
  createdAt: string;
  updatedAt: string;
  isGenerated: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  materialId?: string;
  materialTitle?: string;
  pageNumber?: number;
  type: 'text' | 'image' | 'file';
  metadata?: {
    confidence?: number;
    sources?: string[];
  };
}

export interface ChatSession {
  id: string;
  title: string;
  materialId?: string;
  materialTitle?: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  materialId?: string;
  materialTitle?: string;
  pageNumber?: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  isBookmarked: boolean;
}

export interface UserProgress {
  materialId: string;
  materialTitle: string;
  completionPercentage: number;
  timeSpent: number;
  lastAccessed: string;
  quizAttempts: number;
  averageScore: number;
  notesCount: number;
  flashcardsReviewed: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface MaterialFilter {
  type?: string[];
  status?: string[];
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface SearchParams {
  query: string;
  filters: MaterialFilter;
  sortBy: 'title' | 'date' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}
