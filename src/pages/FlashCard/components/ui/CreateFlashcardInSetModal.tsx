import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface CreateFlashcardInSetModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { front: string; back: string }) => Promise<void>;
  loading?: boolean;
}

const CreateFlashcardInSetModal: React.FC<CreateFlashcardInSetModalProps> = ({
  visible,
  onClose,
  onSubmit,
  loading,
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
      title={
        <span>
          <PlusOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
          Tạo Flashcard Mới
        </span>
      }
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
          Tạo flashcard
        </Button>,
      ]}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: '16px' }}
      >
        <Form.Item
          label="Mặt trước (Câu hỏi)"
          name="front"
          rules={[
            { required: true, message: 'Vui lòng nhập nội dung mặt trước!' },
            { min: 1, message: 'Nội dung không được để trống!' },
          ]}
        >
          <Input.TextArea
            placeholder="Nhập câu hỏi hoặc thuật ngữ..."
            rows={3}
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Mặt sau (Câu trả lời)"
          name="back"
          rules={[
            { required: true, message: 'Vui lòng nhập nội dung mặt sau!' },
            { min: 1, message: 'Nội dung không được để trống!' },
          ]}
        >
          <Input.TextArea
            placeholder="Nhập câu trả lời hoặc định nghĩa..."
            rows={3}
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateFlashcardInSetModal;

