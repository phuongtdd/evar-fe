import { Room, Quiz } from "../types/index"

export const mockRooms: Room[] = [
  {
    id: '1',
    title: 'Nhóm học Toán nâng cao',
    level: '5 người',
    duration: '48 giờ trước',
    quizCount: 60,
    status: 'active',
    createdDate: '2024-12-15'
  },
  {
    id: '2',
    title: 'Nhóm học Toán nâng cao',
    level: '5 người',
    duration: '48 giờ trước',
    quizCount: 60,
    status: 'active',
    createdDate: '2024-12-15'
  },
  {
    id: '3',
    title: 'Nhóm học Toán nâng cao',
    level: '5 người',
    duration: '48 giờ trước',
    quizCount: 60,
    status: 'active',
    createdDate: '2024-12-14'
  },
  {
    id: '4',
    title: 'Nhóm học Toán nâng cao',
    level: '5 người',
    duration: '48 giờ trước',
    quizCount: 60,
    status: 'active',
    createdDate: '2024-12-14'
  }
];

export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Đề thi thpt quốc gia môn toán - 2024',
    level: 'Easy',
    questions: 20,
    date: '20/2/2024',
    status: 'active'
  },
  {
    id: '2',
    title: 'Đề thi thpt quốc gia môn toán - 2024',
    level: 'Easy',
    questions: 20,
    date: '20/2/2024',
    status: 'active'
  },
  {
    id: '3',
    title: 'Đề thi thpt quốc gia môn toán - 2024',
    level: 'Easy',
    questions: 20,
    date: '20/2/2024',
    status: 'active'
  }
];
