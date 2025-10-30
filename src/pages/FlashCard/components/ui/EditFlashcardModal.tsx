import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { FlashCard } from '../../types/cardSet';

interface EditFlashcardModalProps {
  visible: boolean;
  flashcard: FlashCard | null;
  onClose: () => void;
  onSubmit: (data: { id: string; front: string; back: string }) => Promise<void>;
}

const EditFlashcardModal: React.FC<EditFlashcardModalProps> = ({
  visible,
  flashcard,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && flashcard) {
      form.setFieldsValue({
        front: flashcard.front,
        back: flashcard.back,
      });
    }
  }, [visible, flashcard, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (flashcard) {
        await onSubmit({
          id: flashcard.id,
          front: values.front,
          back: values.back,
        });
        form.resetFields();
        onClose();
      }
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
          <EditOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
          Chỉnh sửa Flashcard
        </span>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Lưu
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
          label="Mặt trước (Front)"
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
          label="Mặt sau (Back)"
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

export default EditFlashcardModal;


