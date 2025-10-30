import React, { useState, useEffect } from 'react';
import { Button, Card, Tag, Modal, Form, Input, Empty, message, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FileImageOutlined, EyeOutlined } from '@ant-design/icons';
import { Keynote } from '../../types';
import { keynoteService } from '../../services/learningResourcesService';

const { TextArea } = Input;

interface KeynoteManagerProps {
  knowledgeBaseId: string;
}

const KeynoteManager: React.FC<KeynoteManagerProps> = ({ knowledgeBaseId }) => {
  const [keynotes, setKeynotes] = useState<Keynote[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKeynote, setEditingKeynote] = useState<Keynote | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadKeynotes();
  }, [knowledgeBaseId]);

  const loadKeynotes = async () => {
    setLoading(true);
    try {
      const data = await keynoteService.getKeynotesByKnowledgeBaseId(knowledgeBaseId);
      setKeynotes(data);
      console.log('✅ Loaded', data.length, 'keynotes for KB', knowledgeBaseId);
    } catch (error) {
      console.error('❌ Failed to load keynotes:', error);
      message.error('Không thể tải keynotes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingKeynote(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (keynote: Keynote) => {
    setEditingKeynote(keynote);
    form.setFieldsValue({
      title: keynote.title,
      tags: keynote.tags,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa keynote này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await keynoteService.deleteKeynote(id);
          setKeynotes(keynotes.filter((k) => k.id !== id));
          message.success('Đã xóa keynote');
        } catch (error) {
          console.error('❌ Failed to delete keynote:', error);
          message.error('Không thể xóa keynote');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingKeynote) {
        // Update
        const updated = await keynoteService.updateKeynote(editingKeynote.id, {
          ...editingKeynote,
          ...values,
        });
        setKeynotes(
          keynotes.map((k) => (k.id === updated.id ? updated : k))
        );
        message.success('Đã cập nhật keynote');
      } else {
        // Create
        const newKeynote = await keynoteService.createKeynote(knowledgeBaseId, values);
        setKeynotes([newKeynote, ...keynotes]);
        message.success('Đã tạo keynote mới');
      }
      
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('❌ Failed to save keynote:', error);
      message.error('Không thể lưu keynote');
    }
  };

  const handleViewKeynote = (keynote: Keynote) => {
    Modal.info({
      title: keynote.title,
      width: 900,
      content: (
        <div className="mt-4 space-y-4 max-h-[600px] overflow-y-auto">
          {keynote.slides.map((slide, index) => (
            <Card 
              key={slide.id} 
              size="small" 
              title={
                <div className="flex justify-between items-center">
                  <span>Slide {index + 1}</span>
                  <div className="flex gap-2">
                    {slide.pageNumber && (
                      <Tag color="blue">Trang {slide.pageNumber}</Tag>
                    )}
                    <Tag color="purple">
                      {(slide.relevance * 100).toFixed(0)}%
                    </Tag>
                  </div>
                </div>
              }
            >
              <div className="whitespace-pre-wrap">{slide.content}</div>
            </Card>
          ))}
        </div>
      ),
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Quản lý Keynotes</h3>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Tạo Keynote
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" tip="Đang tải keynotes..." />
        </div>
      ) : keynotes.length === 0 ? (
        <Empty description="Chưa có keynote nào" />
      ) : (
        <Card
          hoverable
          className="max-w-md"
          cover={
            <div className="h-40 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <FileImageOutlined className="text-6xl text-white" />
            </div>
          }
        >
          <div className="space-y-3">
            <div>
              <div className="font-semibold text-lg mb-1">{keynotes[0].title}</div>
              <div className="text-sm text-gray-600">
                {keynotes[0].slides.length} slides
              </div>
            </div>
            <div className="text-sm text-gray-700 line-clamp-3">
              {keynotes[0].slides[0]?.content}
            </div>
            <Button 
              type="primary" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewKeynote(keynotes[0])}
              block
            >
              Xem tất cả slides
            </Button>
          </div>
        </Card>
      )}

      <Modal
        title={editingKeynote ? 'Chỉnh sửa Keynote' : 'Tạo Keynote mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="title"
            label="Tiêu đề Keynote"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input placeholder="Nhập tiêu đề keynote..." />
          </Form.Item>

          <Form.Item name="tags" label="Tags (tùy chọn)">
            <Input 
              placeholder="Nhập tags, phân cách bằng dấu phẩy"
              onChange={(e) => {
                const tags = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                form.setFieldsValue({ tags });
              }}
            />
          </Form.Item>

          <div className="text-sm text-gray-500 mt-2">
            * Sau khi tạo, bạn có thể thêm và chỉnh sửa các slides
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default KeynoteManager;
