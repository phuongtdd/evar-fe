import React, { useState } from 'react';
import { Modal, Upload, message, Button, Space } from 'antd';
import { InboxOutlined, PictureOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { generateFlashcardFromImage } from '../../services/ocrService';

const { Dragger } = Upload;

interface GenerateFromImageModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const GenerateFromImageModal: React.FC<GenerateFromImageModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'image/*',
    fileList,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ chấp nhận file ảnh!');
        return false;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('Ảnh phải nhỏ hơn 10MB!');
        return false;
      }

      // Lưu file gốc vào state
      setSelectedFile(file);
      
      // Tạo UploadFile object để hiển thị
      const uploadFile: UploadFile = {
        uid: file.uid || Date.now().toString(),
        name: file.name,
        status: 'done',
        originFileObj: file,
      };
      setFileList([uploadFile]);
      
      return false; // Prevent auto upload
    },
    onRemove: () => {
      setFileList([]);
      setSelectedFile(null);
    },
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      message.warning('Vui lòng chọn ảnh!');
      return;
    }

    try {
      setUploading(true);
      const result = await generateFlashcardFromImage(selectedFile);
      
      message.success({
        content: `Tạo thành công ${result.totalCards} flashcard từ ảnh!`,
        duration: 3,
      });

      // Reset and close
      setFileList([]);
      setSelectedFile(null);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Tạo flashcard từ ảnh thất bại';
      message.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    if (!uploading) {
      setFileList([]);
      setSelectedFile(null);
      onClose();
    }
  };

  return (
    <Modal
      title={
        <Space>
          <PictureOutlined style={{ color: '#1890ff' }} />
          <span>Tạo Flashcard từ Ảnh</span>
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel} disabled={uploading}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={uploading}
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          {uploading ? 'Đang xử lý...' : 'Tạo Flashcard'}
        </Button>,
      ]}
      width={600}
      destroyOnClose
    >
      <div style={{ marginTop: '16px' }}>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: '#1890ff', fontSize: '48px' }} />
          </p>
          <p className="ant-upload-text">Click hoặc kéo thả ảnh vào đây</p>
          <p className="ant-upload-hint">
            Hỗ trợ: JPG, PNG, JPEG. Kích thước tối đa 10MB.
          </p>
          <p className="ant-upload-hint" style={{ color: '#52c41a', marginTop: '8px' }}>
            Hệ thống sẽ tự động OCR nội dung và tạo flashcard
          </p>
        </Dragger>

        {fileList.length > 0 && (
          <div style={{ marginTop: '16px', padding: '12px', background: '#f0f2f5', borderRadius: '8px' }}>
            <p style={{ margin: 0, color: '#52c41a' }}>
              ✓ Đã chọn: <strong>{fileList[0].name}</strong>
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GenerateFromImageModal;

