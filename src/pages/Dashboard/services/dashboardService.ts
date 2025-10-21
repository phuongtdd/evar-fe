import apiClient from '../../../configs/axiosConfig';

export interface ExamSummary {
  id: string;
  title: string;
  level: 'Easy' | 'Medium' | 'Hard';
  questions: number;
  date: string;
  status: 'active' | 'completed';
  subject?: string;
  createdAt?: string;
}

export interface DashboardStats {
  totalExams: number;
  totalQuestions: number;
  totalStudyTime: number; // in minutes
  averageScore: number;
}

export const dashboardService = {
  async getAllExams(page: number = 0, pageSize: number = 10): Promise<{ exams: ExamSummary[], total: number }> {
    try {
      const response = await apiClient.get(`/exam/all?page=${page}&pageSize=${pageSize}`);
      const exams = response.data.data || response.data;

      // Transform backend data to frontend format
      const transformedExams: ExamSummary[] = exams.map((exam: any) => ({
        id: exam.id || exam.examId,
        title: exam.examName || exam.title,
        level: this.mapDifficultyLevel(exam.questions?.[0]?.hardLevel || 2), // Default to Medium
        questions: exam.numOfQuestions || exam.questions?.length || 0,
        date: exam.createdAt ? new Date(exam.createdAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
        status: 'active' as const,
        subject: exam.subjectName || 'Toán học',
        createdAt: exam.createdAt
      }));

      return {
        exams: transformedExams,
        total: response.data.total || transformedExams.length
      };
    } catch (error) {
      console.error('Error fetching exams:', error);
      // Return empty data instead of throwing to prevent UI crashes
      return { exams: [], total: 0 };
    }
  },

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Try to get stats from API, fallback to calculated stats
      const examsResponse = await this.getAllExams(0, 1000);
      const exams = examsResponse.exams;

      const totalExams = exams.length;
      const totalQuestions = exams.reduce((sum, exam) => sum + exam.questions, 0);
      const totalStudyTime = totalExams * 120; // Assume 2 hours per exam
      const averageScore = 85; // Mock average score, could be calculated from actual results

      return {
        totalExams,
        totalQuestions,
        totalStudyTime,
        averageScore
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default stats
      return {
        totalExams: 0,
        totalQuestions: 0,
        totalStudyTime: 0,
        averageScore: 0
      };
    }
  },

  mapDifficultyLevel(hardLevel: number): 'Easy' | 'Medium' | 'Hard' {
    switch (hardLevel) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      default: return 'Medium';
    }
  }
};
