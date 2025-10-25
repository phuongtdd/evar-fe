"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Popconfirm,
  message,
  Tabs,
  Card,
  Badge,
  Empty,
  Spin,
} from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, BarChartOutlined, SearchOutlined } from "@ant-design/icons"
import type { TableColumnsType } from "antd"
import type { Subject } from "../../types"
import { generateMockSubjects } from "../../mock"
import { SubjectChart } from "./SubjectChart"
import { formatDate } from "../../utils/utils"
import { subjectService, type SubjectRequest, type SubjectUpdateRequest } from "../../services/subjectService"
import BackButton from "../../../Common/BackButton"

export const SubjectAdminPanel: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      // Giả sử API trả về subjects với grade là cấp lớp (ví dụ: 10, 11, 12)
      const { subjects: fetchedSubjects } = await subjectService.getAllSubjects()
      setSubjects(fetchedSubjects)
    } catch (error) {
      console.error('Không thể tải danh sách môn học:', error)
      message.error('Không tải được dữ liệu. Đang sử dụng dữ liệu giả.')
      // Fallback to mock data if API fails
      setSubjects(generateMockSubjects())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.subject_name.toLowerCase().includes(searchText.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchText.toLowerCase()),
  )

  const handleAddSubject = () => {
    setEditingId(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEditSubject = (record: Subject) => {
    setEditingId(record.id)
    form.setFieldsValue({
      subject_name: record.subject_name,
      description: record.description,
      grade: record.grade, // Giữ nguyên giá trị grade/level
    })
    setIsModalOpen(true)
  }

  const handleDeleteSubject = async (id: string) => {
    try {
      await subjectService.deleteSubject(id)
      setSubjects(subjects.filter((s) => s.id !== id))
      message.success("Môn học đã được xóa thành công")
    } catch (error) {
      console.error('Không thể xóa môn học:', error)
      message.error('Xóa môn học thất bại')
    }
  }

  const handleModalOk = async () => {
    try {
      setSubmitting(true)
      const values = await form.validateFields()

      if (editingId) {
        const updateData: SubjectUpdateRequest = {
          id: editingId,
          subjectName: values.subject_name,
          description: values.description,
          grade: values.grade, // Lưu cấp lớp/mức điểm
        }
        const updatedSubject = await subjectService.updateSubject(updateData)
        setSubjects(
          subjects.map((s) =>
            s.id === editingId ? updatedSubject : s
          ),
        )
        message.success("Cập nhật môn học thành công")
      } else {
        const createData: SubjectRequest = {
          subjectName: values.subject_name,
          description: values.description,
          grade: values.grade, // Lưu cấp lớp/mức điểm
        }
        const newSubject = await subjectService.createSubject(createData)
        setSubjects([...subjects, newSubject])
        message.success("Tạo môn học thành công")
      }

      setIsModalOpen(false)
      form.resetFields()
    } catch (error) {
      console.error("Thao tác thất bại:", error)
      message.error('Thao tác thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  // Hàm tạo Badge dựa trên Cấp lớp (Grade Level)
  const getGradeBadge = (grade: number) => {
    const gradeLabels: { [key: number]: string } = {
      1: "Khối 1", 2: "Khối 2", 3: "Khối 3", 4: "Khối 4", 5: "Khối 5",
      6: "Khối 6", 7: "Khối 7", 8: "Khối 8", 9: "Khối 9",
      10: "Khối 10", 11: "Khối 11", 12: "Khối 12"
    }

    const colors = [
      "#10b981", "#3b82f6", "#f59e0b", "#ef4444",
      "#8b5cf6", "#06b6d4", "#84cc16", "#f97316",
      "#ec4899", "#6366f1", "#14b8a6", "#eab308"
    ]

    const gradeKey = grade >= 1 && grade <= 12 ? grade : 0; // Đảm bảo key nằm trong phạm vi 1-12

    return <Badge color={colors[gradeKey - 1] || "#6b7280"} text={gradeLabels[gradeKey] || `Khối ${grade}`} />
  }

  const columns: TableColumnsType<Subject> = [
    {
      title: "Tên Môn học",
      dataIndex: "subject_name",
      key: "subject_name",
      width: 160,
      sorter: (a, b) => a.subject_name.localeCompare(b.subject_name),
      render: (text: string) => <span className="font-semibold text-slate-900">{text}</span>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 280,
      ellipsis: { showTitle: false },
      render: (text: string) => (
        <span title={text} className="text-slate-600">
          {text}
        </span>
      ),
    },
    {
      title: "Khối/Lớp", // Dịch tiêu đề cột
      dataIndex: "grade",
      key: "grade",
      width: 140,
      sorter: (a, b) => a.grade - b.grade,
      render: (grade: number) => getGradeBadge(grade),
    },
    {
      title: "Người Tạo", // Dịch tiêu đề cột
      dataIndex: "create_by",
      key: "create_by",
      width: 120,
      render: (text: string) => <span className="text-slate-600">{text}</span>,
    },
    {
      title: "Ngày Tạo", // Dịch tiêu đề cột
      dataIndex: "create_at",
      key: "create_at",
      width: 130,
      render: (date: Date) => <span className="text-slate-500 text-sm">{formatDate(date)}</span>,
      sorter: (a, b) => new Date(a.create_at).getTime() - new Date(b.create_at).getTime(),
    },
    {
      title: "Thao tác", // Dịch tiêu đề cột
      key: "actions",
      width: 110,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEditSubject(record)}
            className="bg-blue-500 hover:bg-blue-600 border-0"
          />
          <Popconfirm
            title="Xóa Môn học"
            description="Bạn có chắc chắn muốn xóa môn học này không?"
            onConfirm={() => handleDeleteSubject(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
              Quản lý Môn học
            </h1>
            <p className="text-slate-600 text-lg">Quản lý và theo dõi tất cả các môn học với phân tích chuyên sâu</p>
            <BackButton url={"/admin"}/>
          </div>
        </div>
      </div>

      <Tabs
        defaultActiveKey="1"
        className="subject-tabs"
        items={[
          {
            key: "1",
            label: (
              <span className="flex items-center gap-2 px-2">
                <span className="font-semibold">Danh sách Môn học</span>
              </span>
            ),
            children: (
              <Card className="bg-white shadow-lg border-0 rounded-xl">
                {/* Thanh công cụ */}
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 w-full sm:w-auto">
                    <Input
                      placeholder="Tìm kiếm môn học..."
                      prefix={<SearchOutlined className="text-slate-400" />}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="rounded-lg border-slate-200"
                      size="large"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-600 font-medium">
                      Tổng cộng: <span className="text-blue-600 font-bold text-lg">{subjects.length}</span>
                    </span>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={handleAddSubject}
                      className="bg-blue-500 hover:bg-blue-600 border-0 rounded-lg font-semibold h-10 px-6"
                      size="large"
                    >
                      Thêm Môn học
                    </Button>
                  </div>
                </div>

                {/* Bảng dữ liệu */}
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Spin size="large" />
                  </div>
                ) : (
                  <Table
                    columns={columns}
                    dataSource={filteredSubjects}
                    rowKey="id"
                    pagination={{
                      pageSize: 10,
                      showSizeChanger: true,
                      showTotal: (total) => `Tổng cộng ${total} môn học`,
                      className: "text-slate-600",
                    }}
                    scroll={{ x: 1200 }}
                    className="subject-table"
                    locale={{
                      emptyText: (
                        <Empty description="Không tìm thấy môn học nào" style={{ marginTop: "48px", marginBottom: "48px" }} />
                      ),
                    }}
                  />
                )}
              </Card>
            ),
          },
          {
            key: "2",
            label: (
              <span className="flex items-center gap-2 px-2">
                <BarChartOutlined />
                <span className="font-semibold">Phân tích</span>
              </span>
            ),
            children: (
              <Card className="bg-white shadow-lg border-0 rounded-xl">
                {/* Gọi SubjectChart đã được dịch và điều chỉnh logic */}
                <SubjectChart subjects={subjects} />
              </Card>
            ),
          },
        ]}
      />


      <Modal
        title={
          <span className="text-xl font-bold text-slate-900">{editingId ? "Sửa Môn học" : "Tạo Môn học Mới"}</span>
        }
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        okText={editingId ? "Cập nhật" : "Tạo"}
        cancelText="Hủy bỏ"
        className="subject-modal"
        width={600}
        okButtonProps={{ className: "bg-blue-500 hover:bg-blue-600 border-0", loading: submitting }}
        confirmLoading={submitting}
      >
        <Form form={form} layout="vertical" className="mt-6">
          <Form.Item
            label={<span className="font-semibold text-slate-700">Tên Môn học</span>}
            name="subject_name"
            rules={[
              { required: true, message: "Vui lòng nhập tên môn học" },
              { min: 3, message: "Tên môn học phải có ít nhất 3 ký tự" },
            ]}
          >
            <Input placeholder="Ví dụ: Ngữ Văn" size="large" className="rounded-lg" />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-slate-700">Mô tả</span>}
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả" },
              { min: 10, message: "Mô tả phải có ít nhất 10 ký tự" },
            ]}
          >
            <Input.TextArea
              placeholder="Nhập mô tả chi tiết về môn học"
              rows={4}
              className="rounded-lg"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold text-slate-700">Khối Lớp (0-100)</span>}
            name="grade"
            rules={[
              { required: true, message: "Vui lòng nhập Khối/Lớp" },
              { type: "number", min: 0, max: 100, message: "Khối/Lớp phải nằm trong khoảng 0 đến 100" },
            ]}
          >
            <InputNumber min={0} max={100} placeholder="Nhập Khối/Lớp" className="w-full rounded-lg" size="large" />
          </Form.Item>
        </Form>
      </Modal>

      <style jsx global>{`
        .subject-tabs .ant-tabs-tab {
          border-radius: 8px 8px 0 0 !important;
          margin-right: 4px;
          transition: all 0.3s ease;
        }

        .subject-tabs .ant-tabs-tab-active {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .subject-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: white !important;
        }

        .subject-table .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          font-weight: 700;
          color: #334155;
          border-bottom: 2px solid #e2e8f0;
        }

        .subject-table .ant-table-tbody > tr {
          transition: all 0.2s ease;
        }

        .subject-table .ant-table-tbody > tr:hover {
          background-color: #f0f9ff !important;
        }

        .subject-modal .ant-modal-content {
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .subject-modal .ant-modal-header {
          border-bottom: 1px solid #e2e8f0;
          border-radius: 12px 12px 0 0;
        }

        .ant-input,
        .ant-input-number,
        .ant-select-selector {
          border-radius: 8px !important;
          border-color: #e2e8f0 !important;
          transition: all 0.3s ease;
        }

        .ant-input:hover,
        .ant-input-number:hover,
        .ant-select-selector:hover {
          border-color: #3b82f6 !important;
        }

        .ant-input:focus,
        .ant-input-number-focused,
        .ant-select-focused .ant-select-selector {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }

        .ant-btn-primary {
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .ant-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
        }

        .ant-badge-status-dot {
          width: 8px;
          height: 8px;
        }
      `}</style>
    </div>
  )
}