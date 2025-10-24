"use client";

import { Table, Input, Button, Tag, Space, message, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FilterOutlined, EyeOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useState, useMemo, useEffect } from "react";
import { fetchUserSubmissions, SubmissionResponse, deleteSubmission } from "../../services/submissionService";
import { getUserIdFromToken } from "../../../../utils/auth";
import SubmissionDetailModal from "../ui/submission-detail-modal";
import type { GetProps } from "antd";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
  console.log(info?.source, value);

export default function HistorySection() {
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [deletingSubmissionId, setDeletingSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    const loadSubmissions = async () => {
      setLoading(true);
      try {
        const userId = getUserIdFromToken();
        if (!userId) {
          message.error("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
          return;
        }
        
        const data = await fetchUserSubmissions(userId);
        console.log('📊 Raw submission data from API:', data);
        console.log('📊 First submission sample:', data[0]);
        
        data.forEach((submission, index) => {
          if (!submission.submittedAt) {
            console.warn(`⚠️ Submission ${index} has null/undefined submittedAt:`, submission);
          }
        });
        
        setSubmissions(data);
        
        if (data.length === 0) {
          message.info({
            content: "Bạn chưa có bài làm nào. Hãy thử làm bài để xem lịch sử!",
            duration: 4,
          });
        }
      } catch (error) {
        console.error("Failed to fetch submissions for history section:", error);
        message.error({
          content: "Không thể tải lịch sử làm bài. Vui lòng thử lại.",
          duration: 4,
        });
      } finally {
        setLoading(false);
      }
    };

    loadSubmissions();
  }, []);

  const handleDeleteSubmission = async (id: string, examName: string) => {
    console.log('🔍 Delete submission clicked:', { id, examName });
    
    Modal.confirm({
      title: "Xác nhận xóa bài làm",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa bài làm "${examName}"? Hành động này không thể hoàn tác.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        console.log('✅ User confirmed deletion for ID:', id);
        setDeletingSubmissionId(id);
        
        try {
          console.log('🚀 Calling deleteSubmission API with ID:', id);
          const result = await deleteSubmission(id);
          console.log('✅ Delete API success:', result);
          
          message.success({
            content: "Xóa bài làm thành công!",
            duration: 3,
          });
          
          // Reload submissions after deletion
          console.log('🔄 Reloading submissions...');
          const userId = getUserIdFromToken();
          if (userId) {
            const data = await fetchUserSubmissions(userId);
            setSubmissions(data);
            console.log('✅ Submissions reloaded:', data.length, 'items');
          }
        } catch (error: any) {
          console.error("❌ Failed to delete submission:", error);
          console.error("❌ Error details:", {
            message: error?.response?.data?.message || error?.message,
            status: error?.response?.status,
            statusText: error?.response?.statusText,
            data: error?.response?.data
          });
          
          // Show more detailed error message
          let errorMessage = 'Vui lòng thử lại.';
          if (error?.response?.status === 403) {
            errorMessage = 'Bạn không có quyền xóa bài làm này.';
          } else if (error?.response?.status === 404) {
            errorMessage = 'Không tìm thấy bài làm để xóa.';
          } else if (error?.response?.status === 500) {
            errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
          } else if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          
          message.error({
            content: `Không thể xóa bài làm. ${errorMessage}`,
            duration: 4,
          });
        } finally {
          setDeletingSubmissionId(null);
        }
      },
    });
  };

  const handleViewSubmission = (id: string, examName: string) => {
    setSelectedSubmissionId(id);
    setDetailModalVisible(true);
    message.info({
      content: `Đang tải chi tiết bài làm "${examName}"...`,
      duration: 2,
    });
  };

  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setSelectedSubmissionId(null);
  };

  const filteredSubmissions = useMemo(() => {
    if (!searchText) return submissions;
    const filtered = submissions.filter(submission => 
      submission.examName.toLowerCase().includes(searchText.toLowerCase()) ||
      submission.username.toLowerCase().includes(searchText.toLowerCase())
    );
    
    // Show message if no results found
    if (searchText && filtered.length === 0 && submissions.length > 0) {
      message.warning({
        content: `Không tìm thấy bài làm nào với từ khóa "${searchText}"`,
        duration: 3,
      });
    }
    
    return filtered;
  }, [submissions, searchText]);

  const columns: ColumnsType<SubmissionResponse> = useMemo(
    () => [
      {
        title: "Tên bài thi",
        dataIndex: "examName",
        key: "examName",
        render: (value) => <span className="font-semibold text-gray-900">{value}</span>,
      },
      {
        title: "Điểm số",
        dataIndex: "totalScore",
        key: "totalScore",
        align: "center",
        render: (value: number) => (
      
          <span>  {value?.toFixed(1) || "N/A"}
          </span>
         
        ),
      },
      {
        title: "Lần thử",
        dataIndex: "timeTry",
        key: "timeTry",
        align: "center",
        render: (value: number) => (
          <Tag color="blue">Lần {value}</Tag>
        ),
      },
      {
        title: "Người làm",
        dataIndex: "username",
        key: "username",
      },
      {
        title: "Ngày nộp",
        dataIndex: "submittedAt",
        key: "submittedAt",
        render: (value: string | null) => {
          if (!value || value === null || value === undefined || value === '') {
            return <span style={{ color: '#999', fontStyle: 'italic' }}>Chưa có thông tin</span>;
          }
          
          try {
            const date = new Date(value);
            if (isNaN(date.getTime())) {
              console.warn('Invalid date value:', value);
              return <span style={{ color: '#999', fontStyle: 'italic' }}>Ngày không hợp lệ</span>;
            }
            
            return date.toLocaleDateString("vi-VN", {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            });
          } catch (error) {
            console.error('Error parsing date:', value, error);
            return <span style={{ color: '#999', fontStyle: 'italic' }}>Lỗi hiển thị ngày</span>;
          }
        },
      },
      {
        title: "Thao tác",
        key: "actions",
        render: (_, submission) => (
          <Space>
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewSubmission(submission.id, submission.examName)}
              title="Xem chi tiết"
              disabled={deletingSubmissionId === submission.id}
            />
          </Space>
        ),
      },
    ],
    [deletingSubmissionId]
  );

  return (
    <>
      <h4 className="text-[18px] !font-extrabold mb-2">Lịch sử làm bài</h4>

      <div className="flex gap-3 mb-1">
        <Search
          placeholder="Tìm kiếm theo tên bài thi hoặc người làm"
          onSearch={(value) => setSearchText(value)}
          enterButton
          style={{ maxWidth: "300px" }}
          className="flex-1"
          allowClear
        />
        <Button icon={<FilterOutlined />} />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filteredSubmissions}
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} của ${total} bài làm`
        }}
        locale={{
          emptyText: "Chưa có bài làm nào"
        }}
      />

      <SubmissionDetailModal
        visible={detailModalVisible}
        submissionId={selectedSubmissionId}
        onClose={handleCloseDetailModal}
      />
    </>
  );
}