import React from 'react';
import { Card, Tag, Dropdown, Progress, Button } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { FlashCard } from '../../types';
import { DIFFICULTY_LABELS, DIFFICULTY_COLORS } from '../../constants';
import { getMasteryLevelInfo, formatDate } from '../../utils';

interface FlashCardItemProps {
  card: FlashCard;
  onEdit: (card: FlashCard) => void;
  onDelete: (id: string) => void;
}

const FlashCardItem: React.FC<FlashCardItemProps> = ({ card, onEdit, onDelete }) => {
  const masteryInfo = getMasteryLevelInfo(card.masteryLevel || 0);

  const menuItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <EditOutlined />,
      onClick: () => onEdit(card),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => onDelete(card.id),
    },
  ];

  // Border color based on difficulty
  const getBorderColor = () => {
    switch (card.difficulty) {
      case 'easy':
        return '#52c41a'; // Green
      case 'medium':
        return '#faad14'; // Orange
      case 'hard':
        return '#ff4d4f'; // Red
      default:
        return '#d9d9d9';
    }
  };

  return (
    <Card 
      size="small" 
      style={{ 
        height: '180px', 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `3px solid ${getBorderColor()}`,
        borderRadius: '8px',
        boxShadow: `0 4px 12px ${getBorderColor()}40`,
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      bodyStyle={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px'
      }}
      hoverable
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 6px 20px ${getBorderColor()}60`;
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = `0 4px 12px ${getBorderColor()}40`;
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {card.difficulty && (
            <Tag 
              color={card.difficulty === 'easy' ? 'green' : card.difficulty === 'medium' ? 'orange' : 'red'}
              className="font-medium"
            >
              {DIFFICULTY_LABELS[card.difficulty]}
            </Tag>
          )}
          {card.category && (
            <span className="text-sm text-gray-600 truncate" style={{ maxWidth: '80px' }}>
              {card.category}
            </span>
          )}
        </div>
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} size="small" />
        </Dropdown>
      </div>

      <div className="mb-3 flex-1" style={{ overflow: 'hidden' }}>
        <div 
          className="text-base font-semibold text-gray-900" 
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '1.5'
          }}
        >
          {card.front}
        </div>
      </div>

      <div className="space-y-1 pt-2 border-t">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Mức độ thành thạo:</span>
          <Tag color={masteryInfo.color} className="text-xs">{masteryInfo.label}</Tag>
        </div>
        <Progress 
          percent={card.masteryLevel || 0} 
          strokeColor={masteryInfo.color === 'green' ? '#52c41a' : 
                      masteryInfo.color === 'blue' ? '#1890ff' :
                      masteryInfo.color === 'orange' ? '#fa8c16' : '#ff4d4f'}
          size="small"
        />
        <div className="flex justify-between text-xs text-gray-400 pt-1">
          <span>Đã ôn: {card.reviewCount || 0} lần</span>
          <span>{formatDate(card.createdAt)}</span>
        </div>
      </div>
    </Card>
  );
};

export default FlashCardItem;

