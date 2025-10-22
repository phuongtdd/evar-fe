export const COLORS = {
  primary: "#6392e9",
  green: "#4caf50",
  yellow: "#ffc107",
  orange: "#ff8800",
  red: "#cd0014",
  cyan: "#13a4cd",
  magenta: "#ff07d2",
  brown: "#b57b38",
  lightBlue: "#b0c8f5",
  background: "#f3f3f3",
  white: "#ffffff",
  gray: "#bcbcbc",
  darkGray: "#33363f",
  lightGray: "#e3e3e3",
}

export const ACTIVITY_TYPES = {
  MEET_ROOM: "Meet room",
  QUIZZ: "Quizz",
  EXAM: "Exam",
}

export const SUBJECTS = {
  TIENG_ANH: "Tiếng anh",
  TOAN: "Toán",
  LICH_SU: "Lịch sử",
  SINH_HOC: "Sinh học",
}

// Các endpoint API cho module userProfile, theo đúng cấu trúc của module authen
export const API_ENDPOINT = {
  // Gọi GET /users?id=<string>
  getUser: "/users",
}
