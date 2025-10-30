import React, { useState } from 'react';
import { Modal, Form, Input, Button, Space, Divider } from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';

interface FlashcardItem {
  front: string;
  back: string;
}

interface CreateCardSetWithFlashcardsModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    userId: string;
    name: string;
    description: string;
    flashcards: Array<{ front: string; back: string }>;
  }) => Promise<void>;
  userId: string;
  loading?: boolean;
}

const CreateCardSetWithFlashcardsModal: React.FC<CreateCardSetWithFlashcardsModalProps> = ({
  visible,
  onClose,
  onSubmit,
  userId,
  loading,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit({
        userId,
        name: values.name,
        description: values.description,
        flashcards: values.flashcards,
      });
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
      title="Tạo bộ Flashcard thủ công"
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
          Tạo bộ flashcard
        </Button>,
      ]}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: '16px' }}
        initialValues={{
          flashcards: [{ front: '', back: '' }]
        }}
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
            placeholder="Ví dụ: Từ vựng IELTS Unit 1"
            maxLength={200}
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
            placeholder="Ví dụ: Các từ vựng quan trọng"
            rows={2}
            maxLength={500}
          />
        </Form.Item>

        <Divider>Danh sách Flashcard</Divider>

        <Form.List name="flashcards">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: 'flex', marginBottom: 8 }}
                  align="start"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'front']}
                    rules={[
                      { required: true, message: 'Nhập mặt trước' },
                      { min: 1, message: 'Không được để trống' },
                    ]}
                    style={{ width: '280px', marginBottom: 0 }}
                  >
                    <Input.TextArea
                      placeholder="Mặt trước (Câu hỏi)"
                      rows={2}
                      maxLength={300}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'back']}
                    rules={[
                      { required: true, message: 'Nhập mặt sau' },
                      { min: 1, message: 'Không được để trống' },
                    ]}
                    style={{ width: '280px', marginBottom: 0 }}
                  >
                    <Input.TextArea
                      placeholder="Mặt sau (Câu trả lời)"
                      rows={2}
                      maxLength={300}
                    />
                  </Form.Item>
                  <MinusCircleOutlined
                    onClick={() => remove(name)}
                    style={{ marginTop: '8px', fontSize: '18px', color: '#ff4d4f' }}
                  />
                </Space>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm flashcard
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default CreateCardSetWithFlashcardsModal;

