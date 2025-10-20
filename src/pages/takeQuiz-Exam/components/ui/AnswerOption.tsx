import React from 'react';
import { Button } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import { AnswerOptionProps } from '../../types';
import { EXAM_STYLES } from '../../constants';

const AnswerOption: React.FC<AnswerOptionProps> = ({
  answer,
  index,
  isSelected,
  onSelect
}) => {
  const letter = String.fromCharCode(65 + index);

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-3 py-1 !rounded-[12px] border-2 transition-all duration-200 ${
        isSelected
          ? '!bg-[#6392e9] border-[#6392e9] text-white shadow-md'
          : 'border-[#c4c4c4] hover:border-[#6392e9] hover:bg-[#f8f9ff]'
      }`}
    >
      <div className="flex items-center">
        <span className={`font-bold mr-4 text-[20px] ${
          isSelected ? 'text-white' : 'text-black'
        }`}>
          {letter}.
        </span>
        <span className={`text-[18px] leading-relaxed ${
          isSelected ? 'text-white' : 'text-black'
        }`}>
          {answer.content}
        </span>
      </div>
    </button>
  );
};

export default AnswerOption;
