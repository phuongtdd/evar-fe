import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button, Input, Modal, message, Table, Card, Statistic, Space, Tag, Tooltip } from 'antd';
import { UploadOutlined, SearchOutlined, EyeOutlined, DeleteOutlined, BookOutlined, FileTextOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { KnowledgeBase } from '../../types';
import { knowledgeBaseService } from '../../services/learningResourcesService';

const { Search } = Input;

interface KnowledgeBaseListProps {
  onSelectKnowledgeBase: (kb: KnowledgeBase) => void;
}

const KnowledgeBaseList: React.FC<KnowledgeBaseListProps> = ({
  onSelectKnowledgeBase,
}) => {
  const navigate = useNavigate();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [filteredKnowledgeBases, setFilteredKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);

  // Load knowledge bases on mount
  useEffect(() => {
    loadKnowledgeBases();
  }, []);

  const loadKnowledgeBases = async () => {
    setLoading(true);
    try {
      const data = await knowledgeBaseService.getAllKnowledgeBases();
      setKnowledgeBases(data);
      setFilteredKnowledgeBases(data);
      console.log('✅ Loaded', data.length, 'knowledge bases');
    } catch (error) {
      console.error('❌ Failed to load knowledge bases:', error);
      message.error('Không thể tải danh sách knowledge base');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    if (!value.trim()) {
      setFilteredKnowledgeBases(knowledgeBases);
      return;
    }

    const filtered = knowledgeBases.filter(
      (kb) =>
        kb.title.toLowerCase().includes(value.toLowerCase()) ||
        kb.description.toLowerCase().includes(value.toLowerCase()) ||
        kb.subject.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredKnowledgeBases(filtered);
  };

  const handleCreate = () => {
    navigate('/evar-turtor');
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa tài nguyên học liệu này?</p>
          <p className="text-red-500 mt-2">
            <strong>Cảnh báo:</strong> Thao tác này sẽ xóa:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Tất cả thẻ ghi nhớ</li>
            <li>Ghi chú người dùng</li>
            <li>Ghi chú quan trọng</li>
            <li>File PDF trên Cloudinary</li>
            <li>Tài nguyên học liệu</li>
          </ul>
          <p className="text-gray-600 mt-2 text-sm">
            Quá trình này có thể mất vài giây...
          </p>
        </div>
      ),
      okText: 'Xóa tất cả',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        const hide = message.loading('Đang xóa tài nguyên học liệu và tài nguyên liên quan...', 0);
        try {
          await knowledgeBaseService.deleteKnowledgeBase(id);
          const updated = knowledgeBases.filter((kb) => kb.id !== id);
          setKnowledgeBases(updated);
          setFilteredKnowledgeBases(updated.filter(kb => 
            !searchText || 
            kb.title.toLowerCase().includes(searchText.toLowerCase()) ||
            kb.description.toLowerCase().includes(searchText.toLowerCase())
          ));
          hide();
          message.success('Đã xóa tài nguyên học liệu và tất cả tài nguyên liên quan');
        } catch (error) {
          hide();
          console.error('❌ Failed to delete knowledge base:', error);
          message.error('Không thể xóa tài nguyên học liệu. Vui lòng thử lại.');
        }
      },
    });
  };


  // Calculate statistics
  const totalKnowledgeBases = knowledgeBases.length;
  const totalResources = knowledgeBases.reduce((sum, kb) => 
    sum + kb.flashcardCount + kb.noteCount + kb.keynoteCount, 0
  );

  // Table columns
  const columns: ColumnsType<KnowledgeBase> = [
    {
      title: 'Tên Knowledge Base',
      dataIndex: 'title',
      key: 'title',
      width: '25%',
      render: (text: string, record: KnowledgeBase) => (
        <div className="flex items-center gap-3">
          <div 
            className="w-2 h-12 rounded"
            style={{ backgroundColor: record.color || '#3b82f6' }}
          />
          <div>
            <div className="font-semibold text-base">{text}</div>
            <div className="text-xs text-gray-500">
              Tạo: {new Date(record.createdAt).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: '30%',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span className="text-gray-600">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Môn học',
      dataIndex: 'subject',
      key: 'subject',
      width: '10%',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
      filters: Array.from(new Set(knowledgeBases.map(kb => kb.subject))).map(subject => ({
        text: subject,
        value: subject,
      })),
      onFilter: (value, record) => record.subject === value,
    },
    {
      title: 'Lớp',
      dataIndex: 'grade',
      key: 'grade',
      width: '8%',
      render: (text: string) => <Tag color="green">Lớp {text}</Tag>,
      sorter: (a, b) => parseInt(a.grade) - parseInt(b.grade),
    },
    {
      title: 'Tài nguyên',
      key: 'resources',
      width: '15%',
      render: (_, record: KnowledgeBase) => (
        <Space size="middle">
          <Tooltip title="Flashcards">
            <Tag color="purple">{record.flashcardCount}</Tag>
          </Tooltip>
          <Tooltip title="Notes">
            <Tag color="orange">{record.noteCount}</Tag>
          </Tooltip>
          <Tooltip title="Keynotes">
            <Tag color="cyan">{record.keynoteCount}</Tag>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: '12%',
      render: (_, record: KnowledgeBase) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onSelectKnowledgeBase(record)}
            >
              Xem
            </Button>
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Tài nguyên học tập</h1>
          <p className="text-gray-600">Quản lý tài nguyên học liệu, thẻ ghi nhớ, ghi chú và ghi chú quan trọng</p>
        </div>
        <Button
          type="primary"
          icon={<UploadOutlined />}
          size="large"
          onClick={handleCreate}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Tải lên tài liệu
        </Button>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Tổng tài nguyên học liệu"
              value={totalKnowledgeBases}
              prefix={<BookOutlined className="text-blue-500" />}
              valueStyle={{ color: '#3b82f6' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Tổng tài nguyên học tập"
              value={totalResources}
              prefix={<FileTextOutlined className="text-green-500" />}
              valueStyle={{ color: '#10b981' }}
              suffix="items"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Môn học"
              value={new Set(knowledgeBases.map(kb => kb.subject)).size}
              prefix={<BookOutlined className="text-purple-500" />}
              valueStyle={{ color: '#8b5cf6' }}
              suffix="môn"
            />
          </Card>
        </Col>
      </Row>

      {/* Search Bar */}
      <div className="mb-4">
        <Search
          placeholder="Tìm kiếm theo tên, mô tả, môn học..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 600 }}
        />
      </div>

      {/* Table */}
      <Card>
        <Table<KnowledgeBase>
          columns={columns}
          dataSource={filteredKnowledgeBases}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} tài nguyên học liệu`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          locale={{
            emptyText: searchText
              ? 'Không tìm thấy tài nguyên học liệu nào'
              : 'Chưa có tài nguyên học liệu nào. Hãy tạo mới!',
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default KnowledgeBaseList;
