import React from 'react';
import {  BookOutlined } from '@ant-design/icons';
import { ExamHeaderProps } from '../../types';
import { EXAM_STYLES } from '../../constants';

const ExamHeader: React.FC<ExamHeaderProps> = ({
  examName,
  totalQuestions,
  answeredQuestions
}) => {

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <BookOutlined className="text-[#6392e9]" />
            <span className="text-[20px] text-black font-semibold">{examName}</span>
          </div>
        
        </div>
        
      </div>
      <div className="h-[14px] bg-[#d8e5ff] rounded-[4px] mb-8 overflow-hidden">
        <div 
          className="h-full bg-[#6392e9] rounded-[8px] transition-all duration-300"
          style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ExamHeader;
