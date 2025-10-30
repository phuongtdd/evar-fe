import React, { useState } from 'react';
import { Card, Dropdown, Button } from 'antd';
import { EditOutlined, DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import type { FlashCard } from '../../types/cardSet';

interface SimpleFlashCardProps {
  card: FlashCard;
  onEdit?: (card: FlashCard) => void;
  onDelete?: (id: string) => void;
}

const SimpleFlashCard: React.FC<SimpleFlashCardProps> = ({ card, onEdit, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = (e: React.MouseEvent) => {
    // Prevent flip when clicking on dropdown
    if ((e.target as HTMLElement).closest('.ant-dropdown-trigger')) {
      return;
    }
    setIsFlipped(!isFlipped);
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <EditOutlined />,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        onEdit?.(card);
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
        onDelete?.(card.id);
      },
    },
  ];

  return (
    <div
      style={{
        perspective: '1000px',
        height: '200px',
        width: '100%',
      }}
      onClick={handleFlip}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.3s',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          cursor: 'pointer',
        }}
      >
        {/* Front Side */}
        <Card
          size="small"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            border: '3px solid #1890ff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          bodyStyle={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '8px',
          }}
        >
          {/* Dropdown Menu */}
          {(onEdit || onDelete) && (
            <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10 }}>
              <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                <Button
                  type="text"
                  icon={<MoreOutlined />}
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                  className="ant-dropdown-trigger"
                />
              </Dropdown>
            </div>
          )}

          {/* Card Content */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px',
            }}
          >
            <div
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#262626',
                textAlign: 'center',
                wordBreak: 'break-word',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 5,
                WebkitBoxOrient: 'vertical',
              }}
              dangerouslySetInnerHTML={{ __html: card.front }}
            />
          </div>
        </Card>

        {/* Back Side */}
        <Card
          size="small"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            border: '3px solid #52c41a',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(82, 196, 26, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f5fffa 0%, #e6fffb 100%)',
          }}
          bodyStyle={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '15px',
              fontWeight: 500,
              color: '#262626',
              textAlign: 'center',
              wordBreak: 'break-word',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 5,
              WebkitBoxOrient: 'vertical',
            }}
            dangerouslySetInnerHTML={{ __html: card.back }}
          />
        </Card>
      </div>
    </div>
  );
};

export default SimpleFlashCard;

