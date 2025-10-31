import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import type { CardSet } from '../../types/cardSet';

interface EditCardSetModalProps {
  visible: boolean;
  cardSet: CardSet | null;
  onClose: () => void;
  onSubmit: (data: { id: string; name: string; description: string }) => Promise<void>;
  loading?: boolean;
}

const EditCardSetModal: React.FC<EditCardSetModalProps> = ({
  visible,
  cardSet,
  onClose,
  onSubmit,
  loading,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && cardSet) {
      form.setFieldsValue({
        name: cardSet.name,
        description: cardSet.description,
      });
    }
  }, [visible, cardSet, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (cardSet) {
        await onSubmit({
          id: cardSet.id,
          name: values.name,
          description: values.description,
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
          Chỉnh sửa Bộ Flashcard
        </span>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={loading}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit} loading={loading}>
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
          label="Tên bộ flashcard"
          name="name"
          rules={[
            { required: true, message: 'Vui lòng nhập tên bộ flashcard!' },
            { min: 1, message: 'Tên không được để trống!' },
          ]}
        >
          <Input
            placeholder="Nhập tên bộ flashcard..."
            maxLength={100}
            showCount
          />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { required: true, message: 'Vui lòng nhập mô tả!' },
            { min: 1, message: 'Mô tả không được để trống!' },
          ]}
        >
          <Input.TextArea
            placeholder="Nhập mô tả cho bộ flashcard..."
            rows={3}
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCardSetModal;

