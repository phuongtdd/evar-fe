import apiClient from '../../../configs/axiosConfig';
import { getUserIdFromToken } from '../utils/auth';
import type { CardSet, FlashCard, CreateCardSetRequest, CreateCardSetWithFlashcardsRequest, UpdateCardSetRequest } from '../types';

const API_BASE_URL = 'http://localhost:8080/api/card-set';

/**
 * Lấy danh sách card sets của user hiện tại
 */
export const getMyCardSets = async (): Promise<CardSet[]> => {
  try {
    const userId = getUserIdFromToken();
    
    if (!userId) {
      throw new Error('Không tìm thấy user id trong token. Vui lòng đăng nhập lại.');
    }

    console.log('🌐 Gọi API lấy card sets của user:', userId);
    
    const response = await apiClient.get<CardSet[]>(`${API_BASE_URL}/my`, {
      params: { userId }
    });

    console.log('✅ Nhận được card sets:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Lỗi khi lấy card sets:', error);
    throw error;
  }
};

/**
 * Lấy thông tin chi tiết một card set (bao gồm flashcards)
 */
export const getCardSetById = async (id: string): Promise<CardSet> => {
  try {
    console.log('🌐 Gọi API lấy card set với flashcards:', id);
    
    const response = await apiClient.get<CardSet>(`${API_BASE_URL}/${id}`);

    console.log('✅ Nhận được card set:', response.data);
    console.log('📚 Số lượng flashcards:', response.data.flashcards?.length || 0);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Lỗi khi lấy card set:', error);
    throw error;
  }
};

/**
 * Tạo card set mới
 */
export const createCardSet = async (data: CreateCardSetRequest): Promise<CardSet> => {
  try {
    const userId = getUserIdFromToken();
    
    if (!userId) {
      throw new Error('Không tìm thấy user id trong token. Vui lòng đăng nhập lại.');
    }

    console.log('🌐 Tạo card set mới:', data);
    
    const response = await apiClient.post<CardSet>(`${API_BASE_URL}`, {
      ...data,
      userId
    });

    console.log('✅ Tạo card set thành công:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Lỗi khi tạo card set:', error);
    throw error;
  }
};

/**
 * Tạo card set mới kèm flashcards
 */
export const createCardSetWithFlashcards = async (data: CreateCardSetWithFlashcardsRequest): Promise<CardSet> => {
  try {
    console.log('🌐 Tạo card set mới kèm flashcards:', data);
    
    const response = await apiClient.post<CardSet>(`${API_BASE_URL}`, data);

    console.log('✅ Tạo card set kèm flashcards thành công:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Lỗi khi tạo card set kèm flashcards:', error);
    throw error;
  }
};

/**
 * Cập nhật card set
 */
export const updateCardSet = async (data: UpdateCardSetRequest): Promise<CardSet> => {
  try {
    console.log('🌐 Cập nhật card set:', data);
    
    const response = await apiClient.put<CardSet>(`${API_BASE_URL}/update`, {
      id: data.id,
      name: data.name,
      description: data.description,
    });

    console.log('✅ Cập nhật card set thành công:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Lỗi khi cập nhật card set:', error);
    throw error;
  }
};

/**
 * Xóa card set
 */
export const deleteCardSet = async (id: string): Promise<void> => {
  try {
    console.log('🌐 Xóa card set:', id);
    
    await apiClient.delete(`${API_BASE_URL}/${id}`);

    console.log('✅ Xóa card set thành công');
  } catch (error: any) {
    console.error('❌ Lỗi khi xóa card set:', error);
    throw error;
  }
};

/**
 * Xóa flashcard
 */
export const deleteFlashcard = async (flashcardId: string): Promise<void> => {
  try {
    console.log('🌐 Xóa flashcard:', flashcardId);
    
    await apiClient.delete(`${API_BASE_URL}/flashcards/${flashcardId}`);

    console.log('✅ Xóa flashcard thành công');
  } catch (error: any) {
    console.error('❌ Lỗi khi xóa flashcard:', error);
    throw error;
  }
};

/**
 * Tạo flashcard mới
 */
export const createFlashcard = async (
  cardSetId: string, 
  data: { front: string; back: string }
): Promise<FlashCard> => {
  try {
    console.log('🌐 Tạo flashcard mới:', data);
    
    const response = await apiClient.post<FlashCard>(
      `${API_BASE_URL}/${cardSetId}/flashcards`,
      data
    );

    console.log('✅ Tạo flashcard thành công:', response.data);
    
    return response.data;
  } catch (error: any) {
    console.error('❌ Lỗi khi tạo flashcard:', error);
    throw error;
  }
};

/**
 * Cập nhật flashcard
 */
export const updateFlashcard = async (data: {
  id: string;
  front: string;
  back: string;
}): Promise<void> => {
  try {
    console.log('🌐 Cập nhật flashcard:', data);
    
    await apiClient.put(`${API_BASE_URL}/flashcards/update`, data);

    console.log('✅ Cập nhật flashcard thành công');
  } catch (error: any) {
    console.error('❌ Lỗi khi cập nhật flashcard:', error);
    throw error;
  }
};

