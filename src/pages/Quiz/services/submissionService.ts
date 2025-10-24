import apiClient from '../../../configs/axiosConfig';

export interface SubmissionResponse {
  id: string;
  totalScore: number;
  timeTry: number;
  username: string;
  examName: string;
  examId: string;
  submittedAt: string | null;
}

export interface SubmissionListResponse {
  data: SubmissionResponse[];
  message: string;
  pageMetadata?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface QuestionResult {
  questionContent: string;
  questionImg?: string;
  answers: AnswerResult[];
}

export interface AnswerResult {
  answerContent: string;
  correct: boolean;
  select: boolean;
}

export interface SubmissionDetailResponse {
  id: string;
  totalScore: number;
  timeTry: number;
  username: string;
  examName: string;
  examId: string;
  submittedAt: string | null;
  questions: QuestionResult[];
}

export const fetchUserSubmissions = async (userId: string): Promise<SubmissionResponse[]> => {
  try {
    console.log(' Fetching user submissions for userId:', userId);
    console.log(' API URL:', `/submission/user-all?id=${userId}`);
    const response = await apiClient.get<{ data: SubmissionResponse[]; message: string }>(`/submission/user-all?id=${userId}`);
    console.log('User submissions response:', response.data);
    console.log('Raw data from backend:', JSON.stringify(response.data.data, null, 2));
    
    if (response.data.data && response.data.data.length > 0) {
      response.data.data.forEach((submission, index) => {
        console.log(` ${index} submittedAt:`, submission.submittedAt, 'Type:', typeof submission.submittedAt);
      });
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error(' Error fetching user submissions:', error);
    console.error(' Error details:', {
      message: error?.response?.data?.message || error?.message,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      url: error?.config?.url
    });
    throw error;
  }
};

// Lấy tất cả submissions với phân trang
export const fetchAllSubmissions = async (page: number = 0, pageSize: number = 10): Promise<SubmissionListResponse> => {
  try {
    const response = await apiClient.get<SubmissionListResponse>('/submission/all', {
      params: { page, pageSize }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all submissions:', error);
    throw error;
  }
};

// Lấy chi tiết submission
export const fetchSubmissionDetails = async (id: string): Promise<SubmissionDetailResponse> => {
  try {
    const response = await apiClient.get<{ data: SubmissionDetailResponse; message: string }>(`/submission?id=${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching submission details:', error);
    throw error;
  }
};

// Xóa submission
export const deleteSubmission = async (id: string): Promise<SubmissionResponse> => {
  try {
    console.log('🗑️ Attempting to delete submission with ID:', id);
    
    // Validate ID
    if (!id || id.trim() === '') {
      throw new Error('ID submission không hợp lệ');
    }
    
    const response = await apiClient.delete<{ data: SubmissionResponse; message: string }>(`/submission/delete?id=${id}`);
    console.log('✅ Delete submission response:', response.data);
    
    if (!response.data.data) {
      throw new Error('Không nhận được dữ liệu từ server');
    }
    
    return response.data.data;
  } catch (error: any) {
    console.error('❌ Error deleting submission:', error);
    console.error('❌ Error details:', {
      message: error?.response?.data?.message || error?.message,
      status: error?.response?.status,
      statusText: error?.response?.statusText,
      data: error?.response?.data,
      url: error?.config?.url,
      method: error?.config?.method
    });
    
    // Re-throw with more context
    if (error?.response?.status === 403) {
      throw new Error('Bạn không có quyền xóa bài làm này');
    } else if (error?.response?.status === 404) {
      throw new Error('Không tìm thấy bài làm để xóa');
    } else if (error?.response?.status === 500) {
      throw new Error('Lỗi server. Vui lòng thử lại sau');
    } else if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw error;
  }
};
