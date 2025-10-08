export interface Room {
  id: string;
  title: string;
  level: string;
  duration: string;
  quizCount: number;
  status: 'active' | 'completed';
  createdDate: string;
}

export interface Quiz {
  id: string;
  title: string;
  level: 'Easy' | 'Medium' | 'Hard';
  questions: number;
  date: string;
  status: 'active' | 'completed';
}
