import apiClient from '../../../configs/axiosConfig';

export interface OcrExamRequest {
  file: File;
  subjectId: string;
  questionType?: string;
  duration?: number;
  examName?: string;
}

export interface OcrExamResponse {
  examName: string;
  examType: number;
  subjectId: string;
  description: string;
  numOfQuestions: number;
  duration: number;
  questions: {
    content: string;
    questionType: string;
    hardLevel: number;
    quesScore: number;
    subjectId: string;
    questionImg: string | null;
    answers: {
      content: string;
    }[];
  }[];
}

export const ocrService = {
  /**
   * Gửi file ảnh/PDF đến backend để tạo đề thi bằng OCR
   */
  async generateExamFromImage(request: OcrExamRequest): Promise<OcrExamResponse> {
    try {
      const formData = new FormData();
      formData.append('file', request.file);
      formData.append('subjectId', request.subjectId);
      formData.append('questionType', request.questionType || 'SINGLE_CHOICE');
      formData.append('duration', String(request.duration || 60));
      formData.append('examName', request.examName || 'Đề thi từ OCR');

      const response = await apiClient.post<OcrExamResponse>(
        '/ocr/generate-exam',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 seconds timeout for OCR processing
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Error generating exam from image:', error);
      
      // Handle specific error messages
      if (error.response?.data) {
        const errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : error.response.data.message || 'Lỗi xử lý OCR';
        throw new Error(errorMessage);
      }
      
      throw new Error('Không thể xử lý file. Vui lòng thử lại.');
    }
  },
};
