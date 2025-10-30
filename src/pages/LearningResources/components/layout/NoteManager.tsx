import React, { useState, useEffect } from 'react';
import { Button, Card, Empty, message, Spin } from 'antd';
import { EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { Note } from '../../types';
import { noteService } from '../../services/learningResourcesService';
import NoteDetailView from './NoteDetailView';

interface NoteManagerProps {
  knowledgeBaseId: string;
}

const NoteManager: React.FC<NoteManagerProps> = ({ knowledgeBaseId }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [knowledgeBaseId]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await noteService.getNotesByKnowledgeBaseId(knowledgeBaseId);
      setNotes(data);
      console.log('✅ Loaded', data.length, 'notes for KB', knowledgeBaseId);
    } catch (error) {
      console.error('❌ Failed to load notes:', error);
      message.error('Không thể tải notes');
    } finally {
      setLoading(false);
    }
  };

  if (showDetail && notes.length > 0) {
    return (
      <NoteDetailView
        note={notes[0]}
        onBack={() => setShowDetail(false)}
      />
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-4">Quản lý Notes</h3>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" tip="Đang tải notes..." />
        </div>
      ) : notes.length === 0 ? (
        <Empty description="Chưa có note nào" />
      ) : (
        <Card
          hoverable
          className="max-w-md"
          cover={
            <div className="h-40 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <FileTextOutlined className="text-6xl text-white" />
            </div>
          }
        >
          <div className="space-y-3">
            <div>
              <div className="font-semibold text-lg mb-1">{notes[0].title}</div>
              <div className="text-sm text-gray-600">
                User Note
              </div>
            </div>
            <div className="text-sm text-gray-700 line-clamp-3">
              {notes[0].content}
            </div>
            <Button 
              type="primary" 
              icon={<EyeOutlined />} 
              onClick={() => setShowDetail(true)}
              block
            >
              Xem chi tiết
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default NoteManager;
