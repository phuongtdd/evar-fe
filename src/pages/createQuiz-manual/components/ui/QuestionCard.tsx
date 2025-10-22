"use client"
import { Card, Badge, Button, Space, Popconfirm, Image } from "antd"
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { QuestionCardProps } from "../../types"



export default function QuestionCard({ question, onDelete }: QuestionCardProps) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white mb-5">
      <div className="space-y-4">
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-gray-700 font-medium text-sm">Câu hỏi số:</span>
            <Badge
              count={question.number}
              style={{
                backgroundColor: "#3b82f6",
                fontSize: "12px",
                fontWeight: "600",
                width: "24px",
                height: "24px",
                lineHeight: "24px",
              }}
            />
            <span className="text-gray-500 text-xs">
              Độ khó: {question.hardLevel === 1 ? 'Dễ' : question.hardLevel === 2 ? 'Trung bình' : 'Khó'}
            </span>
          </div>
          <Space size="small">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              className="bg-blue-500 hover:bg-blue-600 h-8 w-8 p-0 flex items-center justify-center"
            />
            <Popconfirm
              title="Xóa câu hỏi"
              description="Bạn có chắc chắn muốn xóa câu hỏi này?"
              onConfirm={onDelete}
              okText="Có"
              cancelText="Không"
            >
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                className="h-8 w-8 p-0 flex items-center justify-center"
              />
            </Popconfirm>
          </Space>
        </div>

        <div className="text-gray-800 leading-relaxed text-sm">
          <p>{question.content}</p>
        </div>

        <div className="grid grid-cols-3 gap-6 pt-2">
          <div className="col-span-2 space-y-3">
            {question.answers.map((answer, index) => (
              <div key={index} className="flex gap-4 text-sm">
                <span className="font-semibold text-gray-800 min-w-8">{String.fromCharCode(65 + index)}</span>
                <span className={`text-gray-700 ${answer.isCorrect ? 'font-bold text-green-600' : ''}`}>
                  {answer.content}
                </span>
                {answer.isCorrect && (
                  <span className="text-green-600 font-semibold text-xs">✓ Đúng</span>
                )}
              </div>
            ))}
          </div>

          {question.hasImage && (
            <div className="flex flex-col items-center justify-start bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-center space-y-3 w-full">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Hình ảnh</p>
                <Image
                  src={question.imageSrc || "/placeholder.svg"}
                  alt="Question diagram"
                  width={140}
                  height={140}
                  preview={true}
                  className="rounded"
                />
              </div>
            </div>
          )}
        </div>

 
      </div>
    </Card>
  )
}
