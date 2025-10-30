
export interface Answer {
  isCorrect: boolean
  content: string
}

export interface Question {
  id?: number
  number?: number
  content: string
  questionType: string
  hardLevel: number
  quesScore?: number
  answers: Answer[]
  hasImage?: boolean
  imageSrc?: string
  questionImg?: string
}

export interface QuestionCardProps {
  question: Question
  onDelete: () => void
}

export interface QuizState {
  fileUploaded: boolean
  setFileUploaded: (value: boolean) => void
  uploadedFile: { name: string; size: string }
  setUploadedFile: (value: { name: string; size: string }) => void
  results: Question[]
  setResults: (value: Question[]) => void
  quizInfo: QuizInfo | null
  setQuizInfo: (value: QuizInfo | null) => void
  isQuizInfoModalVisible: boolean
  setIsQuizInfoModalVisible: (value: boolean) => void
}

export interface QuizInfo {
  examName: string
  examType: number
  subjectId: string
  description: string
  grade: string
  questionType?: string
  duration?: number
}

export interface Subject {
  id: string;
  subject_name: string;
  description: string;
  grade: number;
  create_at: Date;
  create_by: string;
  update_at: Date;
  update_by: string;
}

export interface Grade {
  id: number;
  value: string;
  label: string;
}

export interface QuizProps{
    quiz : typeQuiz;
    onEdit?: (updatedQuiz: typeQuiz) => void;
}

export interface typeQuiz {
  name: string;
  subject: string;
  questionCount: number;
  creator: string;
  duration: string;
  grade: string;
}

export interface CreateQuizRequest {
  examName: string
  examType: number
  subjectId: number
  description: string
  numOfQuestions: number
  questions: {
    questionImg?: string
    content: string
    questionType: string
    hardLevel: number
    quesScore?: number
    answers: {
      isCorrect: boolean
      content: string
    }[]
  }[]
}

export interface CreateExamRequest {
  examName: string
  examType: number
  subjectId: string
  description: string
  numOfQuestions: number
  duration: number
  questions: {
    questionImg?: string
    content: string
    questionType: string
    hardLevel: number
    quesScore?: number
    answers: {
      isCorrect: boolean
      content: string
    }[]
  }[]
}

