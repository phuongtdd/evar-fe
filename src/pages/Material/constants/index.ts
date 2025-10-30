export  const FILE_TYPES = {
  PDF: 'pdf',
  IMAGE: 'image',
  DOCUMENT: 'document'
}

export const FILE_TYPE_LABELS = {
  [FILE_TYPES.PDF]: 'PDF Document',
  [FILE_TYPES.IMAGE]: 'Image',
  [FILE_TYPES.DOCUMENT]: 'Document'
} as const;

export const MATERIAL_STATUS = {
  PROCESSING: 'processing',
  READY: 'ready',
  ERROR: 'error'
} as const;

export const STATUS_LABELS = {
  [MATERIAL_STATUS.PROCESSING]: 'Processing',
  [MATERIAL_STATUS.READY]: 'Ready',
  [MATERIAL_STATUS.ERROR]: 'Error'
} as const;

export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
} as const;

export const DIFFICULTY_LABELS = {
  [DIFFICULTY_LEVELS.EASY]: 'Easy',
  [DIFFICULTY_LEVELS.MEDIUM]: 'Medium',
  [DIFFICULTY_LEVELS.HARD]: 'Hard'
} as const;

export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple-choice',
  TRUE_FALSE: 'true-false',
  FILL_BLANK: 'fill-blank',
  ESSAY: 'essay'
} as const;

export const QUESTION_TYPE_LABELS = {
  [QUESTION_TYPES.MULTIPLE_CHOICE]: 'Multiple Choice',
  [QUESTION_TYPES.TRUE_FALSE]: 'True/False',
  [QUESTION_TYPES.FILL_BLANK]: 'Fill in the Blank',
  [QUESTION_TYPES.ESSAY]: 'Essay'
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
  MIN_PAGE_SIZE: 5
} as const;

export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.txt'],
  MAX_FILES_PER_UPLOAD: 10
} as const;
