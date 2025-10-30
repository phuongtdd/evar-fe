import React, { useState } from 'react';
import { Button, List, Card, Tag, Modal, Form, Input, Select, message, Space } from 'antd';
import { ArrowLeftOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Flashcard } from '../../types';
import { flashcardService } from '../../services/learningResourcesService';

const { TextArea } = Input;

interface FlashcardDetailViewProps {
  flashcards: Flashcard[];
  knowledgeBaseId: string;
  cardSetId: string;
  onBack: () => void;
  onUpdate: () => void;
}

const FlashcardDetailView: React.FC<FlashcardDetailViewProps> = ({
  flashcards: initialFlashcards,
  knowledgeBaseId,
  cardSetId,
  onBack,
  onUpdate,
}) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>(initialFlashcards);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFlashcard, setEditingFlashcard] = useState<Flashcard | null>(null);
  const [form] = Form.useForm();

  const handleCreate = () => {
    setEditingFlashcard(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    form.setFieldsValue({
      front: flashcard.front,
      back: flashcard.back,
      difficulty: flashcard.difficulty,
      tags: flashcard.tags,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa flashcard này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await flashcardService.deleteFlashcard(id);
          setFlashcards(flashcards.filter((f) => f.id !== id));
          message.success('Đã xóa flashcard');
          onUpdate();
        } catch (error) {
          console.error('❌ Failed to delete flashcard:', error);
          message.error('Không thể xóa flashcard');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingFlashcard) {
        // Update
        const updated = await flashcardService.updateFlashcard(editingFlashcard.id, {
          ...editingFlashcard,
          ...values,
        });
        setFlashcards(
          flashcards.map((f) => (f.id === updated.id ? updated : f))
        );
        message.success('Đã cập nhật flashcard');
      } else {
        // Create
        const newFlashcard = await flashcardService.createFlashcard(knowledgeBaseId, cardSetId, values);
        setFlashcards([newFlashcard, ...flashcards]);
        message.success('Đã tạo flashcard mới');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      onUpdate();
    } catch (error) {
      console.error('❌ Failed to save flashcard:', error);
      message.error('Không thể lưu flashcard');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'green';
      case 'medium':
        return 'orange';
      case 'hard':
        return 'red';
      default:
        return 'default';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Dễ';
      case 'medium':
        return 'Trung bình';
      case 'hard':
        return 'Khó';
      default:
        return difficulty;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
            Quay lại
          </Button>
          <div>
            <h3 className="text-lg font-semibold">Chi tiết Flashcards</h3>
            <p className="text-sm text-gray-600">
              {flashcards.length} flashcards
            </p>
          </div>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Tạo Flashcard
        </Button>
      </div>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
        dataSource={flashcards}
        renderItem={(flashcard) => (
          <List.Item>
            <Card
              hoverable
              className="h-full"
              actions={[
                <EditOutlined key="edit" onClick={() => handleEdit(flashcard)} />,
                <DeleteOutlined
                  key="delete"
                  onClick={() => handleDelete(flashcard.id)}
                  className="text-red-500"
                />,
              ]}
            >
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Mặt trước:</div>
                  <div className="font-medium line-clamp-2">{flashcard.front}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Mặt sau:</div>
                  <div className="text-sm text-gray-700 line-clamp-2">{flashcard.back}</div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Tag color={getDifficultyColor(flashcard.difficulty)}>
                    {getDifficultyText(flashcard.difficulty)}
                  </Tag>
                  {flashcard.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={editingFlashcard ? 'Chỉnh sửa Flashcard' : 'Tạo Flashcard mới'}
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
            name="front"
            label="Mặt trước (Câu hỏi)"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung mặt trước' }]}
          >
            <TextArea rows={3} placeholder="Nhập câu hỏi hoặc thuật ngữ..." />
          </Form.Item>

          <Form.Item
            name="back"
            label="Mặt sau (Câu trả lời)"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung mặt sau' }]}
          >
            <TextArea rows={3} placeholder="Nhập câu trả lời hoặc định nghĩa..." />
          </Form.Item>

          <Form.Item
            name="difficulty"
            label="Độ khó"
            rules={[{ required: true, message: 'Vui lòng chọn độ khó' }]}
          >
            <Select
              placeholder="Chọn độ khó"
              options={[
                { value: 'easy', label: 'Dễ' },
                { value: 'medium', label: 'Trung bình' },
                { value: 'hard', label: 'Khó' },
              ]}
            />
          </Form.Item>

          <Form.Item name="tags" label="Tags (tùy chọn)">
            <Select
              mode="tags"
              placeholder="Nhập tags và nhấn Enter"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FlashcardDetailView;
