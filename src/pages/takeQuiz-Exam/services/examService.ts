import { ExamResponse, ExamService } from "../types";
import apiClient from "../../../configs/axiosConfig";
import { mockExamData } from "../mock/mockData";
import { getUserIdFromToken } from "../../../utils/auth";

class ExamServiceImpl implements ExamService {
  private baseURL = "/exam";

  async getExamById(examId: string): Promise<ExamResponse> {
    try {
      const response = await apiClient.get(`${this.baseURL}?id=${examId}`);
      console.log("getExamById: " + JSON.stringify(response, null, 0));
      return response.data;
    } catch (error) {
      console.error("Error fetching exam:", error);
      throw new Error("Không thể tải bài thi. Vui lòng thử lại.");
    }
  }

  async submitExamAnswers(
    examId: string,
    answers: { [questionId: string]: number },
    examData?: any
  ): Promise<any> {
    try {
      // Get user ID from token
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      }

      if (!examData) {
        throw new Error('Exam data is required for submission');
      }

      // Transform answers to match backend format
      // Note: answerIndex is 0-based, but we need to map to actual answer IDs
      const userAnswers = Object.entries(answers).map(([questionId, answerIndex]) => {
        // Find the question to get the actual answer ID
        const question = examData.questions.find((q: any) => q.id === questionId);
        if (!question) {
          throw new Error(`Question with ID ${questionId} not found`);
        }
        const selectedAnswer = question.answers[answerIndex];
        if (!selectedAnswer) {
          throw new Error(`Answer at index ${answerIndex} not found for question ${questionId}`);
        }
        return {
          questionId,
          answersId: [selectedAnswer.id] // Use actual answer ID from backend
        };
      });

      const requestData = {
        userId,
        examId,
        userAnswers
      };

      console.log('Submitting exam with data:', requestData);

      const response = await apiClient.post('/submission', requestData);
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
        savedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving exam progress:", error);
    }
  }

  async getExamHistory(): Promise<any[]> {
    try {
      const response = await apiClient.get(`${this.baseURL}/history`);
      return response.data;
    } catch (error) {
      console.error("Error fetching exam history:", error);
      throw new Error("Không thể tải lịch sử thi. Vui lòng thử lại.");
    }
  }

  async getExamResults(examId: string): Promise<any> {
    try {
      const response = await apiClient.get(`${this.baseURL}/${examId}/results`);
      return response.data;
    } catch (error) {
      console.error("Error fetching exam results:", error);
      throw new Error("Không thể tải kết quả thi. Vui lòng thử lại.");
    }
  }
}

export const examService = new ExamServiceImpl();
