import apiClient from '../../../configs/axiosConfig';
import { CreateExamRequest, Exam } from '../types';

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

// Examination service for managing exams through backend API
export const examService = {
  /**
   * Create a new examination
   * POST /api/exam
   */
  async createExam(examData: CreateExamRequest): Promise<Exam> {
    try {
      const response = await apiClient.post<ApiResponse<Exam>>('/exam', examData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating exam:', error);
      throw error;
    }
  },

  /**
   * Update an existing examination
   * PUT /api/exam/update
   */
  async updateExam(examId: string, examData: Partial<CreateExamRequest>): Promise<Exam> {
    try {
      const updateData = { 
        id: examId,
        ...examData 
      };
      const response = await apiClient.put<ApiResponse<Exam>>('/exam/update', updateData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating exam:', error);
      throw error;
    }
  },

  /**
   * Delete an examination
   * DELETE /api/exam/delete
   */
  async deleteExam(examId: string): Promise<Exam> {
    try {
      const response = await apiClient.delete<ApiResponse<Exam>>(`/exam/delete?id=${examId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error deleting exam:', error);
      throw error;
    }
  },

  /**
   * Get a specific examination by ID
   * GET /api/exam
   */
  async getExam(examId: string): Promise<Exam> {
    try {
      const response = await apiClient.get<ApiResponse<Exam>>(`/exam?id=${examId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching exam:', error);
      throw error;
    }
  },

  /**
   * Get all examinations with pagination
   * GET /api/exam/all
   */
  async getAllExams(page: number = 0, pageSize: number = 10): Promise<{ data: Exam[], total: number, pageMetadata?: any }> {
    try {
      const response = await apiClient.get<ApiResponse<Exam[]>>(`/exam/all?page=${page}&pageSize=${pageSize}`);
      
      // The API already provides subjectName, so we just need to map it to subject for display
      const examsWithSubjectMapping = response.data.data.map(exam => ({
        ...exam,
        subject: exam.subjectName, // Map subjectName to subject for display
        subjectId: (exam as any).subjectId || '', // Use subjectId if available, otherwise empty string
        status: "active" as const, // Default status since API doesn't provide it
        // Keep dates as strings to match the interface
      }));
      
      return {
        data: examsWithSubjectMapping,
        total: response.data.pageMetadata?.totalElements || response.data.data.length,
        pageMetadata: response.data.pageMetadata
      };
    } catch (error) {
      console.error('Error fetching exams:', error);
      throw error;
    }
  }
};
