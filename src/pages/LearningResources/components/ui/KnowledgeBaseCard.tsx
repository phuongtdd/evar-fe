import React from 'react';
import { Card, Tag, Button, Dropdown, Space } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  FileImageOutlined,
} from '@ant-design/icons';
import { KnowledgeBase } from '../../types';
import type { MenuProps } from 'antd';

interface KnowledgeBaseCardProps {
  knowledgeBase: KnowledgeBase;
  onEdit: (kb: KnowledgeBase) => void;
  onDelete: (id: string) => void;
  onClick: (kb: KnowledgeBase) => void;
}

const KnowledgeBaseCard: React.FC<KnowledgeBaseCardProps> = ({
  knowledgeBase,
  onEdit,
  onDelete,
  onClick,
}) => {
  const items: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Chỉnh sửa',
      icon: <EditOutlined />,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        onEdit(knowledgeBase);
      },
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: (e) => {
        e.domEvent.stopPropagation();
        onDelete(knowledgeBase.id);
      },
    },
  ];

  return (
    <Card
      hoverable
      className="h-full"
      onClick={() => onClick(knowledgeBase)}
      style={{
        borderLeft: `4px solid ${knowledgeBase.color || '#3b82f6'}`,
      }}
      extra={
        <Dropdown menu={{ items }} trigger={['click']}>
          <Button
            type="text"
            icon={<MoreOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      }
    >
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-semibold mb-2">{knowledgeBase.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {knowledgeBase.description}
          </p>
        </div>

        <div className="flex gap-2">
          <Tag color="blue">{knowledgeBase.subject}</Tag>
          <Tag color="green">Lớp {knowledgeBase.grade}</Tag>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <Space size="large">
            <div className="flex items-center gap-1 text-gray-600">
              <CreditCardOutlined />
              <span className="text-sm">{knowledgeBase.flashcardCount}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <FileTextOutlined />
              <span className="text-sm">{knowledgeBase.noteCount}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <FileImageOutlined />
              <span className="text-sm">{knowledgeBase.keynoteCount}</span>
            </div>
          </Space>
        </div>

        <div className="text-xs text-gray-400">
          Tạo bởi {knowledgeBase.createdBy} • {new Date(knowledgeBase.createdAt).toLocaleDateString('vi-VN')}
        </div>
      </div>
    </Card>
  );
};

export default KnowledgeBaseCard;
