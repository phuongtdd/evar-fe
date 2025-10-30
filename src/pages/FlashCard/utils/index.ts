import { FlashCard } from '../types';
import { MASTERY_LEVELS } from '../constants';

export const generateId = (): string => {
  return `fc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getMasteryLevelInfo = (level: number) => {
  if (level <= 25) return MASTERY_LEVELS.BEGINNER;
  if (level <= 50) return MASTERY_LEVELS.LEARNING;
  if (level <= 75) return MASTERY_LEVELS.FAMILIAR;
  return MASTERY_LEVELS.MASTERED;
};

export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const calculateProgress = (cards: FlashCard[]): {
  total: number;
  mastered: number;
  learning: number;
  beginner: number;
} => {
  const total = cards.length;
  const mastered = cards.filter(c => c.masteryLevel >= 76).length;
  const learning = cards.filter(c => c.masteryLevel >= 26 && c.masteryLevel <= 75).length;
  const beginner = cards.filter(c => c.masteryLevel <= 25).length;
  
  return { total, mastered, learning, beginner };
};

