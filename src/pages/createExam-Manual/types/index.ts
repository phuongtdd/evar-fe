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

export interface CreateExamRequest {
  examName: string
  examType: number
  subjectId: string
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

export interface ExamInfo {
  examName: string
  examType: number
  subjectId: string
  description: string
}
