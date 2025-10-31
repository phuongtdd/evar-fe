import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, Checkbox, Space, InputNumber, Upload, Image, message } from 'antd';
import { PlusOutlined, MinusCircleOutlined, CameraOutlined, DeleteOutlined } from '@ant-design/icons';
import { Question, Answer } from '../../types';
import MathContent from './MathContent';
import { uploadImageToImgBB } from '../../../../utils/ImageUpload';

interface EditQuestionModalProps {
  visible: boolean;
  question: Question | null;
  onSave: (question: Question) => void;
  onCancel: () => void;
}

const { TextArea } = Input;

const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  visible,
  question,
  onSave,
  onCancel,
}) => {
  const [form] = Form.useForm();
  const [previewContent, setPreviewContent] = useState('');
  const [previewAnswers, setPreviewAnswers] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (visible && question) {
      form.setFieldsValue({
        content: question.content,
        questionType: question.questionType,
        hardLevel: question.hardLevel,
        quesScore: question.quesScore || 1.0,
        answers: question.answers,
      });
      setPreviewContent(question.content);
      setPreviewAnswers(question.answers.map(a => a.content));
      setUploadedImage(question.questionImg || question.imageSrc || null);
    }
  }, [visible, question, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (!question) return;

      const updatedQuestion: Question = {
        ...question,
        content: values.content,
        questionType: values.questionType,
        hardLevel: values.hardLevel,
        quesScore: values.quesScore,
        answers: values.answers,
        questionImg: uploadedImage || undefined,
        imageSrc: uploadedImage || undefined,
        hasImage: !!uploadedImage,
      };

      onSave(updatedQuestion);
      form.resetFields();
    });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPreviewContent(e.target.value);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newPreviews = [...previewAnswers];
    newPreviews[index] = value;
    setPreviewAnswers(newPreviews);
  };

  return (
    <Modal
      title={<h3 className="text-xl font-bold">Chỉnh Sửa Câu Hỏi</h3>}
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Lưu Thay Đổi
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
      >
        {/* Question Content */}
        <Form.Item
          label={<span className="font-semibold">Nội dung câu hỏi</span>}
          name="content"
          rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}
        >
          <TextArea
            rows={4}
            placeholder="Nhập nội dung câu hỏi (hỗ trợ LaTeX: $...$ hoặc $$...$$)"
            onChange={handleContentChange}
          />
        </Form.Item>

        {/* Preview */}
        {previewContent && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm font-semibold text-gray-600 mb-2">Preview:</p>
            <MathContent content={previewContent} className="text-gray-800" />
          </div>
        )}

        {/* Question Settings */}
        <div className="grid grid-cols-3 gap-4">
          <Form.Item
            label={<span className="font-semibold">Loại câu hỏi</span>}
            name="questionType"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="SINGLE_CHOICE">Trắc nghiệm 1 đáp án</Select.Option>
              <Select.Option value="MULTIPLE_CHOICE">Trắc nghiệm nhiều đáp án</Select.Option>
              <Select.Option value="TRUE_FALSE">Đúng/Sai</Select.Option>
              <Select.Option value="ESSAY">Tự luận</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold">Độ khó</span>}
            name="hardLevel"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value={1}>Dễ</Select.Option>
              <Select.Option value={2}>Trung bình</Select.Option>
              <Select.Option value={3}>Khó</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<span className="font-semibold">Điểm</span>}
            name="quesScore"
            rules={[{ required: true }]}
          >
            <InputNumber min={0.5} max={10} step={0.5} className="w-full" />
          </Form.Item>
        </div>

        {/* Answers */}
        <Form.List name="answers">
          {(fields, { add, remove }) => (
            <>
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold">Đáp án</span>
                <Button
                  type="dashed"
                  onClick={() => add({ content: '', isCorrect: false })}
                  icon={<PlusOutlined />}
                >
                  Thêm đáp án
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.key} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-gray-700 mt-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    
                    <div className="flex-1">
                      <Form.Item
                        {...field}
                        name={[field.name, 'content']}
                        rules={[{ required: true, message: 'Nhập nội dung đáp án' }]}
                        className="mb-2"
                      >
                        <TextArea
                          rows={2}
                          placeholder="Nhập đáp án (hỗ trợ LaTeX)"
                          onChange={(e) => handleAnswerChange(index, e.target.value)}
                        />
                      </Form.Item>

                      {/* Preview Answer */}
                      {previewAnswers[index] && (
                        <div className="mb-2 p-2 bg-white rounded border border-gray-200">
                          <MathContent content={previewAnswers[index]} className="text-sm text-gray-700" />
                        </div>
                      )}

                      <Form.Item
                        {...field}
                        name={[field.name, 'isCorrect']}
                        valuePropName="checked"
                        className="mb-0"
                      >
                        <Checkbox>
                          <span className="text-green-600 font-semibold">Đáp án đúng</span>
                        </Checkbox>
                      </Form.Item>
                    </div>

                    {fields.length > 1 && (
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(field.name)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </Form.List>

        {/* Image Upload Section */}
        <div className="mt-6">
          <span className="font-semibold mb-3 block">Hình ảnh câu hỏi</span>
          {uploadedImage ? (
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Image
                src={uploadedImage}
                alt="Question image"
                width={200}
                height={200}
                className="rounded"
              />
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => setUploadedImage(null)}
              >
                Xóa ảnh
              </Button>
            </div>
          ) : (
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={async (file) => {
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('Chỉ hỗ trợ file ảnh!');
                  return Upload.LIST_IGNORE;
                }

                const isLt10M = file.size / 1024 / 1024 < 10;
                if (!isLt10M) {
                  message.error('File phải nhỏ hơn 10MB!');
                  return Upload.LIST_IGNORE;
                }

                setUploading(true);
                try {
                  const imageUrl = await uploadImageToImgBB(file);
                  setUploadedImage(imageUrl);
                  message.success('Tải ảnh lên thành công!');
                } catch (error) {
                  message.error('Tải ảnh lên thất bại. Vui lòng thử lại.');
                  console.error('Upload error:', error);
                } finally {
                  setUploading(false);
                }
                return false;
              }}
            >
              <Button icon={<CameraOutlined />} loading={uploading} className="w-full">
                {uploading ? 'Đang tải...' : 'Thêm ảnh'}
              </Button>
            </Upload>
          )}
        </div>
      </Form>
    </Modal>
  );
};

export default EditQuestionModal;
