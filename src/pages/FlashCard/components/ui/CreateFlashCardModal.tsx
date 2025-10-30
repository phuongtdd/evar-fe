import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { FlashCardFormData } from '../../types';
import { DIFFICULTY_LABELS, CATEGORIES } from '../../constants';

interface CreateFlashCardModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: FlashCardFormData) => Promise<void>;
  loading?: boolean;
  initialValues?: Partial<FlashCardFormData>;
  title?: string;
}

const CreateFlashCardModal: React.FC<CreateFlashCardModalProps> = ({
  visible,
  onClose,
  onSubmit,
  loading,
  initialValues,
  title = 'Tạo Flashcard Mới',
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error('Validation error:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          loading={loading} 
          onClick={handleSubmit}
        >
          Lưu
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues || { difficulty: 'medium', tags: [], category: CATEGORIES[0] }}
      >
        <Form.Item
          name="front"
          label="Mặt trước (Câu hỏi)"
          rules={[{ required: true, message: 'Vui lòng nhập câu hỏi' }]}
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Nhập câu hỏi..." 
          />
        </Form.Item>

        <Form.Item
          name="back"
          label="Mặt sau (Câu trả lời)"
          rules={[{ required: true, message: 'Vui lòng nhập câu trả lời' }]}
        >
          <Input.TextArea 
            rows={3} 
            placeholder="Nhập câu trả lời..." 
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn danh mục">
              {CATEGORIES.map(cat => (
                <Select.Option key={cat} value={cat}>
                  {cat}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="difficulty"
            label="Độ khó"
            rules={[{ required: true, message: 'Vui lòng chọn độ khó' }]}
          >
            <Select placeholder="Chọn độ khó">
              <Select.Option value="easy">{DIFFICULTY_LABELS.easy}</Select.Option>
              <Select.Option value="medium">{DIFFICULTY_LABELS.medium}</Select.Option>
              <Select.Option value="hard">{DIFFICULTY_LABELS.hard}</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="tags" label="Tags">
          <Select 
            mode="tags" 
            placeholder="Thêm tags..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateFlashCardModal;

