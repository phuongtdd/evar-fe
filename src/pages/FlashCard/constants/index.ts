export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
} as const;

export const DIFFICULTY_LABELS = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
} as const;

export const DIFFICULTY_COLORS = {
  easy: 'green',
  medium: 'orange',
  hard: 'red',
} as const;

export const MASTERY_LEVELS = {
  BEGINNER: { min: 0, max: 25, label: 'Mới học', color: 'red' },
  LEARNING: { min: 26, max: 50, label: 'Đang học', color: 'orange' },
  FAMILIAR: { min: 51, max: 75, label: 'Quen thuộc', color: 'blue' },
  MASTERED: { min: 76, max: 100, label: 'Thành thạo', color: 'green' },
} as const;

export const CATEGORIES = [
  'Toán học',
  'Vật lý',
  'Hóa học',
  'Sinh học',
  'Lịch sử',
  'Địa lý',
  'Tiếng Anh',
  'Văn học',
  'Khác',
] as const;

