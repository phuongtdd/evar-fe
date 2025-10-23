"use client"

import { useState, useEffect, useCallback } from "react"
import { Button, Modal, message } from "antd"
import { PlusOutlined, EditOutlined, ReloadOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { ExamTable } from "./components/ui/exam-table"
import { ExamForm } from "./components/ui/exam-form"
import { ExamDetail } from "./components/layout/exam-detail"
import { ExamInfoModal } from "./components/ui/exam-info-modal"
import { ExamQuestionsManager } from "./components/layout/exam-questions-manager"
import { examService } from "./services/examService"
import type { Exam } from "./types"
import BackButton from "../Common/BackButton"

export function ExamAdminPanel() {
  const navigate = useNavigate()
  const [exams, setExams] = useState<Exam[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDetailVisible, setIsDetailVisible] = useState(false)
  const [isExamInfoModalVisible, setIsExamInfoModalVisible] = useState(false)
  const [isQuestionsManagerVisible, setIsQuestionsManagerVisible] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | null>(null)
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null)
  const [questionsManagerExam, setQuestionsManagerExam] = useState<Exam | null>(null)

  // Hàm lấy danh sách bài thi
  const fetchExams = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }
      const response = await examService.getAllExams(0, 10)
      setExams(response.data || [])
    } catch (error) {
      console.error('Lỗi khi tải bài thi:', error)
      message.error('Không thể tải danh sách bài thi')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Lấy bài thi khi component mount
  useEffect(() => {
    fetchExams()
  }, [])

  const handleAddExam = () => {
    setEditingExam(null)
    setIsModalVisible(true)
  }

  const handleCreateExamManual = () => {
    setIsExamInfoModalVisible(true)
  }

  const handleExamInfoSubmit = (examInfo: any) => {
    console.log('Nhận thông tin bài thi trong ExamManage:', examInfo);
    // Điều hướng đến create-exam với thông tin bài thi
    const quizInfo = {
      title: examInfo.examName,
      subject: examInfo.subject,
      subjectId: examInfo.subjectId,
      grade: examInfo.grade,
      description: examInfo.description,
      time: `${Math.floor(examInfo.duration / 60).toString().padStart(2, '0')}:${(examInfo.duration % 60).toString().padStart(2, '0')}:00`
    };
    console.log('Thông tin bài thi được gửi:', quizInfo);
    navigate('/admin/create-exam', { 
      state: { quizInfo }
    })
    setIsExamInfoModalVisible(false)
  }

  const handleEditExam = (exam: Exam) => {
    // Đảm bảo bài thi có subjectId cho form
    const examWithSubjectId = {
      ...exam,
      subjectId: exam.subjectId || exam.subject || ''
    }
    setEditingExam(examWithSubjectId)
    setIsModalVisible(true)
  }

  const handleViewExam = (exam: Exam) => {
    setSelectedExam(exam)
    setIsDetailVisible(true)
  }

  const handleManageQuestions = (exam: Exam) => {
    setQuestionsManagerExam(exam)
    setIsQuestionsManagerVisible(true)
  }

  const handleQuestionsUpdate = useCallback((updatedQuestions: any[]) => {
    if (questionsManagerExam) {
      const updatedExam = { ...questionsManagerExam, questions: updatedQuestions }
      setQuestionsManagerExam(updatedExam)
      
      // Update the exam in the main list
      setExams(prevExams => prevExams.map(exam => 
        exam.id === questionsManagerExam.id ? updatedExam : exam
      ))
    }
  }, [questionsManagerExam])

  const handleDeleteExam = async (id: string) => {
    try {
      await examService.deleteExam(id)
      setExams(exams.filter((exam) => exam.id !== id))
      message.success("Xóa bài thi thành công")
      // Làm mới danh sách để đảm bảo tính nhất quán dữ liệu
      fetchExams(false)
    } catch (error) {
      console.error('Lỗi khi xóa bài thi:', error)
      message.error('Không thể xóa bài thi')
    }
  }

  const handleSaveExam = async (formData: Omit<Exam, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (editingExam) {
        // Cập nhật bài thi hiện tại
        const updatedExam = await examService.updateExam(editingExam.id, {
          examName: formData.examName,
          examType: formData.examType,
          subjectId: formData.subjectId || '',
          description: formData.description,
          numOfQuestions: formData.numOfQuestions,
          questions: formData.questions || [],
          duration: formData.duration
        })
        
        setExams(
          exams.map((exam) =>
            exam.id === editingExam.id ? updatedExam : exam
          ),
        )
        message.success("Cập nhật bài thi thành công")
      } else {
        // Tạo bài thi mới
        const createData = {
          examName: formData.examName,
          examType: formData.examType,
          subjectId: formData.subjectId || '',
          description: formData.description,
          numOfQuestions: formData.numOfQuestions,
          questions: formData.questions || [],
          duration: formData.duration
        }
        
        const newExam = await examService.createExam(createData)
        setExams([newExam, ...exams])
        message.success("Tạo bài thi thành công")
      }
      setIsModalVisible(false)
    } catch (error) {
      console.error('Lỗi khi lưu bài thi:', error)
      message.error('Không thể lưu bài thi')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Quản lí bài thi</h1>
            <p className="mt-2 text-slate-600">Tạo, cập nhật, quản lí các bài thi trên hệ thống</p>
            <BackButton url={'/admin'}/>
          </div>
          <div className="flex gap-3">
            <Button
              type="default"
              size="large"
              icon={<ReloadOutlined />}
              onClick={() => fetchExams(false)}
              loading={refreshing}
              className="border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Làm mới
            </Button>
            <Button
              type="default"
              size="large"
              icon={<EditOutlined />}
              onClick={handleCreateExamManual}
              className="border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Tạo bài thi thủ công
            </Button>

          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatsCard title="Tổng số bài thi" value={exams.length} color="bg-blue-50" textColor="text-blue-600" />
          <StatsCard
            title="Bài thi hoạt động"
            value={exams.filter((e) => e.status === "active").length}
            color="bg-green-50"
            textColor="text-green-600"
          />
          <StatsCard
            title="Có thời gian"
            value={`${exams.filter(e => e.duration !== null && e.duration !== undefined).length}/${exams.length}`}
            color="bg-purple-50"
            textColor="text-purple-600"
          />
          <StatsCard
            title="Trung bình câu hỏi"
            value={Math.round(exams.reduce((sum, e) => sum + e.numOfQuestions, 0) / exams.length || 0)}
            color="bg-orange-50"
            textColor="text-orange-600"
          />
        </div>

        <div className="rounded-lg bg-white shadow-sm">
          <ExamTable 
            exams={exams} 
            loading={loading}
            onEdit={handleEditExam} 
            onDelete={handleDeleteExam} 
            onView={handleViewExam}
            onManageQuestions={handleManageQuestions}
          />
        </div>
      </div>

      <Modal
        title={editingExam ? "Chỉnh sửa bài thi" : "Tạo bài thi mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
        className="rounded-lg"
      >
        <ExamForm exam={editingExam} onSubmit={handleSaveExam} onCancel={() => setIsModalVisible(false)} />
      </Modal>

      <Modal
        title="Chi tiết bài thi"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={null}
        width={600}
      >
        {selectedExam && <ExamDetail exam={selectedExam} />}
      </Modal>

      <Modal
        title="Tạo bài thi mới"
        open={isExamInfoModalVisible}
        onCancel={() => setIsExamInfoModalVisible(false)}
        footer={null}
        width={800}
        className="rounded-lg"
      >
        <ExamInfoModal
          visible={isExamInfoModalVisible}
          onCancel={() => setIsExamInfoModalVisible(false)}
          onSubmit={handleExamInfoSubmit}
        />
      </Modal>

      <Modal
        title="Quản lý câu hỏi"
        open={isQuestionsManagerVisible}
        onCancel={() => setIsQuestionsManagerVisible(false)}
        footer={null}
        width={1200}
        className="rounded-lg"
      >
        {questionsManagerExam && (
          <ExamQuestionsManager
            exam={questionsManagerExam}
            onQuestionsUpdate={handleQuestionsUpdate}
          />
        )}
      </Modal>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: string | number
  color: string
  textColor: string
}

function StatsCard({ title, value, color, textColor }: StatsCardProps) {
  return (
    <div className={`rounded-lg ${color} p-6`}>
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${textColor}`}>{value}</p>
    </div>
  )
}