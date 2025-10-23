import React from "react";
import { Button, Card, Image, List, Tag } from "antd";
import { QuestionCardProps } from "../../types";
import {
  DeleteOutlined,
  EditOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import ImageUploadOnly from "./ImageuploadOnly";
import mockImage from "../../../../assets/images/mockImage.png";

const QuestionCard = ({ question, onDelete }: QuestionCardProps) => {
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
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors">
              <EditOutlined />
            </button>
            <button 
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              onClick={onDelete}
            >
              <DeleteOutlined />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <p className="text-gray-700 mb-4 leading-relaxed">
              {question.content}
            </p>
            <div className="space-y-2">
              {question.answers.map((answer, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <span className="font-semibold text-gray-900 min-w-[24px]">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className={`text-gray-700 ${answer.isCorrect ? 'font-bold text-green-600' : ''}`}>
                    {answer.content}
                  </span>
                  {answer.isCorrect && (
                    <span className="text-green-600 font-semibold text-xs">✓ Đúng</span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Hình ảnh</h4>
            {question.hasImage ? (
              <div className="w-full border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-center relative">
                <div className="text-center object-cover">
                  <Image src={question.imageSrc || question.imageUrl || mockImage} alt="" />
                  <div className="absolute bottom-2 right-2">
                    <Button icon={<DeleteOutlined className="!text-red-600" />} className=""></Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 h-64 flex flex-col items-center justify-center gap-3">
                <div className="w-[64px] h-[64px] flex items-center justify-center">
                  <FileImageOutlined className="!w-full !h-full text-[64px] leading-[64px] !text-gray-200  " />
                </div>

                <p className="text-gray-400 text-sm">Không có</p>
                <ImageUploadOnly />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionCard;