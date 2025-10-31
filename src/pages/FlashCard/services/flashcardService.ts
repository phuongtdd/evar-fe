import { FlashCard, FlashCardFormData } from '../types';
import { generateId } from '../utils';
import { mockFlashCards } from '../mock';

// Mock data storage
const STORAGE_KEY = 'evar_flashcards_v2'; // Changed to v2 to force reload mock data
const VERSION_KEY = 'evar_flashcards_version';
const CURRENT_VERSION = '2.1'; // Updated to force reload 7 items

const getMockFlashCards = (): FlashCard[] => {
  const storedVersion = localStorage.getItem(VERSION_KEY);
  const stored = localStorage.getItem(STORAGE_KEY);
  
  // If version changed or no data, reload mock data
  if (storedVersion !== CURRENT_VERSION || !stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockFlashCards));
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    return mockFlashCards;
  }
  
  return JSON.parse(stored);
};

const saveFlashCards = (cards: FlashCard[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
};

export const flashcardService = {
  // Get all flashcards
  getAllFlashCards: async (): Promise<FlashCard[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(getMockFlashCards());
      }, 300);
    });
  },

  // Get flashcard by ID
  getFlashCardById: async (id: string): Promise<FlashCard | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cards = getMockFlashCards();
        resolve(cards.find(c => c.id === id) || null);
      }, 200);
    });
  },

  // Create flashcard
  createFlashCard: async (data: FlashCardFormData): Promise<FlashCard> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cards = getMockFlashCards();
        const newCard: FlashCard = {
          id: generateId(),
          ...data,
          createdAt: new Date().toISOString(),
          reviewCount: 0,
          masteryLevel: 0,
        };
        cards.unshift(newCard);
        saveFlashCards(cards);
        resolve(newCard);
      }, 300);
    });
  },

  // Update flashcard
  updateFlashCard: async (id: string, data: Partial<FlashCardFormData>): Promise<FlashCard> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cards = getMockFlashCards();
        const index = cards.findIndex(c => c.id === id);
        if (index === -1) {
          reject(new Error('Flashcard not found'));
          return;
        }
        cards[index] = { ...cards[index], ...data };
        saveFlashCards(cards);
        resolve(cards[index]);
      }, 300);
    });
  },

  // Delete flashcard
  deleteFlashCard: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cards = getMockFlashCards();
        const filtered = cards.filter(c => c.id !== id);
        saveFlashCards(filtered);
        resolve();
      }, 300);
    });
  },

  // Update review stats
  updateReviewStats: async (id: string, correct: boolean): Promise<FlashCard> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const cards = getMockFlashCards();
        const index = cards.findIndex(c => c.id === id);
        if (index === -1) {
          reject(new Error('Flashcard not found'));
          return;
        }
        
        cards[index].reviewCount = (cards[index].reviewCount || 0) + 1;
        cards[index].lastReviewed = new Date().toISOString();
        
        // Update mastery level
        const currentMastery = cards[index].masteryLevel || 0;
        if (correct) {
          cards[index].masteryLevel = Math.min(100, currentMastery + 10);
        } else {
          cards[index].masteryLevel = Math.max(0, currentMastery - 5);
        }
        
        saveFlashCards(cards);
        resolve(cards[index]);
      }, 200);
    });
  },
};

