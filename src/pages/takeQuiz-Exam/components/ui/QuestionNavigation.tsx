import React from "react";
import { Button } from "antd";
import { QuestionNavigationProps } from "../../types";
import { EXAM_STYLES } from "../../constants";

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  currentQuestionIndex,
  onQuestionSelect,
  onSubmitExam,
}) => {
  const answeredCount = questions.filter(
    (q) => q.isAnswered
  ).length;
  const markedCount = questions.filter((q) => q.isMarked).length;

  return (
    <div className="w-[454px] space-y-6">
      <div className="bg-white rounded-[12px] border border-[#d5d5d5] p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-[20px] text-black">
            <span className="underline">Số câu hỏi:</span>
            <span className="font-bold">
              {" "}
              {answeredCount}/{questions.length}
            </span>
          </span>
          {markedCount > 0 && (
            <span className="text-[16px] !text-[#FFC107] font-semibold">
              Đã đánh dấu: {markedCount}
            </span>
          )}
        </div>

        <div className="h-[10px] bg-[rgba(99,146,233,0.37)] rounded-[4px]" />

        <div className="grid grid-cols-6 gap-4 my-6">
          {questions.map((question, idx) => (

            <>
              <button
                key={question.id}
                onClick={() => onQuestionSelect(idx)}
                className={`aspect-square !rounded-2xl font-bold text-[16px] transition-all duration-200 ${
                  question.isAnswered
                    ? "bg-[#6392e9] text-white"
                    : question.isMarked
                    ? "bg-[#ffc107] text-white"
                    : "border-2 !border-[#6392e9] !text-[#6392e9] !hover:bg-[#6392e9] !hover:text-white"
                } ${
                  currentQuestionIndex === idx
                    ? "ring-1 ring-offset-0 !ring-[#9bb0d8] transform scale-105"
                    : ""
                }`}
              >
                {idx + 1}
              </button>
            </>
          ))}
        </div>

        <div className="flex items-center justify-between text-[14px] text-gray-600 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 !bg-[#6392e9] rounded"></div>
            <span>Đã trả lời</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 !bg-[#ffc107] rounded"></div>
            <span>Đã đánh dấu</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 !border-[#6392e9] rounded"></div>
            <span>Chưa trả lời</span>
          </div>
        </div>

        <Button
          onClick={onSubmitExam}
          className="w-full !bg-[#6392e9] !hover:bg-[#5282d8] !text-white rounded-[8px] h-[43px] text-[20px] font-semibold"
        >
          Nộp bài
        </Button>
      </div>
    </div>
  );
};

export default QuestionNavigation;
