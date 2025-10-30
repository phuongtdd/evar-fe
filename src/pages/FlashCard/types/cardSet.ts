// FlashCard interface (simple version for API)
export interface FlashCard {
  id: string;
  front: string;
  back: string;
  createdAt: string;
}

// Card Set types (Bộ flashcard)
export interface CardSet {
  id: string;
  userId: string;
  name: string;
  description: string;
  knowledgeBaseId: string | null;
  totalCards: number;
  createdAt: string;
  flashcards?: FlashCard[]; // Optional: chỉ có khi gọi API chi tiết
}

// API Response envelope (theo chuẩn backend)
export interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

// Request to create card set
export interface CreateCardSetRequest {
  name: string;
  description: string;
  knowledgeBaseId?: string;
}

// Request to create card set with flashcards
export interface CreateCardSetWithFlashcardsRequest {
  userId: string;
  name: string;
  description: string;
  flashcards: Array<{ front: string; back: string }>;
}

// Request to update card set
export interface UpdateCardSetRequest {
  id: string;
  name?: string;
  description?: string;
}

