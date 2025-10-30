import { useState, useEffect } from 'react';
import type { CardSet, CreateCardSetRequest, UpdateCardSetRequest } from '../types';
import {
  getMyCardSets,
  createCardSet as createCardSetAPI,
  updateCardSet as updateCardSetAPI,
  deleteCardSet as deleteCardSetAPI,
} from '../services/cardSetService';

export const useCardSets = () => {
  const [cardSets, setCardSets] = useState<CardSet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch card sets
  const fetchCardSets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getMyCardSets();
      setCardSets(data);
    } catch (err: any) {
      console.error('❌ Lỗi trong useCardSets:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Tải danh sách flashcard thất bại';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchCardSets();
  }, []);

  // Create card set
  const createCardSet = async (data: CreateCardSetRequest): Promise<void> => {
    try {
      setLoading(true);
      const newCardSet = await createCardSetAPI(data);
      setCardSets(prev => [newCardSet, ...prev]);
    } catch (err: any) {
      console.error('❌ Lỗi khi tạo card set:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update card set
  const updateCardSet = async (data: UpdateCardSetRequest): Promise<void> => {
    try {
      setLoading(true);
      const updatedCardSet = await updateCardSetAPI(data);
      setCardSets(prev =>
        prev.map(set => (set.id === updatedCardSet.id ? updatedCardSet : set))
      );
    } catch (err: any) {
      console.error('❌ Lỗi khi cập nhật card set:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete card set
  const deleteCardSet = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await deleteCardSetAPI(id);
      setCardSets(prev => prev.filter(set => set.id !== id));
    } catch (err: any) {
      console.error('❌ Lỗi khi xóa card set:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh
  const refresh = () => {
    fetchCardSets();
  };

  return {
    cardSets,
    loading,
    error,
    createCardSet,
    updateCardSet,
    deleteCardSet,
    refresh,
  };
};

