import React, { useState } from "react";
import { Button, Spin } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

interface VerifySuccessProps {
  onContinue?: () => void;
}

const VerifySuccess: React.FC<VerifySuccessProps> = ({ onContinue }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleContinue = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onContinue?.();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-[rgba(83,83,83,0.62)] flex items-center justify-center z-50">
      <div className="bg-white rounded-[18px] w-[600px] h-[400px] relative p-12">
        <div className="text-center h-full flex flex-col justify-center">
          <div className="mb-6">
            <CheckCircleOutlined className="text-[80px] !text-[#52c41a]" />
          </div>

          <h2 className="text-[32px] font-bold text-black mb-4">
            Xác thực thành công!
          </h2>

          <p className="text-[18px] text-gray-600 mb-8">
            Khuôn mặt của bạn đã được xác thực thành công. Bạn có thể bắt đầu
            làm bài thi.
          </p>

          <Button
            onClick={handleContinue}
            loading={isTransitioning}
            className="!bg-[#52c41a] !hover:bg-[#45a049] !text-white rounded-[8px] h-[50px] px-12 text-[20px] font-semibold"
          >
            {isTransitioning ? 'Đang chuyển tiếp...' : 'Tiếp tục'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export { VerifySuccess };
