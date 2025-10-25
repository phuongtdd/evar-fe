import React from 'react';
import { Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

interface VerifyFailedProps {
  onRetry?: () => void;
  onCancel?: () => void;
}

const VerifyFailed: React.FC<VerifyFailedProps> = ({ onRetry, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-[rgba(83,83,83,0.62)] flex items-center justify-center z-50">
      <div className="bg-white rounded-[18px] w-[600px] h-[400px] relative p-12">
        <div className="text-center h-full flex flex-col justify-center">
          <div className="mb-6">
            <CloseCircleOutlined className="text-[80px] text-[#ff4d4f]" />
          </div>

          <h2 className="text-[32px] font-bold text-black mb-4">
            Xác thực thất bại!
          </h2>

          <p className="text-[18px] text-gray-600 mb-8">
            Không thể xác thực khuôn mặt của bạn. Vui lòng kiểm tra lại camera và thử lại.
          </p>

          <div className="flex justify-center gap-4">
            {onCancel && (
              <Button
                onClick={onCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-[8px] h-[50px] px-8 text-[18px]"
              >
                Hủy
              </Button>
            )}
            {onRetry && (
              <Button
                onClick={onRetry}
                className="bg-[#ff4d4f] hover:bg-[#e02900] text-white rounded-[8px] h-[50px] px-8 text-[18px] font-semibold"
              >
                Thử lại
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { VerifyFailed };