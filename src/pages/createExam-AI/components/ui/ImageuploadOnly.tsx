import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import { uploadImageToImgBB } from '../../../../utils/ImageUpload';

interface ImageUploadOnlyProps {
  onImageUploaded?: (imageUrl: string) => void;
}

const ImageUploadOnly: React.FC<ImageUploadOnlyProps> = ({ onImageUploaded }) => {
  const [uploading, setUploading] = useState(false);

  return (
    <Upload
      accept="image/*"
      showUploadList={false}
      beforeUpload={async (file) => {
        // Validate file type - accept all images
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
          message.error('Chỉ hỗ trợ file ảnh!');
          return Upload.LIST_IGNORE;
        }

        // Validate file size (max 10MB)
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
          message.error('File phải nhỏ hơn 10MB!');
          return Upload.LIST_IGNORE;
        }

        setUploading(true);
        try {
          const imageUrl = await uploadImageToImgBB(file);
          message.success('Tải ảnh lên thành công!');
          if (onImageUploaded) {
            onImageUploaded(imageUrl);
          }
        } catch (error) {
          message.error('Tải ảnh lên thất bại. Vui lòng thử lại.');
          console.error('Upload error:', error);
        } finally {
          setUploading(false);
        }
        return false; // Prevent default upload behavior
      }}
    >
      <Button icon={<UploadOutlined />} loading={uploading}>
        {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
      </Button>
    </Upload>
  );
};

export default ImageUploadOnly;