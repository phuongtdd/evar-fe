import type { UserProfile, Assessment, Subject, Activity } from "../types"
import { COLORS, SUBJECTS } from "../constants"

export const mockUserProfile: UserProfile = {
  id: "1",
  name: "Lê Văn",
  age: "A",
  dateOfBirth: "20/08/2000",
  gender: "Nam",
  status: "Đang hoạt động",
  avatar: "/cartoon-student-avatar.jpg",
  face: "",
  email: "LeVanA123@gmail.com",
  phone: "0983752323",
  address: "123 Tran Hung Dao, Hoa Xuan, Da Nang.",
}

export const mockAssessments: Assessment[] = [
  {
    label: "Điểm cao nhất",
    value: 9,
    max: 10,
    color: COLORS.primary,
  },
  {
    label: "Quiz đã làm",
    value: 24,
    max: 50,
    color: COLORS.green,
  },
  {
    label: "Thời gian tập trung",
    value: 1,
    max: 24,
    color: COLORS.yellow,
  },
]

export const mockSubjects: Subject[] = [
  { name: SUBJECTS.TIENG_ANH, color: COLORS.primary },
  { name: SUBJECTS.TOAN, color: COLORS.green },
  { name: SUBJECTS.LICH_SU, color: COLORS.orange },
  { name: SUBJECTS.LICH_SU, color: COLORS.red },
  { name: SUBJECTS.SINH_HOC, color: COLORS.orange },
  { name: SUBJECTS.SINH_HOC, color: COLORS.cyan },
  { name: SUBJECTS.SINH_HOC, color: COLORS.magenta },
  { name: SUBJECTS.SINH_HOC, color: COLORS.brown },
]

export const mockActivities: Activity[] = [
  {
    id: "1",
    name: "Tham gia phòng #4584",
    time: "20:20 - 20:50 - 21/12/2024",
    type: "Meet room",
    typeColor: COLORS.primary,
    subject: SUBJECTS.LICH_SU,
    subjectColor: COLORS.orange,
  },
  {
    id: "2",
    name: "Tham gia phòng #4582",
    time: "20:20 - 20:50 - 21/12/2024",
    type: "Meet room",
    typeColor: COLORS.primary,
    subject: SUBJECTS.SINH_HOC,
    subjectColor: COLORS.magenta,
  },
  {
    id: "3",
    name: "Làm Quiz # 2",
    time: "20:20 - 20:50 - 21/12/2024",
    type: "Quizz",
    typeColor: COLORS.green,
    subject: SUBJECTS.TOAN,
    subjectColor: COLORS.green,
  },
  {
    id: "4",
    name: "Làm Exam # 1",
    time: "20:20 - 20:50 - 21/12/2024",
    type: "Exam",
    typeColor: COLORS.yellow,
    subject: SUBJECTS.TIENG_ANH,
    subjectColor: COLORS.primary,
  },
  {
    id: "5",
    name: "Làm Quiz #12",
    time: "20:20 - 20:50 - 21/12/2024",
    type: "Quizz",
    typeColor: COLORS.green,
    subject: SUBJECTS.TIENG_ANH,
    subjectColor: COLORS.primary,
  },
]
