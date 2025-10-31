import React from 'react';
import { Button, Card, Tag } from 'antd';
import { ArrowLeftOutlined, PushpinOutlined } from '@ant-design/icons';
import { Note } from '../../types';

interface NoteDetailViewProps {
  note: Note;
  onBack: () => void;
}

const NoteDetailView: React.FC<NoteDetailViewProps> = ({ note, onBack }) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
          Quay lại
        </Button>
        <h3 className="text-lg font-semibold">Chi tiết Note</h3>
      </div>

      <Card
        title={
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">{note.title}</span>
            {note.isPinned && (
              <PushpinOutlined className="text-blue-500 text-xl" />
            )}
          </div>
        }
      >
        <div className="space-y-4">
          <div className="whitespace-pre-wrap text-base leading-relaxed">
            {note.content}
          </div>
          
          {note.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap pt-4 border-t">
              {note.tags.map((tag) => (
                <Tag key={tag} color="blue">
                  {tag}
                </Tag>
              ))}
            </div>
          )}
          
          <div className="text-xs text-gray-400 pt-2">
            Cập nhật: {new Date(note.updatedAt).toLocaleString('vi-VN')}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NoteDetailView;
