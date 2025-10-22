"use client";

import {
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Button as AntButton, Tag } from "antd";
import { useQuizContext } from "../../context/QuizContext";
import QuestionCard from "../ui/QuestionCard";
import { useNavigate } from "react-router-dom";

export default function QuizCreated() {
  const { fileUploaded, results } = useQuizContext();
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Kết quả</h2>
        {fileUploaded && (
          <div className="flex gap-3">
            <AntButton danger size="large" className="font-medium">
              Xóa hết
            </AntButton>
            <AntButton
              type="primary"
              size="large"
              className="bg-blue-500 hover:bg-blue-600 font-medium"
              onClick={()=> navigate("/createQuiz-AI/savedSuccess")}
            >
              Lưu ngay
            </AntButton>
          </div>
        )}
      </div>
      {!fileUploaded ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FileTextOutlined className="text-6xl text-gray-300 mb-4" />
          <p className="text-gray-400 text-center">
            Chưa có kết quả. Vui lòng tải lên file để bắt đầu.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {results.map((question) => (
            <>
              <QuestionCard {...question} />
            </>
          ))}
        </div>
      )}
    </div>
  );
}

