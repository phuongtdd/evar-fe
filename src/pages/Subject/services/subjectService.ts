import apiClient from '../../../configs/axiosConfig';
import type { Subject } from '../types';

export interface SubjectResponse {
  id: string;
  subjectName: string;
  description: string;
  grade: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  pageMetadata?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface SubjectRequest {
  subjectName: string;
  description: string;
  grade: number;
}

export interface SubjectUpdateRequest {
  id: string;
  subjectName?: string;
  description?: string;
  grade?: number;
}

const mapToSubject = (response: SubjectResponse): Subject => ({
  id: response.id,
  subject_name: response.subjectName,
  description: response.description,
  grade: response.grade,
  create_at: new Date(response.createdAt),
  create_by: response.createdBy,
  update_at: new Date(response.updatedAt),
  update_by: response.updatedBy,
});

export const subjectService = {
  async getAllSubjects(page = 0, pageSize = 100): Promise<{ subjects: Subject[]; total: number }> {
    const response = await apiClient.get<ApiResponse<SubjectResponse[]>>(`/subject/all?page=${page}&pageSize=${pageSize}`);
    const subjects = response.data.data.map(mapToSubject);
    const total = response.data.pageMetadata?.totalElements || subjects.length;
    return { subjects, total };
  },

  async getSubjectById(id: string): Promise<Subject> {
    const response = await apiClient.get<ApiResponse<SubjectResponse>>(`/subject?id=${id}`);
    return mapToSubject(response.data.data);
  },

  async createSubject(data: SubjectRequest): Promise<Subject> {
    const response = await apiClient.post<ApiResponse<SubjectResponse>>('/subject', data);
    return mapToSubject(response.data.data);
  },

  async updateSubject(data: SubjectUpdateRequest): Promise<Subject> {
    const response = await apiClient.put<ApiResponse<SubjectResponse>>('/subject/update', data);
    return mapToSubject(response.data.data);
  },

  async deleteSubject(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<SubjectResponse>>(`/subject/delete?id=${id}`);
  },
};
