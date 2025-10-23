export interface Answer {
  id?: string
  isCorrect: boolean
  content: string
  createdBy?: string
  updatedBy?: string
  createdAt?: string
  updatedAt?: string
}

export interface Question {
  id?: string
  number?: number
  content: string
  questionType: string
  hardLevel: number
  quesScore?: number
  answers: Answer[]
  hasImage?: boolean
  imageSrc?: string
  questionImg?: string
  subjectId?: string
  createdBy?: string
  updatedBy?: string
  createdAt?: string
  updatedAt?: string
}

export interface QuestionCardProps {
  question: Question
  onDelete: () => void
}

export interface CreateExamRequest {
  examName: string
  examType: number
  subjectId: string
  description: string
  numOfQuestions: number
  duration?: number
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

export interface ExamInfo {
  examName: string
  examType: number
  subjectId: string
  description: string
}

// Exam interface for ExamManage module - matches backend API response
export interface Exam {
  id: string
  examName: string
  examType: number
  description: string
  numOfQuestions: number
  subjectName: string
  questions: Question[] | null
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string | null
  // Additional fields for display purposes
  subject?: string
  subjectId?: string // For form data compatibility
  duration?: number
  passingScore?: number
  status?: "active" | "inactive" | "draft"
}
