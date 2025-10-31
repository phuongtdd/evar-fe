import React, { useState } from "react";
import { Badge, Button, Modal, Spin, Tooltip } from "antd";
import { StarOutlined, StarFilled, EyeOutlined } from "@ant-design/icons";
import { QuestionCardProps } from "../../types";
import { EXAM_STYLES, EXAM_CONFIG } from "../../constants";
import MathContent from "../../../createExam-AI/components/ui/MathContent";
import "../../styles/mathjax-fixes.css";
import "../../styles/table-fixes.css";
import AnswerOption from "./AnswerOption";

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionNumber,
  onAnswerSelect,
  onMarkQuestion,
  isMarked,
}) => {
  const isMultiple = question.questionType === '1';
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    onAnswerSelect(answerIndex, isMultiple);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleImageClick = () => {
    if (!imageError && question.questionImg) {
      setPreviewVisible(true);
    }
  };

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
      <div>
      </div>
      <div className="w-full flex flex-col items-center justify-center relative">
       {question.questionImg && (
        <>
        <strong className="absolute top-0 left-0">Hình ảnh: </strong>
          <div className="mt-4 w-[320px] relative">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-[8px] border border-[#d5d5d5] min-h-[200px]">
                <div className="text-center">
                  <Spin size="large" />
                  <p className="mt-2 text-gray-500 text-sm">Đang tải hình ảnh...</p>
                </div>
              </div>
            )}
            {imageError && (
              <div className="flex items-center justify-center bg-gray-100 rounded-[8px] border border-[#d5d5d5] min-h-[200px] p-4">
                <div className="text-center text-gray-500">
                  <p className="text-sm">Không thể tải hình ảnh</p>
                  <p className="text-xs mt-1">Vui lòng kiểm tra kết nối mạng</p>
                </div>
              </div>
            )}
            <Tooltip title="Nhấn để xem hình ảnh lớn hơn" placement="top">
              <img
                src={question.questionImg}
                alt="Question image"
                className={`max-w-full h-auto rounded-[8px] border !border-[#d5d5d5] transition-opacity duration-300 ${
                  imageLoading || imageError ? 'opacity-0 absolute' : 'opacity-100 image-loaded'
                } ${!imageError ? 'cursor-pointer hover:opacity-80' : ''}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                onClick={handleImageClick}
                style={{ display: imageLoading || imageError ? 'none' : 'block' }}
              />
            </Tooltip>
            {!imageError && !imageLoading && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                <EyeOutlined className="text-sm" />
              </div>
            )}
          </div>
        </>
        )}  
      </div>
      <div className="mb-6 flex flex-row">
        <div className="flex flex-col gap-2 flex-1">
          <div className="text-[20px] !text-black leading-relaxed">
            <strong>Nội dung : </strong>
          </div>
          <div className="table-responsive">
            <MathContent
              content={question.content}
              className="text-[18px] !text-black leading-relaxed"
            />
          </div>
        </div>
      </div>

     

      <div className="border-t !border-[#E6E6E6] my-6" />
      <p className="text-[16px] !text-[#6392e9] font-bold mb-4">
            Vui lòng chọn đáp án:
          </p>
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

      {/* Image Preview Modal */}
      <Modal
        title="Xem hình ảnh câu hỏi"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width="auto"
        centered
        className="image-preview-modal"
        styles={{
          body: { padding: 0, textAlign: 'center' }
        }}
      >
        {question.questionImg && (
          <img
            src={question.questionImg}
            alt="Question image preview"
            className="max-w-full max-h-[80vh] object-contain"
            style={{ maxWidth: '90vw' }}
          />
        )}
      </Modal>
    </div>
  );
};

export default QuestionCard;
