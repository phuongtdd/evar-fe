import apiClient from '../../../configs/axiosConfig';

export interface ExamResponse {
  id: string;
  examName: string;
  examType: number;
  description: string;
  numOfQuestions: number;
  subjectName: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string;
  questions: null;
}

export interface ExamListResponse {
  data: ExamResponse[];
  message: string;
  pageMetadata?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export const fetchExams = async (page: number = 0, pageSize: number = 10): Promise<ExamListResponse> => {
  try {
    const response = await apiClient.get<ExamListResponse>('/exam/all', {
      params: { page, pageSize }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching exams:', error);
    throw error;
  }
};

export const fetchExamById = async (id: string): Promise<ExamResponse> => {
  try {
    const response = await apiClient.get<{ data: ExamResponse; message: string }>(`/exam?id=${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching exam by ID:', error);
    throw error;
  }
};
