import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { flashcardService } from '../services/flashcardService';
import { FlashCard, FlashCardFormData } from '../types';

export const useFlashCards = () => {
  const [flashcards, setFlashcards] = useState<FlashCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFlashcards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await flashcardService.getAllFlashCards();
      setFlashcards(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch flashcards';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createFlashcard = useCallback(async (data: FlashCardFormData) => {
    try {
      setLoading(true);
      const newCard = await flashcardService.createFlashCard(data);
      setFlashcards(prev => [newCard, ...prev]);
      message.success('Flashcard created successfully!');
      return newCard;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create flashcard';
      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateFlashcard = useCallback(async (id: string, data: Partial<FlashCardFormData>) => {
    try {
      setLoading(true);
      const updated = await flashcardService.updateFlashCard(id, data);
      setFlashcards(prev => prev.map(card => card.id === id ? updated : card));
      message.success('Flashcard updated successfully!');
      return updated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update flashcard';
      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFlashcard = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await flashcardService.deleteFlashCard(id);
      setFlashcards(prev => prev.filter(card => card.id !== id));
      message.success('Flashcard deleted successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete flashcard';
      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReviewStats = useCallback(async (id: string, correct: boolean) => {
    try {
      const updated = await flashcardService.updateReviewStats(id, correct);
      setFlashcards(prev => prev.map(card => card.id === id ? updated : card));
      return updated;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update review stats';
      message.error(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  return {
    flashcards,
    loading,
    error,
    refetch: fetchFlashcards,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    updateReviewStats,
  };
};

