"use client"
import { Card, Button, Divider } from "antd"
import { EditOutlined } from "@ant-design/icons"

interface QuizDetailsPanelProps {
  quizInfo?: {
    title: string;
    subject: string;
    subjectId?: string;
    description: string;
    grade: string;
    time?: string;
  };
  questionCount?: number;
  onEdit?: () => void;
}

export default function QuizDetailsPanel({ quizInfo, questionCount = 0, onEdit }: QuizDetailsPanelProps) {
  console.log("subject : "+quizInfo?.subject)
  return (
    <Card className="shadow-sm border-0 bg-white">
      <div className="space-y-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Tên đề thi:</p>
            <p className="text-sm font-medium text-gray-900">{quizInfo?.title || "Chưa có thông tin"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Môn học:</p>
            <p className="text-sm font-medium text-gray-900">{quizInfo?.subject || "Chưa có thông tin"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Số câu hỏi:</p>
            <p className="text-sm font-medium text-gray-900">{questionCount} câu</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Người tạo:</p>
            <p className="text-sm font-medium text-gray-900">{quizInfo?.description || "Admin"}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Lớp:</p>
            <p className="text-sm font-medium text-gray-900">{quizInfo?.grade || "Chưa có thông tin"}</p>
          </div>
        </div>

        <Divider className="my-4" />

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 font-medium">Thời gian làm bài:</span>
            <span className="text-sm font-semibold text-gray-900">{quizInfo?.time || "120:00:00"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600 font-medium">Lần:</span>
            <span className="text-sm font-semibold text-gray-900">1</span>
          </div>
        </div>

        <Button
          type="primary"
          block
          icon={<EditOutlined />}
          className="bg-blue-500 hover:bg-blue-600 mt-6 h-9 font-medium"
          onClick={onEdit}
        >
          Sửa
        </Button>
      </div>
    </Card>
  )
}
