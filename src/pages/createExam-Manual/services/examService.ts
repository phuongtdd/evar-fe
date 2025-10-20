import apiClient from '../../../configs/axiosConfig';
import { CreateExamRequest } from '../types';

export const createExamService = {
  async createExam(examData: CreateExamRequest) {
    try {
      const response = await apiClient.post('/exam', examData);
      return response.data;
    } catch (error) {
      console.error('Error creating exam:', error);
      throw error;
    }
  },

  async updateExam(examId: string, examData: CreateExamRequest) {
    try {
      const response = await apiClient.put(`/exam/update`, { ...examData, id: examId });
      return response.data;
    } catch (error) {
      console.error('Error updating exam:', error);
      throw error;
    }
  },

  async deleteExam(examId: string) {
    try {
      const response = await apiClient.delete(`/exam/delete?id=${examId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting exam:', error);
      throw error;
    }
  },

  async getExam(examId: string) {
    try {
      const response = await apiClient.get(`/exam?id=${examId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exam:', error);
      throw error;
    }
  },

  async getAllExams(page: number = 0, pageSize: number = 10) {
    try {
      const response = await apiClient.get(`/exam/all?page=${page}&pageSize=${pageSize}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exams:', error);
      throw error;
    }
  }
};
