"use client"

import { Form, Input, Select, Button, Space, TimePicker, Spin } from "antd"
import { useState, useEffect } from "react"
import dayjs from 'dayjs'
import { subjectService } from '../../../Subject/services/subjectService'
import type { Subject } from '../../../Subject/types'

interface ExamInfo {
  examName: string
  examType: number
  subjectId: string
  description: string
  duration: number
  subject: string
  grade: string
}

interface ExamInfoModalProps {
  visible: boolean
  onCancel: () => void
  onSubmit: (examInfo: ExamInfo) => void
  loading?: boolean
}

// Grade options
const grades = [
  { value: "10", label: "Grade 10" },
  { value: "11", label: "Grade 11" },
  { value: "12", label: "Grade 12" },
]

const examTypes = [
  { value: 1, label: "Multiple Choice" },
  { value: 2, label: "Essay" },
  { value: 3, label: "Mixed" },
]

export function ExamInfoModal({ visible, onCancel, onSubmit, loading = false }: ExamInfoModalProps) {
  const [form] = Form.useForm()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectsLoading, setSubjectsLoading] = useState(true)

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const selectedSubject = subjects.find(s => s.id === values.subjectId);
      const examInfo: ExamInfo = {
        examName: values.examName,
        examType: values.examType,
        subjectId: values.subjectId,
        description: values.description,
        duration: values.duration ? values.duration.hour() * 60 + values.duration.minute() : 120, // Convert to minutes
        subject: selectedSubject?.subject_name || '',
        grade: values.grade
      }
      console.log('ExamInfo from modal:', examInfo);
      console.log('Selected subject:', selectedSubject);
      onSubmit(examInfo)
    } catch (error) {
      console.error('Validation failed:', error)
    }
  }

  const handleCancel = () => {
    form.resetFields()
    onCancel()
  }

  // Fetch subjects when modal opens
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true)
        const { subjects: fetchedSubjects } = await subjectService.getAllSubjects()
        setSubjects(fetchedSubjects)
      } catch (error) {
        console.error('Error fetching subjects:', error)
        // Fallback to empty array if API fails
        setSubjects([])
      } finally {
        setSubjectsLoading(false)
      }
    }

    if (visible) {
      fetchSubjects()
    }
  }, [visible])

  // Convert subjects to select options
  const subjectOptions = subjects.map(subject => ({
    value: subject.id,
    label: subject.subject_name
  }))

  return (
    <div className="exam-info-modal">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          examType: 1,
          duration: dayjs('02:00:00', 'HH:mm:ss'),
          grade: '12'
        }}
        className="mt-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Form.Item
            label="Exam Title"
            name="examName"
            rules={[{ required: true, message: "Please enter exam title" }]}
          >
            <Input 
              placeholder="e.g., Mathematics Final Exam" 
              className="rounded-lg border-slate-300" 
              size="large" 
            />
          </Form.Item>

          <Form.Item
            label="Subject"
            name="subjectId"
            rules={[{ required: true, message: "Please select subject" }]}
          >
            <Select
              placeholder="Select subject"
              className="rounded-lg"
              size="large"
              loading={subjectsLoading}
              options={subjectOptions}
              notFoundContent={subjectsLoading ? <Spin size="small" /> : "No subjects found"}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Form.Item
            label="Exam Type"
            name="examType"
            rules={[{ required: true, message: "Please select exam type" }]}
          >
            <Select
              placeholder="Select exam type"
              className="rounded-lg"
              size="large"
              options={examTypes}
            />
          </Form.Item>

          <Form.Item
            label="Grade Level"
            name="grade"
            rules={[{ required: true, message: "Please select grade" }]}
          >
            <Select
              placeholder="Select grade"
              className="rounded-lg"
              size="large"
              options={grades}
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true, message: "Please select duration" }]}
          >
            <TimePicker
              format="HH:mm:ss"
              placeholder="02:00:00"
              className="w-full rounded-lg"
              size="large"
              showNow={false}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input 
              placeholder="Brief description of the exam" 
              className="rounded-lg border-slate-300" 
              size="large" 
            />
          </Form.Item>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button 
            onClick={handleCancel} 
            size="large" 
            className="rounded-lg px-6"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            size="large"
            className="rounded-lg bg-blue-600 hover:bg-blue-700 px-6"
          >
            Continue to Questions
          </Button>
        </div>
      </Form>
    </div>
  )
}
