import React, { useState } from 'react';
import { Button, Card, Spin } from 'antd';
import { CheckCircleOutlined, HomeOutlined, EyeOutlined } from '@ant-design/icons';

interface SubmitSuccessProps {
  examName?: string;
  submittedAt?: string;
  onViewResults?: () => void;
  onBackToDashboard?: () => void;
}

const SubmitSuccess: React.FC<SubmitSuccessProps> = ({
  examName = "Bài thi",
  submittedAt = new Date().toLocaleString('vi-VN'),
  onViewResults,
  onBackToDashboard
}) => {
  const [isViewingResults, setIsViewingResults] = useState(false);
  const [isGoingHome, setIsGoingHome] = useState(false);

  const handleViewResults = () => {
    setIsViewingResults(true);
    setTimeout(() => {
      onViewResults?.();
    }, 1000);
  };

  const handleBackToDashboard = () => {
    setIsGoingHome(true);
    setTimeout(() => {
      onBackToDashboard?.();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <div className="text-center">
          <div className="mb-6">
            <CheckCircleOutlined 
              className="text-[80px] text-green-500"
            />
          </div>

          <h1 className="text-[32px] font-bold text-black mb-4">
            Nộp bài thành công!
          </h1>
          
          <div className="mb-8">
            <p className="text-[18px] text-gray-600 mb-4">
              Bạn đã nộp bài thi <strong>"{examName}"</strong> thành công.
            </p>
            <p className="text-[16px] text-gray-500">
              Thời gian nộp bài: {submittedAt}
            </p>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircleOutlined className="text-2xl text-green-500" />
            </div>
            <p className="text-[16px] text-green-600 font-medium">
              Bài thi của bạn đã được ghi nhận và đang được chấm điểm.
            </p>
          </div>

          <div className="bg-[#f0f9ff] border border-[#0ea5e9] rounded-[12px] p-4 mb-8">
            <div className="flex items-center gap-2 mb-2">
              <EyeOutlined className="text-[#0ea5e9]" />
              <span className="text-[16px] font-semibold text-[#0ea5e9]">
                Thông tin tiếp theo:
              </span>
            </div>
            <ul className="text-[14px] text-gray-600 space-y-1 text-left">
              <li>• Kết quả sẽ được hiển thị ngay lập tức</li>
              <li>• Bạn có thể xem lại chi tiết các câu trả lời</li>
              <li>• Kết quả sẽ được lưu vào lịch sử thi của bạn</li>
              <li>• Bạn có thể làm lại bài thi nếu muốn</li>
            </ul>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={handleBackToDashboard}
              loading={isGoingHome}
              icon={<HomeOutlined />}
              className="!bg-gray-500 !hover:bg-gray-600 !text-white rounded-[8px] h-[50px] px-8 text-[18px]"
            >
              {isGoingHome ? 'Đang chuyển...' : 'Về trang chủ'}
            </Button>
            {onViewResults && (
              <Button
                onClick={handleViewResults}
                loading={isViewingResults}
                icon={<EyeOutlined />}
                className="!bg-[#6392e9] !hover:bg-[#5282d8] text-white rounded-[8px] h-[50px] px-8 text-[18px] font-semibold"
              >
                {isViewingResults ? 'Đang tải...' : 'Xem kết quả'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SubmitSuccess;
