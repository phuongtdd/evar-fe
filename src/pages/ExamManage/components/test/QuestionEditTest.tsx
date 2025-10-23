"use client"

import { useState } from "react"
import { Button, Card, Space, Typography } from "antd"
import { QuestionEditModal } from "../ui/question-edit-modal"
import type { Question } from "../../types"

const { Title, Text } = Typography

export function QuestionEditTest() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [testQuestion, setTestQuestion] = useState<Question | null>(null)

  const handleTestEdit = () => {
    // Create a test question with sample data
    const sampleQuestion: Question = {
      id: "test-question-1",
      content: "Đây là câu hỏi test để kiểm tra chức năng chỉnh sửa",
      questionType: "single",
      hardLevel: 2,
      quesScore: 2,
      questionImg: "",
      answers: [
        { id: "a1", content: "Đáp án A", isCorrect: true },
        { id: "a2", content: "Đáp án B", isCorrect: false },
        { id: "a3", content: "Đáp án C", isCorrect: false },
        { id: "a4", content: "Đáp án D", isCorrect: false }
      ],
      subjectId: "test-subject",
      createdBy: "test-user",
      updatedBy: "test-user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setTestQuestion(sampleQuestion)
    setIsModalVisible(true)
  }

  const handleTestAdd = () => {
    setTestQuestion(null)
    setIsModalVisible(true)
  }

  const handleSuccess = () => {
    console.log('Question operation successful')
  }

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <Title level={3}>Test Question Edit Modal</Title>
      <Text type="secondary" className="block mb-4">
        Test component để kiểm tra chức năng chỉnh sửa câu hỏi
      </Text>
      
      <Space>
        <Button type="primary" onClick={handleTestEdit}>
          Test Edit Question
        </Button>
        <Button onClick={handleTestAdd}>
          Test Add Question
        </Button>
      </Space>

      <QuestionEditModal
        visible={isModalVisible}
        question={testQuestion}
        examId="test-exam-id"
        subjectId="test-subject-id"
        onCancel={() => setIsModalVisible(false)}
        onSuccess={handleSuccess}
      />
    </Card>
  )
}
