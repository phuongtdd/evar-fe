import axios from 'axios';
import type { AxiosRequestConfig, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:8080/api';
 // Thêm một fallback URL để an toàn

// Tạo một instance của axios với cấu hình tập trung
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cấu hình Interceptor cho REQUEST (Gửi đi)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Chỉ login và register là public, /users cần authentication
    const publicEndpoints = ['/auth/login', '/auth/register'];
     const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );

     if (!isPublicEndpoint) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('🔑 Token được gửi kèm request:', token.substring(0, 20) + '...');
      } else {
        console.warn('⚠️ Không có token để gửi kèm request');
      }
    }

    // Logging trong môi trường dev
    if (import.meta.env && import.meta.env.DEV) {
        console.debug(`[DEV API] ${config.method?.toUpperCase()} ->`, config.url, config.data || '');
    }

    return config; // Trả về config để request tiếp tục
  },
  (error: AxiosError) => {
    // Xử lý lỗi từ phía request
    return Promise.reject(error);
  }
);

// Cấu hình Interceptor cho RESPONSE (Nhận về)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response trong môi trường dev
     if (import.meta.env && import.meta.env.DEV) {
        console.debug(`[DEV API] Response <-`, { url: response.config.url, status: response.status, body: response.data });
    }
    return response;
  },
  (error: AxiosError) => {
    // Xử lý lỗi tập trung cho tất cả các response
    // Ví dụ: Nếu nhận lỗi 401 (Unauthorized), tự động đăng xuất người dùng
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
)

export default apiClient;

