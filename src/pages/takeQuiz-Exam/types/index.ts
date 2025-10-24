// API Response Types
export interface ExamAnswer {
  isCorrect: boolean;
  content: string;
}

export interface ExamQuestion {
  questionImg: string | null;
  content: string;
  questionType: string;
  hardLevel: number;
  subjectName: string;
  answers: ExamAnswer[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface ExamData {
  examName: string;
  examType: number;
  description: string;
  numOfQuestions: number;
  subjectName: string;
  duration: number;
  questions: ExamQuestion[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface ExamResponse {
  code: number;
  message: string;
  data: ExamData;
}

// Component Types
export interface Answer {
  id: number;
  answerId: string;
  content: string;
  isCorrect: boolean;
  isSelected?: boolean;
}

export interface Question {
  id: number;
  questionId: string;
  content: string;
  questionType: string;
  hardLevel: number;
  subjectName: string;
  answers: Answer[];
  questionImg?: string | null;
  selectedAnswer?: number;
  selectedAnswers?: number[];
  isMarked?: boolean;
  isAnswered?: boolean;
}

export interface ExamState {
  examData: ExamData | null;
  questions: Question[];
  currentQuestionIndex: number;
  timeLeft: number;
  isExamStarted: boolean;
  isExamCompleted: boolean;
  userAnswers: { [questionId: string]: number | number[] };
  markedQuestions: Set<number>;
}

export interface ExamProps {
  examId?: string;
  onExamComplete?: (results: ExamResults) => void;
}

export interface ExamResults {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  userAnswers: { [questionId: string]: number | number[] };
  submissionId?: string;
  submissionDetails?: SubmissionDetailResponse | null;
}

export interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  onAnswerSelect: (answerIndex: number, isMultiple?: boolean) => void;
  onMarkQuestion: () => void;
  isMarked: boolean;
}

export interface AnswerOptionProps {
  answer: Answer;
  index: number;
  isSelected: boolean;
  isMultiple?: boolean;
  onSelect: () => void;
}

export interface ExamHeaderProps {
  examName: string;
  subjectName: string;
  timeLeft: string;
  totalQuestions: number;
  answeredQuestions: number;
}

export interface QuestionNavigationProps {
  questions: Question[];
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
  onSubmitExam: () => void;
}

export interface ExamTimerProps {
  timeLeft: number;
  subjectName: string;
  onTimeUp: () => void;
}

export interface ExamProgressProps {
  totalQuestions: number;
  answeredQuestions: number;
}

export interface ExamSubmissionProps {
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isVisible: boolean;
}

export interface ExamResultsProps {
  results: ExamResults;
  onRetake: () => void;
  onBackToDashboard: () => void;
  examState?: ExamState;
}

export interface ExamService {
  getExamById: (examId: string) => Promise<ExamResponse>;
  submitExamAnswers: (examId: string, answers: { [questionId: string]: number }) => Promise<any>;
}

export interface UseExamReturn {
  examState: ExamState;
  startExam: () => void;
  selectAnswer: (questionId: number, answerIndex: number, isMultiple?: boolean) => void;
  markQuestion: (questionId: number) => void;
  goToQuestion: (questionIndex: number) => void;
  submitExam: () => Promise<ExamResults>;
  resetExam: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface ExamConfig {
  DEFAULT_TIME_LIMIT: number;
  QUESTION_TYPES: { [key: string]: string };
  DIFFICULTY_LEVELS: { [key: number]: string };
  EXAM_TYPES: { [key: number]: string };
}

// Submission Detail API Types
export interface AnswerResult {
  answerContent: string;
  correct: boolean;
  select: boolean;
}

export interface QuestionResult {
  questionContent: string;
  answers: AnswerResult[];
}

export interface SubmissionDetailResponse {
  totalScore: number;
  timeTry: number;
  username: string;
  examName: string;
  questions: QuestionResult[];
}
