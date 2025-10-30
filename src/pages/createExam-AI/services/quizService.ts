import apiClient from '../../../configs/axiosConfig';
import { CreateQuizRequest } from '../types';

export const createQuizAIService = {
  async createQuiz(quizData: CreateQuizRequest) {
    try {
      const response = await apiClient.post('/quiz/create', quizData);
      return response.data;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },

  async processFileWithAI(file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiClient.post('/quiz/process-ai', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error processing file with AI:', error);
      throw error;
    }
  },

  async updateQuiz(quizId: string, quizData: CreateQuizRequest) {
    try {
      const response = await apiClient.put(`/quiz/${quizId}`, quizData);
      return response.data;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  },

  async deleteQuiz(quizId: string) {
    try {
      const response = await apiClient.delete(`/quiz/${quizId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  },

  async getQuiz(quizId: string) {
    try {
      const response = await apiClient.get(`/quiz/${quizId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz:', error);
      throw error;
    }
  },

  async getAllQuizzes() {
    try {
      const response = await apiClient.get('/quiz');
      return response.data;
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      throw error;
    }
  }
};
