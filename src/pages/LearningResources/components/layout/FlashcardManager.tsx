import React, { useState, useEffect } from 'react';
import { Button, Card, Empty, message, Spin } from 'antd';
import { EyeOutlined, CreditCardOutlined } from '@ant-design/icons';
import { Flashcard } from '../../types';
import { flashcardService } from '../../services/learningResourcesService';
import FlashcardDetailView from './FlashcardDetailView';

interface FlashcardManagerProps {
  knowledgeBaseId: string;
}

const FlashcardManager: React.FC<FlashcardManagerProps> = ({ knowledgeBaseId }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [cardSetId, setCardSetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    loadFlashcards();
  }, [knowledgeBaseId]);

  const loadFlashcards = async () => {
    setLoading(true);
    try {
      const { flashcards: data, cardSetId: setId } = await flashcardService.getFlashcardsByKnowledgeBaseId(knowledgeBaseId);
      setFlashcards(data);
      setCardSetId(setId);
      console.log('✅ Loaded', data.length, 'flashcards for KB', knowledgeBaseId, 'from set', setId);
    } catch (error) {
      console.error('❌ Failed to load flashcards:', error);
      message.error('Không thể tải flashcards');
    } finally {
      setLoading(false);
    }
  };

  if (showDetail && cardSetId) {
    return (
      <FlashcardDetailView
        flashcards={flashcards}
        knowledgeBaseId={knowledgeBaseId}
        cardSetId={cardSetId}
        onBack={() => setShowDetail(false)}
        onUpdate={loadFlashcards}
      />
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-4">Quản lý Flashcards</h3>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" tip="Đang tải flashcards..." />
        </div>
      ) : flashcards.length === 0 ? (
        <Empty description="Chưa có flashcard nào" />
      ) : (
        <Card
          hoverable
          className="max-w-md"
          cover={
            <div className="h-40 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
              <CreditCardOutlined className="text-6xl text-white" />
            </div>
          }
        >
          <div className="space-y-3">
            <div>
              <div className="font-semibold text-lg mb-1">Flashcard Set</div>
              <div className="text-sm text-gray-600">
                {flashcards.length} flashcards
              </div>
            </div>
            <div className="text-sm text-gray-700 line-clamp-2">
              {flashcards[0]?.front}
            </div>
            <Button 
              type="primary" 
              icon={<EyeOutlined />} 
              onClick={() => setShowDetail(true)}
              block
            >
              Xem tất cả flashcards
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FlashcardManager;
