"use client"

import { useState, useEffect } from "react"
import { Modal, Form, Input, Select, Button, Space, Card, Switch, message, Divider, InputNumber } from "antd"
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons"
import type { Question, Answer } from "../../types"
import { questionService, type QuestionUpdateRequest, type QuestionAddRequest, type AnswerAddRequest, type QuestionResponse } from "../../services/questionService"

interface QuestionEditModalProps {
  visible: boolean
  question: Question | null
  examId: string
  subjectId: string
  onCancel: () => void
  onSuccess: () => void
}

export function QuestionEditModal({ 
  visible, 
  question, 
  examId, 
  subjectId, 
  onCancel, 
  onSuccess 
}: QuestionEditModalProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState<Answer[]>([])

  // Convert questionType from number to string format
  const convertQuestionTypeFromBackend = (questionType: string): string => {
    switch (questionType) {
      case '1': return 'multiple'
      case '2': return 'single'
      case '3': return 'true_false'
      case '4': return 'match'
      case '5': return 'essay'
      default: return questionType // fallback to original value
    }
  }

  // Convert questionType from string to number format for backend
  const convertQuestionTypeToBackend = (questionType: string): string => {
    switch (questionType) {
      case 'multiple': return '1'
      case 'single': return '2'
      case 'true_false': return '3'
      case 'match': return '4'
      case 'essay': return '5'
      default: return questionType // fallback to original value
    }
  }

  // Initialize form when question changes
  useEffect(() => {
    if (question && visible) {
      form.setFieldsValue({
        content: question.content,
        questionType: convertQuestionTypeFromBackend(question.questionType),
        hardLevel: question.hardLevel,
        quesScore: question.quesScore || 1,
        questionImg: question.questionImg || ''
      })
      setAnswers(question.answers || [])
    } else if (visible) {
      // Reset form for new question
      form.resetFields()
      setAnswers([
        { isCorrect: false, content: '' },
        { isCorrect: false, content: '' }
      ])
    }
  }, [question, visible, form])

  const handleAddAnswer = () => {
    setAnswers([...answers, { isCorrect: false, content: '' }])
  }

  const handleRemoveAnswer = (index: number) => {
    if (answers.length > 1) {
      setAnswers(answers.filter((_, i) => i !== index))
    } else {
      message.warning('Câu hỏi phải có ít nhất 1 đáp án')
    }
  }

  const handleAnswerChange = (index: number, field: keyof Answer, value: any) => {
    const newAnswers = [...answers]
    newAnswers[index] = { ...newAnswers[index], [field]: value }
    setAnswers(newAnswers)
  }

  const handleCorrectAnswerChange = (index: number, checked: boolean) => {
    // If setting this answer as correct, uncheck all others for single choice questions
    if (checked && (form.getFieldValue('questionType') === 'single' || form.getFieldValue('questionType') === 'true_false')) {
      const newAnswers = answers.map((answer, i) => ({
        ...answer,
        isCorrect: i === index
      }))
      setAnswers(newAnswers)
    } else {
      handleAnswerChange(index, 'isCorrect', checked)
    }
  }

  const handleSubmit = async (values: any) => {
    if (answers.length === 0) {
      message.error('Vui lòng thêm ít nhất 1 đáp án')
      return
    }

    if (answers.every(answer => !answer.isCorrect)) {
      message.error('Vui lòng chọn ít nhất 1 đáp án đúng')
      return
    }

    if (answers.some(answer => !answer.content.trim())) {
      message.error('Vui lòng điền đầy đủ nội dung cho tất cả đáp án')
      return
    }

    setLoading(true)
    try {
      const answersData: AnswerAddRequest[] = answers.map(answer => ({
        isCorrect: answer.isCorrect,
        content: answer.content
      }))

      if (question && question.id) {
        // Update existing question
        const questionData: QuestionUpdateRequest = {
          id: question.id,
          content: values.content,
          questionType: convertQuestionTypeToBackend(values.questionType),
          hardLevel: values.hardLevel,
          quesScore: values.quesScore || 1,
          subjectId: subjectId && subjectId.trim() !== '' ? subjectId : undefined,
          questionImg: values.questionImg || undefined,
          answers: answersData
        }

        await questionService.updateQuestion(questionData)
        message.success('Cập nhật câu hỏi thành công')
      } else {
        // Create new question
        const questionData: QuestionAddRequest = {
          content: values.content,
          questionType: convertQuestionTypeToBackend(values.questionType),
          hardLevel: values.hardLevel,
          quesScore: values.quesScore || 1,
          subjectId: subjectId,
          questionImg: values.questionImg || undefined,
          answers: answersData
        }

        await questionService.createQuestion(questionData)
        message.success('Thêm câu hỏi thành công')
      }
      
      onSuccess()
      onCancel()
    } catch (error) {
      console.error('Error saving question:', error)
      message.error(question ? 'Không thể cập nhật câu hỏi' : 'Không thể thêm câu hỏi')
    } finally {
      setLoading(false)
    }
  }

  const questionTypes = [
    { label: 'Trắc nghiệm (1 đáp án)', value: 'single' },
    { label: 'Trắc nghiệm (nhiều đáp án)', value: 'multiple' },
    { label: 'Đúng/Sai', value: 'true_false' },
    { label: 'Ghép câu', value: 'match' },
    { label: 'Tự luận', value: 'essay' }
  ]

  const difficultyLevels = [
    { label: 'Dễ', value: 1 },
    { label: 'Trung bình', value: 2 },
    { label: 'Khó', value: 3 },
    { label: 'Rất khó', value: 4 }
  ]

  return (
    <Modal
      title={question ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      className="question-edit-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mt-4"
      >
        <Form.Item
          label="Nội dung câu hỏi"
          name="content"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập nội dung câu hỏi..."
            className="rounded-lg"
          />
        </Form.Item>

        <Form.Item
          label="Hình ảnh câu hỏi (tùy chọn)"
          name="questionImg"
        >
          <Input
            placeholder="URL hình ảnh..."
            className="rounded-lg"
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Loại câu hỏi"
            name="questionType"
            rules={[{ required: true, message: 'Vui lòng chọn loại câu hỏi' }]}
          >
            <Select
              placeholder="Chọn loại câu hỏi"
              className="rounded-lg"
              options={questionTypes}
            />
          </Form.Item>

          <Form.Item
            label="Độ khó"
            name="hardLevel"
            rules={[{ required: true, message: 'Vui lòng chọn độ khó' }]}
          >
            <Select
              placeholder="Chọn độ khó"
              className="rounded-lg"
              options={difficultyLevels}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Điểm số"
          name="quesScore"
          rules={[{ required: true, message: 'Vui lòng nhập điểm số' }]}
        >
          <InputNumber
            min={0.5}
            max={10}
            step={0.5}
            placeholder="1"
            className="w-full rounded-lg"
          />
        </Form.Item>

        <Divider orientation="left">Đáp án</Divider>

        <div className="space-y-4">
          {answers.map((answer, index) => (
            <Card
              key={index}
              size="small"
              className="border-slate-200"
              title={`Đáp án ${index + 1}`}
              extra={
                answers.length > 1 && (
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveAnswer(index)}
                    size="small"
                  />
                )
              }
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={answer.isCorrect}
                    onChange={(checked) => handleCorrectAnswerChange(index, checked)}
                    checkedChildren="Đúng"
                    unCheckedChildren="Sai"
                  />
                  <span className="text-sm text-slate-600">
                    {answer.isCorrect ? 'Đáp án đúng' : 'Đáp án sai'}
                  </span>
                </div>
                
                <Input.TextArea
                  value={answer.content}
                  onChange={(e) => handleAnswerChange(index, 'content', e.target.value)}
                  placeholder={`Nhập nội dung đáp án ${index + 1}...`}
                  rows={2}
                  className="rounded-lg"
                />
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-4">
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddAnswer}
            className="w-full rounded-lg"
          >
            Thêm đáp án
          </Button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button onClick={onCancel} size="large" className="rounded-lg">
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            {question ? 'Cập nhật' : 'Thêm câu hỏi'}
          </Button>
        </div>
      </Form>
    </Modal>
  )
}
