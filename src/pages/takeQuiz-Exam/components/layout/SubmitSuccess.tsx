import React, { useState } from "react";
import { Button, Card, Spin } from "antd";
import {
  CheckCircleOutlined,
  HomeOutlined,
  EyeOutlined,
} from "@ant-design/icons";

interface SubmitSuccessProps {
  examName?: string;
  submittedAt?: string;
  onViewResults?: () => void;
  onBackToDashboard?: () => void;
}

const SubmitSuccess: React.FC<SubmitSuccessProps> = ({
  examName = "Bài thi",
  submittedAt = new Date().toLocaleString("vi-VN"),
  onViewResults,
  onBackToDashboard,
}) => {
  const [isViewingResults, setIsViewingResults] = useState(false);
  const [isGoingHome, setIsGoingHome] = useState(false);

  const handleViewResults = () => {
    setIsViewingResults(true);
    setTimeout(() => {
      onViewResults?.();
    }, 1000);
  };

  return (
    <>
      <div className="p-5 flex flex-col items-center justify-center h-screen">
        <Card className="w-[70%] flex flex-col items-center justify-center">
          <div className="text-center flex flex-col items-center justify-center gap-3">
            <div className="mb-8">
              <p className="text-[24px] text-green-500 mb-4">
                Bạn đã nộp bài thi thành công.
              </p>
              <div className="flex flex-row items-center">
                <span className="text-[24px]">Kết quả :</span>
                <span className="text-[54px] mx-auto">
                  <span>4</span>
                  <span>/10</span>
                </span>
              </div>
              <p className="text-[16px] text-gray-500">
                Thời gian nộp bài: {submittedAt}
              </p>
            </div>

            <div
              className="grid grid-cols-2 
            !gap-[15.25rem] px-4"
            >
              {/* Left Column - Stats */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-normal">
                    Số câu hỏi :
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    40/50
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-normal">
                    Số câu đúng :
                  </span>
                  <span className="text-lg font-semibold text-green-600">
                    40
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-normal">
                    Số câu sai :
                  </span>
                  <span className="text-lg font-semibold text-red-600">10</span>
                </div>
              </div>

              {/* Right Column - Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-normal">bài thi : </span>
                  <span className="text-gray-900 font-semibold">
                    {examName}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-normal">
                    Người làm bài :{" "}
                  </span>
                  <span className="text-gray-900 font-semibold">
                    Super Idol desaurung
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-normal">
                    Thời gian làm bài :{" "}
                  </span>
                  <span className="text-gray-900 font-semibold">
                    20:20:00 / 120:00:00
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              {onViewResults && (
                <Button
                  onClick={handleViewResults}
                  loading={isViewingResults}
                  icon={<EyeOutlined />}
                  className="!bg-[#6392e9] !hover:bg-[#5282d8] text-white rounded-[8px] h-[50px] px-8 text-[18px] font-semibold"
                >
                  {isViewingResults ? "Đang tải..." : "Chi tiết"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default SubmitSuccess;
