import React from "react";
import { Button, Card, Image, List, Tag, Tooltip } from "antd";
import { QuestionCardProps } from "../../types";
import {
  DeleteOutlined,
  EditOutlined,
  FileImageOutlined,
  CheckCircleOutlined,
  CheckCircleFilled,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import ImageUploadOnly from "./ImageuploadOnly";
import mockImage from "../../../../assets/images/mockImage.png";
import MathContent from "./MathContent";

interface ExtendedQuestionCardProps extends QuestionCardProps {
  onEdit?: () => void;
  onToggleCorrect?: (questionId: number, answerIndex: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onImageUpload?: (questionId: number, imageUrl: string) => void;
  onImageDelete?: (questionId: number) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const QuestionCard = ({ 
  question, 
  onDelete, 
  onEdit, 
  onToggleCorrect,
  onMoveUp,
  onMoveDown,
  onImageUpload,
  onImageDelete,
  isFirst,
  isLast 
}: ExtendedQuestionCardProps) => {
  return (
    <>
      <div
        key={question.id}
        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Tag color="blue" className="text-base px-3 py-1">
              {question.number || question.id}
            </Tag>
            <span className="text-sm font-medium text-gray-700">
              Câu hỏi số :
            </span>
            <span className="text-gray-500 text-xs">
              Độ khó: {question.hardLevel === 1 ? 'Dễ' : question.hardLevel === 2 ? 'Trung bình' : 'Khó'}
            </span>
          </div>
          <div className="flex gap-2">
            <Tooltip title="Di chuyển lên">
              <button 
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                  isFirst 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
                onClick={onMoveUp}
                disabled={isFirst}
              >
                <ArrowUpOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Di chuyển xuống">
              <button 
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                  isLast 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
                onClick={onMoveDown}
                disabled={isLast}
              >
                <ArrowDownOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Chỉnh sửa câu hỏi">
              <button 
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                onClick={onEdit}
              >
                <EditOutlined />
              </button>
            </Tooltip>
            <Tooltip title="Xóa câu hỏi">
              <button 
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                onClick={onDelete}
              >
                <DeleteOutlined />
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MathContent 
              content={question.content} 
              className="text-gray-700 mb-4 leading-relaxed"
            />
            <div className="space-y-2">
              {question.answers.map((answer, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    answer.isCorrect 
                      ? 'bg-green-50 border-2 border-green-400' 
                      : 'bg-gray-50 border border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => onToggleCorrect && onToggleCorrect(question.id!, idx)}
                >
                  <span className="font-semibold text-gray-900 min-w-[24px]">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <MathContent 
                    content={answer.content}
                    className={`flex-1 text-gray-700 ${answer.isCorrect ? 'font-bold text-green-700' : ''}`}
                  />
                  <Tooltip title={answer.isCorrect ? "Đáp án đúng" : "Click để đánh dấu đúng"}>
                    {answer.isCorrect ? (
                      <CheckCircleFilled className="text-green-600 text-lg" />
                    ) : (
                      <CheckCircleOutlined className="text-gray-400 text-lg hover:text-green-500" />
                    )}
                  </Tooltip>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Hình ảnh</h4>
            {question.hasImage || question.questionImg || question.imageSrc ? (
              <div className="w-full border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-center relative">
                <div className="text-center object-cover">
                  <Image src={question.questionImg || question.imageSrc || mockImage} alt="Question image" />
                  <div className="absolute bottom-2 right-2">
                    <Button 
                      icon={<DeleteOutlined className="!text-red-600" />} 
                      onClick={() => onImageDelete && onImageDelete(question.id!)}
                      danger
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 h-64 flex flex-col items-center justify-center gap-3">
                <div className="w-[64px] h-[64px] flex items-center justify-center">
                  <FileImageOutlined className="!w-full !h-full text-[64px] leading-[64px] !text-gray-200  " />
                </div>

                <p className="text-gray-400 text-sm">Không có</p>
                <ImageUploadOnly 
                  onImageUploaded={(imageUrl) => onImageUpload && onImageUpload(question.id!, imageUrl)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionCard;