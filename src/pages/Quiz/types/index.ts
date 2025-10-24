export interface exam {
  id?: string; // May not be present in response
  examName: string;
  examType: number;
  description: string;
  numOfQuestions: number;
  subjectName: string;
  duration: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string;
  questions: null;
}


/////////////////////////////////////////////


export interface Question {
  id: number
  text: string
  options: string[]
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
  title: string;
  subject: string;
  description: string;
  grade: string;
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


export interface ExamProps{
    exam : typeExam;
    onEdit?: (updatedExam: typeExam) => void;
}

export interface typeExam {
  name: string;
  subject: string;
  questionCount: number;
  creator: string;
  duration: string;
  grade: number;
}

