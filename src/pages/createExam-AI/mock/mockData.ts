import { Grade, Subject } from "../types";


export const sampleQuestions = [
  {
    id: 1,
    number: 1,
    content: "Cho hàm số $$ y = f(x) $$ liên tục, nhận giá trị dương trên đoạn $$ [a; b] $$. Xét hình phẳng $$ (H) $$ giới hạn bởi đồ thị hàm số $$ y = f(x) $$, trục hoành và hai đường thẳng $$ x = a, x = b $$. Khối tròn xoay được tạo thành khi quay hình phẳng $$ (H) $$ quanh trục $$ Ox $$ có thể tích là:",
    questionType: "multiple_choice",
    hardLevel: 2,
    quesScore: 1.0,
    answers: [
      { isCorrect: true, content: "$$ V = \\pi \\int_{a}^{b} f(x) dx $$" },
      { isCorrect: false, content: "$$ V = \\pi \\int_{a}^{b} f(x) dxy $$" },
      { isCorrect: false, content: "$$ V = \\pi \\int_{a}^{b} f(x) dxiy $$" },
      { isCorrect: false, content: "$$ V = \\pi \\int_{a}^{b} f(x) dxiy $$" },
    ],
    hasImage: false,
  },
  {
    id: 2,
    number: 2,
    content: "Cho hàm số $$ y = f(x) $$ liên tục, nhận giá trị dương trên đoạn $$ [a; b] $$. Xét hình phẳng $$ (H) $$ giới hạn bởi đồ thị hàm số $$ y = f(x) $$, trục hoành và hai đường thẳng $$ x = a, x = b $$. Khối tròn xoay được tạo thành khi quay hình phẳng $$ (H) $$ quanh trục $$ Ox $$ có thể tích là:",
    questionType: "multiple_choice",
    hardLevel: 3,
    quesScore: 1.0,
    answers: [
      { isCorrect: false, content: "$$ V = \\pi \\int_{a}^{b} f(x) dx $$" },
      { isCorrect: true, content: "$$ V = \\pi \\int_{a}^{b} f(x) dxy $$" },
      { isCorrect: false, content: "$$ V = \\pi \\int_{a}^{b} f(x) dxiy $$" },
      { isCorrect: false, content: "$$ V = \\pi \\int_{a}^{b} f(x) dxiy $$" },
    ],
    hasImage: true,
    imageSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Quiz%20module%20-%20create%20Quiz-%20%20AI%20mode%20-%202-D9sfYujZX2PE5W4izxLBDBhmONACeD.png",
  },
  {
    id: 3,
    number: 3,
    content: "Cho hàm số $$ y = f(x) $$ liên tục, nhận giá trị dương trên đoạn $$ [a; b] $$. Xét hình phẳng $$ (H) $$ giới hạn bởi đồ thị hàm số $$ y = f(x) $$, trục hoành và hai đường thẳng $$ x = a, x = b $$. Khối tròn xoay được tạo thành khi quay hình phẳng $$ (H) $$ quanh trục $$ Ox $$ có thể tích là:",
    questionType: "multiple_choice",
    hardLevel: 1,
    quesScore: 1.0,
    answers: [
      { isCorrect: false, content: "$$ V = \\pi \\int_{a}^{b} f(x) dx $$" },
      { isCorrect: false, content: "$$ V = \\pi \\int_{a}^{b} f(x) dxy $$" },
      { isCorrect: true, content: "$$ V = \\pi \\int_{a}^{b} f(x) dxiy $$" },
      { isCorrect: false, content: "$$ V = \\pi \\int_{a}^{b} f(x) dxiy $$" },
    ],
    hasImage: true,
    imageSrc: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Quiz%20module%20-%20create%20Quiz-%20%20AI%20mode%20-%202-D9sfYujZX2PE5W4izxLBDBhmONACeD.png",
  },
];


export const subjects :Subject[] = [
  { id: 1, value: "math", label: "Toán học (Math)" },
  { id: 2, value: "english", label: "Tiếng Anh (English)" },
  { id: 3, value: "literature", label: "Ngữ văn (Literature)" },
  { id: 4, value: "physics", label: "Vật lý (Physics)" },
  { id: 5, value: "chemistry", label: "Hóa học (Chemistry)" },
  { id: 6, value: "biology", label: "Sinh học (Biology)" },
  { id: 7, value: "history", label: "Lịch sử (History)" },
  { id: 8, value: "geography", label: "Địa lý (Geography)" },
  { id: 9, value: "informatics", label: "Tin học (Informatics)" },
  { id: 10, value: "civic_education", label: "Giáo dục công dân (Civic Education)" },
  { id: 11, value: "physical_education", label: "Thể dục (Physical Education)" },
  { id: 12, value: "art", label: "Mỹ thuật (Art)" },
  { id: 13, value: "music", label: "Âm nhạc (Music)" },
];

export const grades: Grade[] = [
  { id: 1, value: "grade_1", label: "Lớp 1" },
  { id: 2, value: "grade_2", label: "Lớp 2" },
  { id: 3, value: "grade_3", label: "Lớp 3" },
  { id: 4, value: "grade_4", label: "Lớp 4" },
  { id: 5, value: "grade_5", label: "Lớp 5" },
  { id: 6, value: "grade_6", label: "Lớp 6" },
  { id: 7, value: "grade_7", label: "Lớp 7" },
  { id: 8, value: "grade_8", label: "Lớp 8" },
  { id: 9, value: "grade_9", label: "Lớp 9" },
  { id: 10, value: "grade_10", label: "Lớp 10" },
  { id: 11, value: "grade_11", label: "Lớp 11" },
  { id: 12, value: "grade_12", label: "Lớp 12" },
];
