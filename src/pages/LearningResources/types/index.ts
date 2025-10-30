export interface KnowledgeBase {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  flashcardCount: number;
  noteCount: number;
  keynoteCount: number;
  color?: string;
  fileUrl?: string; 
  }

export interface Flashcard {
  id: string;
  knowledgeBaseId: string;
  front: string;
  back: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  nextReview?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  knowledgeBaseId: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Keynote {
  id: string;
  knowledgeBaseId: string;
  title: string;
  slides: KeynoteSlide[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface KeynoteSlide {
  id: string;
  content: string;
  pageNumber: number | null;
  relevance: number;
}

export interface CreateKnowledgeBaseRequest {
  title: string;
  description: string;
  subject: string;
  grade: string;
}

export interface UpdateKnowledgeBaseRequest extends Partial<CreateKnowledgeBaseRequest> {
  id: string;
}
