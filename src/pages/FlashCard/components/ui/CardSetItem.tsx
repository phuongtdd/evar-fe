import React from 'react';
import { Card, Tag, Dropdown, Button } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  BookOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { CardSet } from '../../types';
import { formatDate } from '../../utils';

interface CardSetItemProps {
  cardSet: CardSet;
  onEdit: (cardSet: CardSet) => void;
  onDelete: (id: string) => void;
  onClick: (cardSet: CardSet) => void;
}

const CardSetItem: React.FC<CardSetItemProps> = ({ cardSet, onEdit, onDelete, onClick }) => {
  const menuItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <EditOutlined />,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        onEdit(cardSet);
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        onDelete(cardSet.id);
      },
    },
  ];

  const handleCardClick = () => {
    onClick(cardSet);
  };

  return (
    <Card
      size="small"
      style={{
        height: '200px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: '3px solid #1890ff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(24, 144, 255, 0.2)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
      bodyStyle={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
      }}
      hoverable
      onClick={handleCardClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(24, 144, 255, 0.35)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(24, 144, 255, 0.2)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag color="blue" className="font-medium">
            <BookOutlined /> {cardSet.totalCards} thẻ
          </Tag>
        </div>
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <Button
            type="text"
            icon={<MoreOutlined />}
            size="small"
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      </div>

      <div className="mb-4 flex-1" style={{ overflow: 'hidden' }}>
        <div
          className="text-base font-semibold text-gray-900 mb-3"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '1.5',
          }}
        >
          {cardSet.name}
        </div>
        <div
          className="text-sm text-gray-600"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            lineHeight: '1.4',
          }}
        >
          {cardSet.description || 'Không có mô tả'}
        </div>
      </div>

      <div className="pt-3 border-t">
        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>
            <CalendarOutlined /> {formatDate(cardSet.createdAt)}
          </span>
          {cardSet.knowledgeBaseId && (
            <Tag color="green" className="text-xs">
              Có KB
            </Tag>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CardSetItem;

