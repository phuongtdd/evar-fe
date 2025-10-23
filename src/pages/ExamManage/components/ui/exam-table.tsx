"use client"

import { Table, Button, Space, Popconfirm, Tag, Tooltip } from "antd"
import { EditOutlined, DeleteOutlined, EyeOutlined, SettingOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import type { Exam } from "../../types"

interface ExamTableProps {
  exams: Exam[]
  loading?: boolean
  onEdit: (exam: Exam) => void
  onDelete: (id: string) => void
  onView: (exam: Exam) => void
  onManageQuestions: (exam: Exam) => void
}

export function ExamTable({ exams, loading = false, onEdit, onDelete, onView, onManageQuestions }: ExamTableProps) {
  const columns: ColumnsType<Exam> = [
    {
      title: "Title",
      dataIndex: "examName",
      key: "examName",
      width: 200,
      render: (text: string) => <span className="font-medium text-slate-900">{text}</span>,
    },
    {
      title: "Subject",
      dataIndex: "subjectName",
      key: "subjectName",
      width: 150,
      render: (text: string, record: Exam) => (
        <Tag color="blue" className="rounded-full px-3 py-1">
          {text || record.subjectName}
        </Tag>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 140,
      render: (duration: number | null) => {
        if (duration === null || duration === undefined) {
          return (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-slate-300"></div>
              <span className="text-slate-400 italic">
                No limit
              </span>
            </div>
          );
        }
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        
        return (
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="font-medium text-slate-700">
              {hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`}
            </span>
          </div>
        );
      },
    },
    {
      title: "Questions",
      dataIndex: "numOfQuestions",
      key: "numOfQuestions",
      width: 100,
      render: (count: number) => <span className="font-semibold text-slate-700">{count || 0}</span>,
    },
    {
      title: "Passing Score",
      dataIndex: "passingScore",
      key: "passingScore",
      width: 120,
      render: (score: number) => (
        <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
          {score || 0}%
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => {
        const statusValue = status || "draft";
        return (
          <Tag color={statusValue === "active" ? "green" : "orange"} className="rounded-full">
            {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
          </Tag>
        );
      },
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 120,
      render: (text: string) => (
        <span className="text-slate-600 font-medium">
          {text || 'Unknown'}
        </span>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string | Date) => (
        <span className="text-slate-600">
          {date ? new Date(date).toLocaleDateString() : 'N/A'}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              className="text-blue-600 hover:text-blue-700"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              className="text-slate-600 hover:text-slate-700"
            />
          </Tooltip>
          <Tooltip title="Manage Questions">
            <Button
              type="text"
              size="small"
              icon={<SettingOutlined />}
              onClick={() => onManageQuestions(record)}
              className="text-green-600 hover:text-green-700"
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Delete Exam"
              description="Are you sure you want to delete this exam? This action cannot be undone."
              onConfirm={() => onDelete(record.id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" size="small" icon={<DeleteOutlined />} className="text-red-600 hover:text-red-700" />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      dataSource={exams}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} exams`,
        className: "px-6 py-4",
      }}
      className="[&_.ant-table-thead>tr>th]:bg-slate-50 [&_.ant-table-thead>tr>th]:font-semibold [&_.ant-table-thead>tr>th]:text-slate-700"
      scroll={{ x: 1200 }}
    />
  )
}
