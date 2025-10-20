
export interface Answer {
  isCorrect: number
  content: string
}

export interface Question {
  id?: number
  content: string
  questionType: number
  hardLevel: number
  answers: Answer[]
  hasImage: boolean
  imageUrl?: string
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
}

export interface Subject {
  id: number;
  value: string;
  label: string;
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
  grade: number;
}

export interface CreateQuizRequest {
  examName: string
  examType: number
  subjectId: string
  description: string
  numOfQuestions: number
  questions: Question[]
}

