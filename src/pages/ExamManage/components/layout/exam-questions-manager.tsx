"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, Button, Space, Table, Tag, Modal, message, Popconfirm, Tooltip, Spin } from "antd"
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons"
import type { Question, Exam } from "../../types"
import { QuestionEditModal } from "../ui/question-edit-modal"
import { questionService } from "../../services/questionService"
import { examService } from "../../services/examService"

interface ExamQuestionsManagerProps {
  exam: Exam
  onQuestionsUpdate: (questions: Question[]) => void
}

export function ExamQuestionsManager({ exam, onQuestionsUpdate }: ExamQuestionsManagerProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingQuestions, setFetchingQuestions] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isEditModalVisible, setIsEditModalVisible] = useState(false)

  // Helper function to transform API response to Question interface
  const transformQuestions = (examDetails: any): Question[] => {
    return (examDetails.questions || []).map((q: any, index: number) => ({
      id: q.id || `q_${index}`,
      content: q.content || '',
      questionType: q.questionType || 'single',
      hardLevel: q.hardLevel || 1,
      quesScore: q.quesScore || 1,
      questionImg: q.questionImg || '',
      answers: (q.answers || []).map((answer: any, answerIndex: number) => ({
        id: answer.id || `a_${index}_${answerIndex}`,
        content: answer.content || '',
        isCorrect: answer.isCorrect || false
      })),
      subjectId: exam.subjectId || '',
      createdBy: q.createdBy || '',
      updatedBy: q.updatedBy || '',
      createdAt: q.createdAt || '',
      updatedAt: q.updatedAt || ''
    }))
  }

  // Fetch exam details with questions when component mounts or exam.id changes
  useEffect(() => {
    const fetchExamDetails = async () => {
      if (!exam.id) return
      
      setFetchingQuestions(true)
      try {
        const examDetails = await examService.getExam(exam.id)
        console.log('Fetched exam details:', examDetails)
        
        // Transform the questions from API response to match our Question interface
        const transformedQuestions = transformQuestions(examDetails)
        
        setQuestions(transformedQuestions)
        onQuestionsUpdate(transformedQuestions)
      } catch (error) {
        console.error('Error fetching exam details:', error)
        message.error('Không thể tải chi tiết bài thi')
      } finally {
        setFetchingQuestions(false)
      }
    }

    fetchExamDetails()
  }, [exam.id]) // Chỉ dependency vào exam.id để tránh infinite loop

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question)
    setIsEditModalVisible(true)
  }

  const handleAddQuestion = () => {
    setEditingQuestion(null)
    setIsEditModalVisible(true)
  }

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      setLoading(true)
      await questionService.deleteQuestion(questionId)
      const updatedQuestions = questions.filter(q => q.id !== questionId)
      setQuestions(updatedQuestions)
      onQuestionsUpdate(updatedQuestions)
      message.success('Xóa câu hỏi thành công')
    } catch (error) {
      console.error('Error deleting question:', error)
      message.error('Không thể xóa câu hỏi')
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionUpdate = async () => {
    // Refresh the questions list after update
    try {
      setFetchingQuestions(true)
      const examDetails = await examService.getExam(exam.id)
      const transformedQuestions = transformQuestions(examDetails)
      
      setQuestions(transformedQuestions)
      onQuestionsUpdate(transformedQuestions)
      message.success('Cập nhật câu hỏi thành công')
    } catch (error) {
      console.error('Error refreshing questions:', error)
      message.error('Không thể cập nhật danh sách câu hỏi')
    } finally {
      setFetchingQuestions(false)
    }
  }

  const handleQuestionAdd = async () => {
    // Refresh the questions list after add
    try {
      setFetchingQuestions(true)
      const examDetails = await examService.getExam(exam.id)
      const transformedQuestions = transformQuestions(examDetails)
      
      setQuestions(transformedQuestions)
      onQuestionsUpdate(transformedQuestions)
      message.success('Thêm câu hỏi thành công')
    } catch (error) {
      console.error('Error refreshing questions:', error)
      message.error('Không thể cập nhật danh sách câu hỏi')
    } finally {
      setFetchingQuestions(false)
    }
  }

  const getQuestionTypeLabel = (type: string) => {
    const types: { [key: string]: { label: string; color: string } } = {
      'single': { label: 'Trắc nghiệm (1 đáp án)', color: 'blue' },
      'multiple': { label: 'Trắc nghiệm (nhiều đáp án)', color: 'green' },
      'essay': { label: 'Tự luận', color: 'orange' }
    }
    return types[type] || { label: type, color: 'default' }
  }

  const getDifficultyLabel = (level: number) => {
    const levels: { [key: number]: { label: string; color: string } } = {
      1: { label: 'Dễ', color: 'green' },
      2: { label: 'Trung bình', color: 'blue' },
      3: { label: 'Khó', color: 'orange' },
      4: { label: 'Rất khó', color: 'red' }
    }
    return levels[level] || { label: `Cấp ${level}`, color: 'default' }
  }

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Nội dung câu hỏi',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text: string) => (
        <div className="max-w-xs">
          <Tooltip title={text}>
            <div className="truncate">{text}</div>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'questionType',
      key: 'questionType',
      width: 150,
      render: (type: string) => {
        const typeInfo = getQuestionTypeLabel(type)
        return <Tag color={typeInfo.color}>{typeInfo.label}</Tag>
      },
    },
    {
      title: 'Độ khó',
      dataIndex: 'hardLevel',
      key: 'hardLevel',
      width: 100,
      render: (level: number) => {
        const levelInfo = getDifficultyLabel(level)
        return <Tag color={levelInfo.color}>{levelInfo.label}</Tag>
      },
    },
    {
      title: 'Điểm',
      dataIndex: 'quesScore',
      key: 'quesScore',
      width: 80,
      render: (score: number) => score || 1,
    },
    {
      title: 'Đáp án đúng',
      key: 'correctAnswers',
      width: 120,
      render: (record: Question) => {
        const correctCount = record.answers?.filter(a => a.isCorrect).length || 0
        const totalCount = record.answers?.length || 0
        return `${correctCount}/${totalCount}`
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 120,
      render: (record: Question) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditQuestion(record)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Xóa câu hỏi"
            description="Bạn có chắc chắn muốn xóa câu hỏi này?"
            onConfirm={() => handleDeleteQuestion(record.id!)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Quản lý câu hỏi ({questions.length})
          </h3>
          <p className="text-sm text-slate-600">
            Chỉnh sửa, thêm mới hoặc xóa câu hỏi trong bài thi
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddQuestion}
          className="rounded-lg bg-blue-600 hover:bg-blue-700"
        >
          Thêm câu hỏi
        </Button>
      </div>

      <Card className="border-slate-200">
        {fetchingQuestions ? (
          <div className="flex justify-center items-center py-8">
            <Spin size="large" />
            <span className="ml-3 text-slate-600">Đang tải câu hỏi...</span>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={questions}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} của ${total} câu hỏi`,
            }}
            size="small"
            className="question-table"
          />
        )}
      </Card>

      <QuestionEditModal
        visible={isEditModalVisible}
        question={editingQuestion}
        examId={exam.id}
        subjectId={exam.subjectId || ''}
        onCancel={() => setIsEditModalVisible(false)}
        onSuccess={() => {
          if (editingQuestion) {
            handleQuestionUpdate()
          } else {
            handleQuestionAdd()
          }
        }}
      />
    </div>
  )
}
