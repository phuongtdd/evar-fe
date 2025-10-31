import React, { useState } from 'react';
import { Button, Empty, Modal } from 'antd';
import { FilePdfOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';

interface PDFManagerProps {
  knowledgeBaseId: string;
  fileUrl?: string;
  fileName?: string;
}

const PDFManager: React.FC<PDFManagerProps> = ({ knowledgeBaseId, fileUrl, fileName }) => {
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const handlePreview = () => {
    if (fileUrl) {
      setIsPreviewVisible(true);
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  if (!fileUrl) {
    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Tài liệu PDF</h3>
        </div>
        <Empty description="Không có file PDF" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Tài liệu PDF</h3>
        <div className="flex gap-2">
          <Button icon={<EyeOutlined />} onClick={handlePreview}>
            Xem trước
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleDownload}>
            Tải xuống
          </Button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <div className="flex items-center gap-4">
          <FilePdfOutlined className="text-6xl text-red-500" />
          <div>
            <h4 className="text-lg font-semibold mb-1">{fileName || 'Document.pdf'}</h4>
            <p className="text-gray-600 text-sm">File PDF gốc của knowledge base</p>
            <div className="mt-3 flex gap-2">
              <Button type="primary" icon={<EyeOutlined />} onClick={handlePreview}>
                Xem trước
              </Button>
              <Button icon={<DownloadOutlined />} onClick={handleDownload}>
                Tải xuống
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      <Modal
        title={`Xem trước: ${fileName || 'Document.pdf'}`}
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        width="90%"
        style={{ top: 20 }}
        footer={[
          <Button key="download" icon={<DownloadOutlined />} onClick={handleDownload}>
            Tải xuống
          </Button>,
          <Button key="close" onClick={() => setIsPreviewVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        <div style={{ height: '80vh' }}>
          <iframe
            src={fileUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            title="PDF Preview"
          />
        </div>
      </Modal>
    </div>
  );
};

export default PDFManager;
