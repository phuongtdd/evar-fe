import { ExamResponse, ExamService } from '../types';
import apiClient from '../../../configs/axiosConfig';
import { mockExamData } from '../mock/mockData';

class ExamServiceImpl implements ExamService {
  private baseURL = '/exam';

  async getExamById(examId: string): Promise<ExamResponse> {
    try {
      const response = await apiClient.get(`${this.baseURL}?id=${examId}`);
      console.log("getExamById: "+JSON.stringify(response,null,0))
      return response.data;
    } catch (error) {
      console.error('Error fetching exam:', error);
      throw new Error('Không thể tải bài thi. Vui lòng thử lại.');
    }
  }

  async submitExamAnswers(
    examId: string,
    answers: { [questionId: number]: number }
  ): Promise<any> {
    try {
      const response = await apiClient.post(`${this.baseURL}/${examId}/submit`, {
        answers,
        submittedAt: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting exam:', error);
      throw new Error('Không thể nộp bài thi. Vui lòng thử lại.');
    }
  }

  async saveExamProgress(
    examId: string,
    answers: { [questionId: number]: number },
    currentQuestionIndex: number
  ): Promise<void> {
    try {
      await apiClient.post(`${this.baseURL}/${examId}/save-progress`, {
        answers,
        currentQuestionIndex,
        savedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving exam progress:', error);
    }
  }

  async getExamHistory(): Promise<any[]> {
    try {
      const response = await apiClient.get(`${this.baseURL}/history`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exam history:', error);
      throw new Error('Không thể tải lịch sử thi. Vui lòng thử lại.');
    }
  }

  async getExamResults(examId: string): Promise<any> {
    try {
      const response = await apiClient.get(`${this.baseURL}/${examId}/results`);
      return response.data;
    } catch (error) {
      console.error('Error fetching exam results:', error);
      throw new Error('Không thể tải kết quả thi. Vui lòng thử lại.');
    }
  }
}

export const examService = new ExamServiceImpl();
