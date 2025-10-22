import React from 'react';
import '../styles/StatsCard.css';

const StatsCard: React.FC = () => {
  return (
    <div className="stats-card">
      <div className="stat-section">
        <div className="stat-label">Điểm trung bình</div>
        <div className="stat-value score">9</div>
      </div>
      <div className="vr mx-2 d-none d-md-block"></div>
      <div className="stat-section">
        <div className="stat-label">Đã học</div>
        <div className="stat-value time">180 phút</div>
      </div>
    </div>
  );
};

export default StatsCard;
