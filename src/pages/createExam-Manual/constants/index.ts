export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: {
    value: '1',
    label: 'Trắc nghiệm nhiều lựa chọn',
    description: 'Nhiều đáp án có thể đúng'
  },
  SINGLE_CHOICE: {
    value: '2',
    label: 'Trắc nghiệm một lựa chọn',
    description: 'Chỉ một đáp án đúng'
  },
  TRUE_FALSE: {
    value: '3',
    label: 'Đúng/Sai',
    description: 'Câu hỏi đúng hoặc sai'
  },
  MATCH_ANSWER: {
    value: '4',
    label: 'Ghép đôi',
    description: 'Ghép các cặp tương ứng'
  },
  SUBJECTIVE_ANSWER: {
    value: '5',
    label: 'Tự luận',
    description: 'Câu trả lời mở'
  }
} as const;

export type QuestionTypeValue = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES]['value'];
