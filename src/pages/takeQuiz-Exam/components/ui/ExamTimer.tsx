import React, { useState, useEffect } from 'react';
import { Badge, Button } from 'antd';
import { ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { ExamTimerProps } from '../../types';
import { EXAM_CONSTANTS } from '../../constants';

const ExamTimer: React.FC<ExamTimerProps> = ({ timeLeft, onTimeUp, subjectName }) => {
  const [displayTime, setDisplayTime] = useState('');
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      if (timeLeft <= 0) {
        setDisplayTime('00:00:00');
        onTimeUp();
        return;
      }

      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      const seconds = timeLeft % 60;

      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

      setDisplayTime(formattedTime);

      setIsWarning(timeLeft <= EXAM_CONSTANTS.WARNING_TIME_THRESHOLD);
      setIsCritical(timeLeft <= EXAM_CONSTANTS.CRITICAL_TIME_THRESHOLD);
    };

    updateTimer();
    const interval = setInterval(updateTimer, EXAM_CONSTANTS.TIMER_INTERVAL);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  const getTimerColor = () => {
    if (isCritical) return 'text-[#ff4d4f]';
    if (isWarning) return 'text-[#faad14]';
    return 'text-[#6392e9]';
  };

  const getTimerBgColor = () => {
    if (isCritical) return 'bg-[#fff2f0] border-[#ff4d4f]';
    if (isWarning) return 'bg-[#fffbe6] border-[#faad14]';
    return 'bg-white border-[#d5d5d5]';
  };

  return (
    <div className={`${getTimerBgColor()} rounded-[12px] border p-4 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClockCircleOutlined className={`text-[20px] ${getTimerColor()}`} />
          <span className="text-[14px] text-black font-semibold">Thời gian còn lại:</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-[24px] font-bold ${getTimerColor()}`}>
            {displayTime}
          </span>
        
          {isCritical && (
            <ExclamationCircleOutlined className="text-[#ff4d4f] text-[20px]" />
          )}
        </div>
      </div>
      
      {isWarning && (
        <div className="mt-2 text-center">
          <span className={`text-[14px] font-semibold ${getTimerColor()}`}>
            {isCritical ? 'Thời gian sắp hết!' : 'Còn 5 phút nữa!'}
          </span>
        </div>
      )}
        <div className="w-full flex flex-row item-center justify-between">
          <span className="text-[14px] text-black font-semibold">Tên môn học: </span>
          <Badge className="bg-[#6392e9] text-white text-[16px] px-4 py-1 rounded-[8px]">
            {subjectName}
          </Badge> 
        </div>
    </div>
  );
};

export default ExamTimer;
