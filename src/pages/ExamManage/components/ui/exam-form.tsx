"use client"

import { Form, Input, InputNumber, Select, Button, Space, Spin } from "antd"
import { useState, useEffect } from "react"
import type { Exam } from "../../types"
import { subjectService } from "../../../Subject/services/subjectService"
import type { Subject } from "../../../Subject/types"

interface ExamFormProps {
  exam?: Exam | null
  onSubmit: (data: Omit<Exam, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export function ExamForm({ exam, onSubmit, onCancel }: ExamFormProps) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [subjectsLoading, setSubjectsLoading] = useState(false)

  // Fetch subjects when component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true)
        const { subjects: fetchedSubjects } = await subjectService.getAllSubjects()
        setSubjects(fetchedSubjects)
      } catch (error) {
        console.error('Error fetching subjects:', error)
      } finally {
        setSubjectsLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const selectedSubject = subjects.find(s => s.id === values.subjectId)
      onSubmit({
        examName: values.examName,
        examType: values.examType || 1,
        subjectId: values.subjectId,
        subjectName: selectedSubject?.subject_name || '',
        description: values.description,
        numOfQuestions: values.numOfQuestions,
        questions: values.questions || [],
        createdBy: exam?.createdBy || '',
        updatedBy: exam?.updatedBy || '',
        status: values.status,
        duration: values.duration,
        passingScore: values.passingScore,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={
        exam ? {
          ...exam,
          subjectId: exam.subjectId || exam.subject
        } : {
          status: "active",
          duration: 60,
          passingScore: 60,
        }
      }
      className="mt-6"
    >
      <Form.Item label="Exam Title" name="examName" rules={[{ required: true, message: "Please enter exam title" }]}>
        <Input placeholder="e.g., Mathematics Final Exam" className="rounded-lg border-slate-300" size="large" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: "Please enter exam description" }]}
      >
        <Input.TextArea
          placeholder="Describe the exam content and objectives"
          rows={3}
          className="rounded-lg border-slate-300"
        />
      </Form.Item>

      <Form.Item label="Subject" name="subjectId" rules={[{ required: true, message: "Please select subject" }]}>
        <Select
          placeholder="Select subject"
          className="rounded-lg"
          size="large"
          loading={subjectsLoading}
          options={subjects.map(subject => ({
            value: subject.id,
            label: subject.subject_name
          }))}
          notFoundContent={subjectsLoading ? <Spin size="small" /> : "No subjects found"}
        />
      </Form.Item>

      <div className="grid grid-cols-2 gap-4">
        <Form.Item
          label="Duration (minutes)"
          name="duration"
          rules={[{ required: true, message: "Please enter duration" }]}
        >
          <InputNumber
            min={15}
            max={480}
            placeholder="60"
            className="w-full rounded-lg border-slate-300"
            size="large"
          />
        </Form.Item>

        <Form.Item
          label="Number of Questions"
          name="numOfQuestions"
          
          rules={[{ required: true, message: "Please enter number of questions" }]}
        >
          <InputNumber min={1} max={500} disabled placeholder="50" className="w-full rounded-lg border-slate-300" size="large" />
        </Form.Item>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <Form.Item label="Status" name="status" rules={[{ required: true, message: "Please select status" }]}>
          <Select
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "Draft", value: "draft" },
            ]}
            className="rounded-lg"
          />
        </Form.Item>
      </div>

      <Form.Item className="mb-0 mt-8">
        <Space className="w-full justify-end">
          <Button onClick={onCancel} size="large" className="rounded-lg">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            size="large"
            className="rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            {exam ? "Update Exam" : "Create Exam"}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
