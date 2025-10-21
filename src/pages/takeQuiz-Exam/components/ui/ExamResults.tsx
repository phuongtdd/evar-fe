import React from 'react';
import { Button, Progress, Card } from 'antd';
import { TrophyOutlined, ReloadOutlined, HomeOutlined } from '@ant-design/icons';
import { ExamResultsProps } from '../../types';
import { EXAM_STYLES } from '../../constants';

const ExamResults: React.FC<ExamResultsProps> = ({
  results,
  onRetake,
  onBackToDashboard
}) => {
  const scorePercentage = Math.round((results.correctAnswers / results.totalQuestions) * 100);
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Xuất sắc';
    if (score >= 60) return 'Khá';
    return 'Cần cải thiện';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <div className="text-center">
          {/* Trophy Icon */}
          <div className="mb-6">
            <TrophyOutlined 
              className="text-[80px]" 
              style={{ color: getScoreColor(scorePercentage) }}
            />
          </div>

          {/* Title */}
          <h1 className="text-[32px] font-bold text-black mb-2">
            Kết quả bài thi
          </h1>
          
          {/* Score */}
          <div className="mb-8">
            <div className="text-[48px] font-bold mb-2" style={{ color: getScoreColor(scorePercentage) }}>
              {scorePercentage}%
            </div>
            <div className="text-[20px] text-gray-600 mb-4">
              {getScoreText(scorePercentage)}
            </div>
            
            <Progress
              percent={scorePercentage}
              strokeColor={getScoreColor(scorePercentage)}
              trailColor="#f0f0f0"
              strokeWidth={8}
              className="max-w-md mx-auto"
            />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-[#f8f9ff] rounded-[12px] p-4">
              <div className="text-[24px] font-bold text-[#6392e9]">
                {results.correctAnswers}/{results.totalQuestions}
              </div>
              <div className="text-[16px] text-gray-600">Câu đúng</div>
            </div>
            
            <div className="bg-[#f8f9ff] rounded-[12px] p-4">
              <div className="text-[24px] font-bold text-[#6392e9]">
                {formatTime(results.timeSpent)}
              </div>
              <div className="text-[16px] text-gray-600">Thời gian làm bài</div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-[#f8f9ff] rounded-[12px] p-6 mb-8">
            <h3 className="text-[20px] font-semibold text-black mb-4">Chi tiết kết quả</h3>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng số câu hỏi:</span>
                <span className="font-semibold">{results.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Câu đã trả lời:</span>
                <span className="font-semibold">{results.answeredQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Câu trả lời đúng:</span>
                <span className="font-semibold text-green-600">{results.correctAnswers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Câu trả lời sai:</span>
                <span className="font-semibold text-red-600">
                  {results.answeredQuestions - results.correctAnswers}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={onBackToDashboard}
              icon={<HomeOutlined />}
              className="!bg-gray-500 !hover:bg-gray-600 text-white rounded-[8px] h-[50px] px-8 text-[18px]"
            >
              Về trang chủ
            </Button>
            <Button
              onClick={onRetake}
              icon={<ReloadOutlined />}
              className="!bg-[#6392e9] !hover:bg-[#5282d8] text-white rounded-[8px] h-[50px] px-8 text-[18px] font-semibold"
            >
              Làm lại
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExamResults;
