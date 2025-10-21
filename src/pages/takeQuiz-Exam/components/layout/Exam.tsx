import { Badge, Button } from "antd";
import { useState } from "react";
import { Star } from "react-bootstrap-icons";

interface Question {
  id: number;
  content: string;
  answers: string[];
  selectedAnswer?: number;
  isMarked?: boolean;
}

interface QuizExamStepProps {
  onSubmit: () => void;
}

export function QuizExamStep() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      content:
        "Cho hàm số \\( y = f(x) \\) liên tục, nhận giá trị dương trên đoạn \\( [a; b] \\). Xét hình phẳng \\( (H) \\) giới hạn bởi đồ thị hàm số \\( y = f(x) \\), trục hoành và hai đường thẳng \\( x = a, x = b \\). Khối tròn xoay được tạo thành khi quay hình phẳng \\( (H) \\) quanh trục \\( Ox \\) có thể tích là:",
      answers: [
        "\\( V = \\pi \\int_{a}^{b} f(x) dx \\)",
        "\\( V = \\pi \\int_{a}^{b} f(x) dxy \\)",
        "\\( V = \\pi \\int_{a}^{b} f(x) dxiy \\)",
        "\\( V = \\pi \\int_{a}^{b} f(x) dxiy \\)",
      ],
      selectedAnswer: 3,
    },
    ...Array.from({ length: 24 }, (_, i) => ({
      id: i + 2,
      content: `Câu hỏi số ${i + 2}`,
      answers: ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      isMarked: i >= 10 && i < 15,
    })),
  ]);

  const [timeLeft] = useState("30:00:00");

  const handleAnswerSelect = (answerIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[currentQuestion].selectedAnswer = answerIndex;
    setQuestions(newQuestions);
  };

  const answeredCount = questions.filter(
    (q) => q.selectedAnswer !== undefined
  ).length;

  return (
    <div className="flex-1 bg-[#f4f4f4] p-8 overflow-auto">
      <div>this is progressbar</div>
      <div className="h-[22px] bg-[#d8e5ff] rounded-[8px] mb-8 overflow-hidden">
        <div
          className="h-full bg-[#6392e9] rounded-[8px] transition-all duration-300"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      <div className="mt-8 text-center">
        <span className="text-[24px] text-black">Bài : </span>
        <span className="text-[36px] text-black font-bold">
          Ôn tập toán 12 - đề thi thpt quốc gia 2018
        </span>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <div className="bg-white rounded-[12px] border border-[#d5d5d5] p-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-[24px] text-black">Câu hỏi số :</span>
              <Badge className="bg-[#6392e9] text-white text-[24px] px-4 py-2 rounded-[8px]">
                {currentQuestion + 1}
              </Badge>
              {questions[currentQuestion].isMarked && (
                <Star size={16} className="text-[#FFC107] fill-[#FFC107]" />
              )}
            </div>

            <p className="text-[16px] text-[#6392e9] font-bold mb-4">
              Vui lòng chọn đáp án :
            </p>

            <div className="text-[24px] text-black mb-8 leading-relaxed">
              {questions[currentQuestion].content}
            </div>

            <div className="border-t border-[#E6E6E6] my-6" />

            <div className="space-y-4">
              {questions[currentQuestion].answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-[8px] border-2 transition-colors ${
                    questions[currentQuestion].selectedAnswer === index
                      ? "bg-[#6392e9] border-[#6392e9] text-white"
                      : "border-[#c4c4c4] hover:border-[#6392e9]"
                  }`}
                >
                  <span
                    className={`font-bold mr-4 ${
                      questions[currentQuestion].selectedAnswer === index
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span
                    className={`text-[20px] ${
                      questions[currentQuestion].selectedAnswer === index
                        ? "text-white"
                        : "text-black"
                    }`}
                  >
                    {answer}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button
                onClick={() =>
                  setCurrentQuestion(Math.max(0, currentQuestion - 1))
                }
                disabled={currentQuestion === 0}
                className="bg-[#6392e9] hover:bg-[#5282d8] text-white rounded-[8px] px-8"
              >
                Trước
              </Button>
              <Button
                onClick={() =>
                  setCurrentQuestion(
                    Math.min(questions.length - 1, currentQuestion + 1)
                  )
                }
                disabled={currentQuestion === questions.length - 1}
                className="bg-[#6392e9] hover:bg-[#5282d8] text-white rounded-[8px] px-8"
              >
                Sau
              </Button>
            </div>
          </div>
        </div>

        <div className="w-[454px] space-y-6">
          <div className="bg-white rounded-[12px] border border-[#d5d5d5] p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[24px] text-black">Thời gian:</span>
              <span className="text-[24px] text-[#6392e9] font-bold">
                {timeLeft}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[24px] text-black">Môn học :</span>
              <Badge className="bg-[#6392e9] text-white text-[16px] px-4 py-1 rounded-[8px]">
                Toán học
              </Badge>
            </div>
          </div>

          <div className="bg-white rounded-[12px] border border-[#d5d5d5] p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[20px] text-black">
                <span className="underline">Số câu hỏi:</span>
                <span className="font-bold"> {answeredCount}/25</span>
              </span>
            </div>

            <div className="h-[10px] bg-[rgba(99,146,233,0.37)] rounded-[4px] mb-6" />

            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`aspect-square rounded-[8px] font-bold text-[24px] transition-colors ${
                    q.selectedAnswer !== undefined
                      ? "bg-[#6392e9] text-white"
                      : q.isMarked
                      ? "bg-[#ffc107] text-white"
                      : "border-2 border-[#6392e9] text-[#6392e9] hover:bg-[#6392e9] hover:text-white"
                  } ${
                    currentQuestion === idx
                      ? "ring-2 ring-offset-2 ring-[#6392e9]"
                      : ""
                  }`}
                >
                  {q.id}
                </button>
              ))}
            </div>

            <Button
              // onClick={onSubmit}
              className="w-full mt-6 bg-[#6392e9] hover:bg-[#5282d8] text-white rounded-[8px] h-[43px] text-[20px]"
            >
              Nộp bài
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
