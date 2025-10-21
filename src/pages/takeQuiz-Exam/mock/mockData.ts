import { ExamResponse } from '../types';

export const mockExamData: ExamResponse = {
  "code": 1000,
  "message": "Successfully added examination",
  "data": {
    "examName": "Đề thi Lịch Sử THPT Quốc gia",
    "examType": 1,
    "description": "Thi đại học",
    "numOfQuestions": 2,
    "subjectName": "Lịch Sử",
    "questions": [
      {
        "questionImg": null,
        "content": "Chiến dịch Điện biên phủ bắt đầu vào ngày tháng năm nào ?",
        "questionType": "1",
        "hardLevel": 1,
        "subjectName": "Lịch Sử",
        "answers": [
          {
            "isCorrect": false,
            "content": "22/12/1944"
          },
          {
            "isCorrect": false,
            "content": "20/10/1930"
          },
          {
            "isCorrect": false,
            "content": "10/11/1922"
          },
          {
            "isCorrect": true,
            "content": "13/03/1954"
          }
        ],
        "createdBy": "khanhdog",
        "updatedBy": "khanhdog",
        "createdAt": "2025-10-17T15:03:47.8526045",
        "updatedAt": null
      },
      {
        "questionImg": null,
        "content": "Phương đẹp trai cấm cãi ?",
        "questionType": "1",
        "hardLevel": 3,
        "subjectName": "Lịch Sử",
        "answers": [
          {
            "isCorrect": false,
            "content": "Đúng"
          },
          {
            "isCorrect": false,
            "content": "Sai"
          },
          {
            "isCorrect": false,
            "content": "Không biết"
          },
          {
            "isCorrect": true,
            "content": "Cãi"
          }
        ],
        "createdBy": "khanhdog",
        "updatedBy": "khanhdog",
        "createdAt": "2025-10-17T15:03:47.8576049",
        "updatedAt": null
      }
    ],
    "createdBy": "khanhdog",
    "updatedBy": "khanhdog",
    "createdAt": "2025-10-17T15:03:47.8406069",
    "updatedAt": null
  }
};

export const mockExamList = [
  {
    id: "1",
    examName: "Đề thi Lịch Sử THPT Quốc gia",
    examType: 1,
    subjectName: "Lịch Sử",
    numOfQuestions: 50,
    timeLimit: 90,
    description: "Thi đại học",
    createdAt: "2025-10-17T15:03:47.8406069"
  },
  {
    id: "2",
    examName: "Đề thi Toán THPT Quốc gia",
    examType: 1,
    subjectName: "Toán học",
    numOfQuestions: 50,
    timeLimit: 90,
    description: "Thi đại học",
    createdAt: "2025-10-17T15:03:47.8406069"
  },
  {
    id: "3",
    examName: "Đề thi Vật Lý THPT Quốc gia",
    examType: 1,
    subjectName: "Vật Lý",
    numOfQuestions: 40,
    timeLimit: 50,
    description: "Thi đại học",
    createdAt: "2025-10-17T15:03:47.8406069"
  }
];

export const mockExamResults = {
  examId: "1",
  examName: "Đề thi Lịch Sử THPT Quốc gia",
  totalQuestions: 50,
  answeredQuestions: 48,
  correctAnswers: 42,
  score: 84,
  timeSpent: 5400, // 90 minutes
  submittedAt: "2025-10-17T16:30:47.8406069",
  userAnswers: {
    1: 3,
    2: 0,
    3: 2,
    // ... more answers
  }
};

export const mockExamHistory = [
  {
    id: "1",
    examName: "Đề thi Lịch Sử THPT Quốc gia",
    subjectName: "Lịch Sử",
    score: 84,
    totalQuestions: 50,
    correctAnswers: 42,
    submittedAt: "2025-10-17T16:30:47.8406069",
    status: "completed"
  },
  {
    id: "2",
    examName: "Đề thi Toán THPT Quốc gia",
    subjectName: "Toán học",
    score: 92,
    totalQuestions: 50,
    correctAnswers: 46,
    submittedAt: "2025-10-16T14:20:47.8406069",
    status: "completed"
  },
  {
    id: "3",
    examName: "Đề thi Vật Lý THPT Quốc gia",
    subjectName: "Vật Lý",
    score: 76,
    totalQuestions: 40,
    correctAnswers: 30,
    submittedAt: "2025-10-15T10:15:47.8406069",
    status: "completed"
  }
];
