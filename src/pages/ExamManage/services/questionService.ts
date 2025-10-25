import apiClient from '../../../configs/axiosConfig';

// API Response interface to match backend structure
interface ApiResponse<T> {
  data: T;
  message: string;
  pageMetadata?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

// Question interfaces matching backend models
export interface QuestionAddRequest {
  questionImg?: string;
  content: string;
  questionType: string;
  hardLevel: number;
  quesScore?: number;
  subjectId: string;
  answers: AnswerAddRequest[];
}

export interface QuestionUpdateRequest {
  id: string;
  questionImg?: string;
  content: string;
  questionType: string;
  hardLevel: number;
  quesScore?: number;
  subjectId?: string;
  answers: AnswerAddRequest[];
}

export interface AnswerAddRequest {
  isCorrect: boolean;
  content: string;
}

export interface QuestionResponse {
  id: string;
  questionImg?: string;
  content: string;
  questionType: string;
  hardLevel: number;
  subjectName: string;
  answers: AnswerResponse[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnswerResponse {
  id: string;
  isCorrect: boolean;
  content: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

// Question service for managing questions through backend API
export const questionService = {
  /**
   * Create a new question
   * POST /api/question
   */
  async createQuestion(questionData: QuestionAddRequest): Promise<QuestionResponse> {
    try {
      const response = await apiClient.post<ApiResponse<QuestionResponse>>('/question', questionData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },

  /**
   * Get a specific question by ID
   * GET /api/question
   */
  async getQuestion(questionId: string): Promise<QuestionResponse> {
    try {
      const response = await apiClient.get<ApiResponse<QuestionResponse>>(`/question?id=${questionId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching question:', error);
      throw error;
    }
  },

  /**
   * Update an existing question
   * PUT /api/question/update
   */
  async updateQuestion(questionData: QuestionUpdateRequest): Promise<QuestionResponse> {
    try {
      const response = await apiClient.put<ApiResponse<QuestionResponse>>('/question/update', questionData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },

  /**
   * Delete a question
   * DELETE /api/question/delete
   */
  async deleteQuestion(questionId: string): Promise<QuestionResponse> {
    try {
      const response = await apiClient.delete<ApiResponse<QuestionResponse>>(`/question/delete?id=${questionId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  },

  /**
   * Get all questions with pagination
   * GET /api/question/all
   */
  async getAllQuestions(page: number = 0, pageSize: number = 10): Promise<{ data: QuestionResponse[], total: number, pageMetadata?: any }> {
    try {
      const response = await apiClient.get<ApiResponse<QuestionResponse[]>>(`/question/all?page=${page}&pageSize=${pageSize}`);
      
      return {
        data: response.data.data,
        total: response.data.pageMetadata?.totalElements || response.data.data.length,
        pageMetadata: response.data.pageMetadata
      };
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  }
};
