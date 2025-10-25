"use client"

import { Divider, Tag, Descriptions } from "antd"
import type { Exam } from "../../types"

interface ExamDetailProps {
  exam: Exam
}

export function ExamDetail({ exam }: ExamDetailProps) {
  return (
    <div className="space-y-6 py-4">
      <div>
        <h3 className="mb-2 text-lg font-semibold text-slate-900">{exam.examName}</h3>
        <p className="text-slate-600">{exam.description}</p>
      </div>

      <Divider />

      <Descriptions column={2} size="small">
        <Descriptions.Item label="Subject" span={1}>
          <Tag color="cyan">{exam.subjectName}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Status" span={1}>
          <Tag color={exam.status === "active" ? "green" : "orange"}>
            {(exam.status || "active").charAt(0).toUpperCase() + (exam.status || "active").slice(1)}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Duration" span={1}>
          <span className="font-medium">
            {exam.duration !== null && exam.duration !== undefined 
              ? (() => {
                  const hours = Math.floor(exam.duration / 60);
                  const minutes = exam.duration % 60;
                  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                })()
              : 'No limit'
            }
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="Number of Questions" span={1}>
          <span className="font-medium">{exam.numOfQuestions}</span>
        </Descriptions.Item>

        <Descriptions.Item label="Created Date" span={1}>
          <span className="text-slate-600">{new Date(exam.createdAt).toLocaleDateString()}</span>
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-slate-600">Duration</p>
          <p className="mt-1 text-2xl font-bold text-blue-600">
            {exam.duration !== null && exam.duration !== undefined 
              ? (() => {
                  const hours = Math.floor(exam.duration / 60);
                  const minutes = exam.duration % 60;
                  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
                })()
              : 'No limit'
            }
          </p>
          <p className="text-xs text-slate-500">
            {exam.duration !== null && exam.duration !== undefined ? 'time limit' : 'unlimited'}
          </p>
        </div>
        <div className="rounded-lg bg-purple-50 p-4">
          <p className="text-sm text-slate-600">Questions</p>
          <p className="mt-1 text-2xl font-bold text-purple-600">{exam.numOfQuestions}</p>
          <p className="text-xs text-slate-500">total</p>
        </div>
      </div>
    </div>
  )
}
