export interface FlashCard {
  id: string;
  front: string;
  back: string;
  createdAt: string;
  // Optional fields (not used in API response)
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  reviewCount?: number;
  masteryLevel?: number; // 0-100
  tags?: string[];
}

export interface FlashCardSet {
  id: string;
  name: string;
  description: string;
  cards: FlashCard[];
  createdAt: string;
  updatedAt: string;
}

export interface StudySession {
  id: string;
  setId: string;
  startTime: string;
  endTime?: string;
  cardsReviewed: number;
  correctAnswers: number;
  totalCards: number;
}

export interface FlashCardFormData {
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

// Export CardSet types
export * from './cardSet';

