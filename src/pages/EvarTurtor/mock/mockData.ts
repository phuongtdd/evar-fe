import { 
  StudyMaterial, 
  Quiz, 
  Flashcard, 
  FlashcardSet, 
  ChatMessage, 
  ChatSession, 
  Note, 
  UserProgress 
} from '../types';

export const FILE_TYPES = {
  PDF: 'pdf',
  IMAGE: 'image',
  DOCUMENT: 'document'
} as const;

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

export const MOCK_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-001',
    title: 'Introduction to React Hooks',
    type: 'pdf',
    fileName: 'react-hooks-guide.pdf',
    fileSize: 2048576,
    uploadDate: '2024-01-15T10:30:00Z',
    lastModified: '2024-01-15T10:30:00Z',
    status: 'ready',
    tags: ['react', 'hooks', 'frontend', 'javascript'],
    description: 'Comprehensive guide to React Hooks with examples and best practices',
    thumbnailUrl: '/api/thumbnails/react-hooks.jpg',
    content: 'React Hooks are functions that let you use state and other React features...',
    metadata: {
      pages: 45
    }
  },
  {
    id: 'mat-002',
    title: 'TypeScript Advanced Types',
    type: 'pdf',
    fileName: 'typescript-advanced.pdf',
    fileSize: 1536000,
    uploadDate: '2024-01-16T14:20:00Z',
    lastModified: '2024-01-16T14:20:00Z',
    status: 'ready',
    tags: ['typescript', 'types', 'advanced', 'programming'],
    description: 'Deep dive into TypeScript advanced type system',
    thumbnailUrl: '/api/thumbnails/typescript.jpg',
    content: 'TypeScript provides several advanced types that help you model complex scenarios...',
    metadata: {
      pages: 32
    }
  },
  {
    id: 'mat-003',
    title: 'Database Design Principles',
    type: 'image',
    fileName: 'db-design-diagram.png',
    fileSize: 512000,
    uploadDate: '2024-01-17T09:15:00Z',
    lastModified: '2024-01-17T09:15:00Z',
    status: 'ready',
    tags: ['database', 'design', 'sql', 'architecture'],
    description: 'Visual diagram showing database design principles',
    thumbnailUrl: '/api/thumbnails/db-design.png',
    metadata: {
      resolution: '1920x1080'
    }
  },
  {
    id: 'mat-005',
    title: 'CSS Grid Layout Guide',
    type: 'document',
    fileName: 'css-grid-guide.docx',
    fileSize: 768000,
    uploadDate: '2024-01-19T11:30:00Z',
    lastModified: '2024-01-19T11:30:00Z',
    status: 'ready',
    tags: ['css', 'grid', 'layout', 'frontend'],
    description: 'Complete guide to CSS Grid Layout with practical examples',
    content: 'CSS Grid Layout is a two-dimensional layout system for the web...'
  }
];

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'quiz-001',
    title: 'React Hooks Fundamentals',
    description: 'Test your knowledge of React Hooks basics',
    materialId: 'mat-001',
    materialTitle: 'Introduction to React Hooks',
    questions: [
      {
        id: 'q1',
        question: 'What is the purpose of useState hook?',
        type: 'multiple-choice',
        options: [
          'To manage component state',
          'To create side effects',
          'To optimize performance',
          'To handle events'
        ],
        correctAnswer: 'To manage component state',
        explanation: 'useState is used to add state to functional components',
        points: 10
      },
      {
        id: 'q2',
        question: 'useEffect hook can replace componentDidMount lifecycle method',
        type: 'true-false',
        correctAnswer: 'true',
        explanation: 'useEffect can handle mounting, updating, and unmounting',
        points: 5
      },
      {
        id: 'q3',
        question: 'Complete the sentence: Custom hooks should start with the word _____',
        type: 'fill-blank',
        correctAnswer: 'use',
        explanation: 'Custom hooks must start with "use" to follow React conventions',
        points: 8
      }
    ],
    createdAt: '2024-01-15T12:00:00Z',
    updatedAt: '2024-01-15T12:00:00Z',
    difficulty: 'medium',
    estimatedTime: 15,
    isGenerated: true
  },
  {
    id: 'quiz-002',
    title: 'TypeScript Type System',
    description: 'Advanced TypeScript types and their usage',
    materialId: 'mat-002',
    materialTitle: 'TypeScript Advanced Types',
    questions: [
      {
        id: 'q4',
        question: 'What is a union type in TypeScript?',
        type: 'multiple-choice',
        options: [
          'A type that combines multiple types',
          'A type that extends another type',
          'A type that is optional',
          'A type that is generic'
        ],
        correctAnswer: 'A type that combines multiple types',
        explanation: 'Union types allow a value to be one of several types',
        points: 10
      }
    ],
    createdAt: '2024-01-16T15:00:00Z',
    updatedAt: '2024-01-16T15:00:00Z',
    difficulty: 'hard',
    estimatedTime: 20,
    isGenerated: true
  }
];

export const MOCK_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-001',
    front: 'What is useState hook used for?',
    back: 'Managing component state in functional components',
    materialId: 'mat-001',
    materialTitle: 'Introduction to React Hooks',
    difficulty: 'easy',
    createdAt: '2024-01-15T13:00:00Z',
    lastReviewed: '2024-01-20T10:00:00Z',
    nextReview: '2024-01-22T10:00:00Z',
    reviewCount: 5,
    successRate: 0.8,
    tags: ['react', 'hooks', 'state']
  },
  {
    id: 'fc-002',
    front: 'What is useEffect hook?',
    back: 'A hook that lets you perform side effects in functional components',
    materialId: 'mat-001',
    materialTitle: 'Introduction to React Hooks',
    difficulty: 'medium',
    createdAt: '2024-01-15T13:05:00Z',
    lastReviewed: '2024-01-19T14:30:00Z',
    nextReview: '2024-01-21T14:30:00Z',
    reviewCount: 3,
    successRate: 0.67,
    tags: ['react', 'hooks', 'effects']
  },
  {
    id: 'fc-003',
    front: 'What is a union type?',
    back: 'A type that allows a value to be one of several types',
    materialId: 'mat-002',
    materialTitle: 'TypeScript Advanced Types',
    difficulty: 'medium',
    createdAt: '2024-01-16T16:00:00Z',
    lastReviewed: '2024-01-18T09:15:00Z',
    nextReview: '2024-01-20T09:15:00Z',
    reviewCount: 2,
    successRate: 0.5,
    tags: ['typescript', 'types', 'union']
  }
];

// Mock Flashcard Sets
export const MOCK_FLASHCARD_SETS: FlashcardSet[] = [
  {
    id: 'fcs-001',
    title: 'React Hooks Essentials',
    description: 'Essential React Hooks concepts and usage',
    materialId: 'mat-001',
    materialTitle: 'Introduction to React Hooks',
    flashcards: MOCK_FLASHCARDS.filter(fc => fc.materialId === 'mat-001'),
    createdAt: '2024-01-15T13:00:00Z',
    updatedAt: '2024-01-15T13:00:00Z',
    isGenerated: true
  },
  {
    id: 'fcs-002',
    title: 'TypeScript Types',
    description: 'TypeScript type system fundamentals',
    materialId: 'mat-002',
    materialTitle: 'TypeScript Advanced Types',
    flashcards: MOCK_FLASHCARDS.filter(fc => fc.materialId === 'mat-002'),
    createdAt: '2024-01-16T16:00:00Z',
    updatedAt: '2024-01-16T16:00:00Z',
    isGenerated: true
  }
];

export const MOCK_CHAT_SESSIONS: ChatSession[] = [
  {
    id: 'chat-001',
    title: 'React Hooks Discussion',
    materialId: 'mat-001',
    materialTitle: 'Introduction to React Hooks',
    messages: [
      {
        id: 'msg-001',
        content: 'Can you explain the difference between useState and useReducer?',
        sender: 'user',
        timestamp: '2024-01-20T10:00:00Z',
        materialId: 'mat-001',
        materialTitle: 'Introduction to React Hooks',
        type: 'text'
      },
      {
        id: 'msg-002',
        content: 'useState is simpler and used for basic state management, while useReducer is more powerful for complex state logic with multiple sub-values. useReducer is similar to Redux reducers and is better when you have complex state updates.',
        sender: 'assistant',
        timestamp: '2024-01-20T10:01:00Z',
        materialId: 'mat-001',
        materialTitle: 'Introduction to React Hooks',
        type: 'text',
        metadata: {
          confidence: 0.95,
          sources: ['page 12', 'page 15']
        }
      }
    ],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:01:00Z',
    isActive: true
  }
];

// Mock Notes
export const MOCK_NOTES: Note[] = [
  {
    id: 'note-001',
    title: 'useState Hook Key Points',
    content: 'useState returns a stateful value and a function to update it. The initial state is only used during the first render.',
    materialId: 'mat-001',
    materialTitle: 'Introduction to React Hooks',
    pageNumber: 5,
    createdAt: '2024-01-15T14:00:00Z',
    updatedAt: '2024-01-15T14:00:00Z',
    tags: ['react', 'hooks', 'state'],
    isBookmarked: true
  },
  {
    id: 'note-002',
    title: 'TypeScript Union Types',
    content: 'Union types allow a variable to be one of several types. Use the pipe (|) operator to separate types.',
    materialId: 'mat-002',
    materialTitle: 'TypeScript Advanced Types',
    pageNumber: 8,
    createdAt: '2024-01-16T17:00:00Z',
    updatedAt: '2024-01-16T17:00:00Z',
    tags: ['typescript', 'types', 'union'],
    isBookmarked: false
  }
];

// Mock User Progress
export const MOCK_USER_PROGRESS: UserProgress[] = [
  {
    materialId: 'mat-001',
    materialTitle: 'Introduction to React Hooks',
    completionPercentage: 75,
    timeSpent: 120,
    lastAccessed: '2024-01-20T10:00:00Z',
    quizAttempts: 3,
    averageScore: 85,
    notesCount: 2,
    flashcardsReviewed: 8
  },
  {
    materialId: 'mat-002',
    materialTitle: 'TypeScript Advanced Types',
    completionPercentage: 45,
    timeSpent: 60,
    lastAccessed: '2024-01-19T15:30:00Z',
    quizAttempts: 1,
    averageScore: 70,
    notesCount: 1,
    flashcardsReviewed: 3
  }
];

// Helper functions for generating IDs
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
