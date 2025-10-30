import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Empty,
  Spin,
  Row,
  Col,
  Card as AntCard,
  Space,
  Layout,
  message,
  Modal,
} from 'antd';
import {
  SearchOutlined,
  BookOutlined,
  PlayCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { getCardSetById, deleteFlashcard, updateFlashcard, createFlashcard } from '../../services/cardSetService';
import type { CardSet, FlashCard } from '../../types/cardSet';
import SimpleFlashCard from '../ui/SimpleFlashCard';
import StudyModeViewer from '../ui/StudyModeViewer';
import EditFlashcardModal from '../ui/EditFlashcardModal';
import CreateFlashcardInSetModal from '../ui/CreateFlashcardInSetModal';

const { Content } = Layout;

interface CardListViewProps {
  cardSetId: string;
  cardSetName: string;
}

const CardListView: React.FC<CardListViewProps> = ({ cardSetId, cardSetName }) => {
  const [cardSet, setCardSet] = useState<CardSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [studyMode, setStudyMode] = useState(false);
  const [editingCard, setEditingCard] = useState<FlashCard | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Fetch card set with flashcards
  useEffect(() => {
    const fetchCardSet = async () => {
      try {
        setLoading(true);
        const data = await getCardSetById(cardSetId);
        setCardSet(data);
      } catch (error: any) {
        console.error('❌ Lỗi khi tải flashcards:', error);
        message.error('Không thể tải flashcards');
      } finally {
        setLoading(false);
      }
    };

    if (cardSetId) {
      fetchCardSet();
    }
  }, [cardSetId]);

  const flashcards = cardSet?.flashcards || [];

  // Filter flashcards
  const filteredCards = flashcards.filter(card =>
    card.front.toLowerCase().includes(searchText.toLowerCase()) ||
    card.back.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle edit flashcard
  const handleEdit = (card: FlashCard) => {
    setEditingCard(card);
    setShowEditModal(true);
  };

  // Handle update flashcard
  const handleUpdateFlashcard = async (data: { id: string; front: string; back: string }) => {
    try {
      await updateFlashcard(data);
      message.success('Cập nhật flashcard thành công');
      
      // Refresh the card set after update
      const updatedCardSet = await getCardSetById(cardSetId);
      setCardSet(updatedCardSet);
    } catch (error: any) {
      console.error('Update error:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Không thể cập nhật flashcard';
      message.error(errorMsg);
      throw error;
    }
  };

  // Handle delete flashcard
  const handleDelete = (cardId: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa flashcard này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteFlashcard(cardId);
          message.success('Xóa flashcard thành công');
          
          // Refresh the card set after delete
          const data = await getCardSetById(cardSetId);
          setCardSet(data);
        } catch (error: any) {
          console.error('Delete error:', error);
          const errorMsg = error?.response?.data?.message || error?.message || 'Không thể xóa flashcard';
          message.error(errorMsg);
        }
      },
    });
  };

  // Handle create flashcard
  const handleCreateFlashcard = async (data: { front: string; back: string }) => {
    try {
      setCreating(true);
      await createFlashcard(cardSetId, data);
      message.success('Tạo flashcard thành công');
      
      // Refresh the card set after create
      const updatedCardSet = await getCardSetById(cardSetId);
      setCardSet(updatedCardSet);
    } catch (error: any) {
      console.error('Create error:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Không thể tạo flashcard';
      message.error(errorMsg);
      throw error;
    } finally {
      setCreating(false);
    }
  };

  // If in study mode, show StudyModeViewer
  if (studyMode) {
    return (
      <div style={{ height: '100vh' }}>
        <StudyModeViewer
          flashcards={filteredCards.length > 0 ? filteredCards : flashcards}
          onBack={() => setStudyMode(false)}
        />
      </div>
    );
  }

  return (
    <Layout style={{ background: '#ffffff', minHeight: '100vh' }}>
      <Content style={{ padding: '12px', background: '#ffffff' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-2">
            <h2 className="text-lg font-bold text-gray-900">
              <BookOutlined /> {cardSetName}
            </h2>
          </div>

          {/* Main Content Card */}
          <AntCard
            style={{
              border: '2px solid #d9d9d9',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              background: '#ffffff',
              minHeight: 'calc(100vh - 280px)',
            }}
            bodyStyle={{ padding: '16px' }}
          >
            {/* Search and Action Buttons */}
            <Row gutter={12} style={{ margin: '10px 0px 20px 0px' }} align="middle">
              <Col xs={24} md={10}>
                <Input
                  size="large"
                  placeholder="Tìm kiếm flashcard..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} md={14}>
                <div className="flex items-center justify-end h-full gap-3 flex-wrap">
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={() => setShowCreateModal(true)}
                    style={{
                      borderRadius: '8px',
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                      backgroundColor: '#1890ff',
                      borderColor: '#1890ff',
                    }}
                  >
                    Tạo thẻ mới
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlayCircleOutlined />}
                    onClick={() => setStudyMode(true)}
                    disabled={flashcards.length === 0}
                    style={{
                      borderRadius: '8px',
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(24, 144, 255, 0.3)',
                      backgroundColor: '#52c41a',
                      borderColor: '#52c41a',
                    }}
                  >
                    Bắt đầu học
                  </Button>
                  <span className="text-gray-600 text-base">
                    Tổng số thẻ: <strong>{flashcards.length}</strong>
                  </span>
                </div>
              </Col>
            </Row>

            {/* Flashcards Display - Fixed Container */}
            <div
              className="grid grid-cols-3"
              style={{
                height: '520px',
                padding: '8px',
                gap: '20px',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}
            >
              {loading ? (
                <div className="col-span-3 flex justify-center items-center" style={{ height: '100%' }}>
                  <Spin size="large" tip="Đang tải flashcards..." />
                </div>
              ) : filteredCards.length === 0 ? (
                <div className="col-span-3 flex justify-center items-center" style={{ height: '100%' }}>
                  <Empty
                    description={
                      flashcards.length === 0
                        ? 'Chưa có flashcard nào trong bộ này'
                        : 'Không tìm thấy flashcard phù hợp'
                    }
                  />
                </div>
              ) : (
                filteredCards.map(card => (
                  <SimpleFlashCard
                    key={card.id}
                    card={card}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </AntCard>
        </div>
      </Content>

      {/* Edit Flashcard Modal */}
      <EditFlashcardModal
        visible={showEditModal}
        flashcard={editingCard}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdateFlashcard}
      />

      {/* Create Flashcard Modal */}
      <CreateFlashcardInSetModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateFlashcard}
        loading={creating}
      />
    </Layout>
  );
};

export default CardListView;
