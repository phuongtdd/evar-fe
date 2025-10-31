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


export interface FlashcardRequest {
  front: string;
  back: string;
  knowledgeBaseId: number;
}

export interface FlashcardResponse {
  id: string;
  front: string;
  back: string;
  createdAt: string;
  // Note: knowledgeBaseId is available in CardSetResponse, not in individual FlashcardResponse
  // Backend FlashcardResponse only has: id, front, back, createdAt
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
  fileUrl?: string;
}

export interface KnowledgeBaseStatus {
  id: number;
  fileName: string;
  status: string;
  createdAt: string;
}

// Backend returns KnowledgeBaseOverview for list endpoints
export interface KnowledgeBaseOverview {
  id: number;
  userId: string;
  fileName: string;
  fileUrl: string | null;
  status: string;
  createdAt: string;
}

// Backend returns KnowledgeBaseDetailResponse for detail endpoints
export interface KnowledgeBase {
  id: number;
  userId?: string;
  fileName: string;
  fileUrl?: string | null;
  status: string;
  studyGuide?: string;
  keyNotes?: string;
  userNote?: string;
  cardSets?: any[]; // CardSetResponse[] from backend
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