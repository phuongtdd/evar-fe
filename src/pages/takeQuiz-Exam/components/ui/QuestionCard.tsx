import React from "react";
import { Badge, Button } from "antd";
import { StarOutlined, StarFilled } from "@ant-design/icons";
import { QuestionCardProps } from "../../types";
import { EXAM_STYLES, EXAM_CONFIG } from "../../constants";
import AnswerOption from "./AnswerOption";

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  onAnswerSelect,
  onMarkQuestion,
  isMarked,
}) => {
  const isMultiple = question.questionType === '1';

  const handleAnswerSelect = (answerIndex: number) => {
    onAnswerSelect(answerIndex, isMultiple);
  };

  // console.log(`QuestionCard ${questionNumber} - isMarked: ${isMarked}`, {
  //   questionId: question.id,
  //   questionNumber,
  //   isMarked,
  //   timestamp: new Date().toLocaleTimeString()
  // });

  return (
    <div className="bg-white rounded-[12px] border border-[#d5d5d5] p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-[24px] text-black">Câu hỏi số:</span>
          <Badge className="bg-[#6392e9] text-white text-[24px] px-4 py-2 rounded-[8px]">
            {questionNumber}
          </Badge>
          <Badge className="bg-[#faad14] text-white text-[16px] px-3 py-1 rounded-[8px]">
            {EXAM_CONFIG.DIFFICULTY_LEVELS[question.hardLevel]}
          </Badge>
        </div>
        <Button
          type="text"
          icon={
            isMarked ? (
              <StarFilled className="!text-white" />
            ) : (
              <StarOutlined className="!text-[#FFC107]" />
            )
          }
          onClick={onMarkQuestion}
          className={`transition-all duration-200 ${
            isMarked
              ? "!text-white !bg-yellow-400 !hover:bg-yellow-500 !border-yellow-400"
              : "!text-[#FFC107] !bg-amber-100 !hover:bg-amber-200 !border-amber-200"
          } rounded-lg px-4 py-2 border`}
        >
          {isMarked ? "Đã đánh dấu" : "Đánh dấu"}
        </Button>
      </div>

      <div className="mb-6 flex flex-row">
        <div className="flex flex-col gap-2">
          <div className="text-[20px] !text-black leading-relaxed">
            {question.content}
          </div>

          <p className="text-[16px] !text-[#6392e9] font-bold mb-4">
            Vui lòng chọn đáp án:
          </p>
        </div>
        {question.questionImg && (
          <div className="mt-4">
            <img
              src={question.questionImg}
              alt="Question image"
              className="max-w-full h-auto rounded-[8px] border !border-[#d5d5d5]"
            />
          </div>
        )}
      </div>

      <div className="border-t !border-[#E6E6E6] my-6" />

      <div className="space-y-4">
        {question.answers.map((answer, index) => (
          <div className="py-[6px]">
            <AnswerOption
              key={index}
              answer={answer}
              index={index}
              isSelected={isMultiple
                ? (question.selectedAnswers?.includes(index) ?? false)
                : (question.selectedAnswer === index)
              }
              isMultiple={isMultiple}
              onSelect={() => handleAnswerSelect(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
