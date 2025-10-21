import { ExamConfig } from '../types';

export const EXAM_CONFIG: ExamConfig = {
  DEFAULT_TIME_LIMIT: 90 * 60, // 90 minutes in seconds
  QUESTION_TYPES: {
    '1': 'Trắc nghiệm nhiều lựa chọn',
    '2': 'Trắc nghiệm một lựa chọn',
    '3': 'Đúng/Sai',
    '4': 'Ghép đôi',
    '5': 'Tự luận'
  },
  DIFFICULTY_LEVELS: {
    1: 'Dễ',
    2: 'Trung bình',
    3: 'Khó',
    4: 'Rất khó'
  },
  EXAM_TYPES: {
    1: 'Thi chính thức',
    2: 'Thi thử',
    3: 'Luyện tập',
    4: 'Kiểm tra'
  }
};

export const EXAM_CONSTANTS = {
  TIMER_INTERVAL: 1000, // 1 second
  AUTO_SAVE_INTERVAL: 30000, // 30 seconds
  WARNING_TIME_THRESHOLD: 300, // 5 minutes
  CRITICAL_TIME_THRESHOLD: 60, // 1 minute
  MAX_ATTEMPTS: 3,
  FACE_VERIFICATION_TIMEOUT: 30000, // 30 seconds
  SUBMISSION_CONFIRMATION_TIMEOUT: 10000 // 10 seconds
};

export const EXAM_MESSAGES = {
  TIME_WARNING: 'Còn 5 phút nữa!',
  TIME_CRITICAL: 'Còn 1 phút nữa!',
  TIME_UP: 'Hết thời gian làm bài!',
  SUBMIT_CONFIRMATION: 'Bạn có chắc chắn muốn nộp bài?',
  SUBMIT_SUCCESS: 'Nộp bài thành công!',
  SUBMIT_ERROR: 'Có lỗi xảy ra khi nộp bài!',
  FACE_VERIFICATION_REQUIRED: 'Vui lòng xác thực khuôn mặt để bắt đầu thi',
  FACE_VERIFICATION_FAILED: 'Xác thực khuôn mặt thất bại',
  FACE_VERIFICATION_SUCCESS: 'Xác thực khuôn mặt thành công',
  EXAM_STARTED: 'Bắt đầu làm bài thi',
  EXAM_COMPLETED: 'Hoàn thành bài thi',
  ANSWER_SAVED: 'Đáp án đã được lưu',
  NETWORK_ERROR: 'Lỗi kết nối mạng',
  SERVER_ERROR: 'Lỗi máy chủ'
};

export const EXAM_STYLES = {
  COLORS: {
    PRIMARY: '#6392e9',
    PRIMARY_HOVER: '#5282d8',
    SUCCESS: '#52c41a',
    WARNING: '#faad14',
    ERROR: '#ff4d4f',
    BACKGROUND: '#f4f4f4',
    CARD_BACKGROUND: '#ffffff',
    BORDER: '#d5d5d5',
    TEXT_PRIMARY: '#000000',
    TEXT_SECONDARY: '#666666',
    MARKED: '#ffc107',
    ANSWERED: '#6392e9',
    UNANSWERED: '#c4c4c4'
  },
  SIZES: {
    BORDER_RADIUS: '8px',
    CARD_BORDER_RADIUS: '12px',
    BUTTON_HEIGHT: '43px',
    INPUT_HEIGHT: '40px',
    ICON_SIZE: '24px'
  },
  SPACING: {
    SMALL: '8px',
    MEDIUM: '16px',
    LARGE: '24px',
    XLARGE: '32px'
  }
};

export const EXAM_VALIDATION = {
  MIN_ANSWERS: 1,
  MAX_ANSWERS: 4,
  MIN_QUESTIONS: 1,
  MAX_QUESTIONS: 100,
  MIN_TIME_LIMIT: 60, 
  MAX_TIME_LIMIT: 180 * 60 
};

export const EXAM_ROUTES = {
  EXAM: '/exam',
  EXAM_RESULTS: '/exam/results',
  EXAM_HISTORY: '/exam/history',
  DASHBOARD: '/dashboard'
};
