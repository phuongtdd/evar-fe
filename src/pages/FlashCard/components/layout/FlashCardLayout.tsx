import React, { useState } from 'react';
import {
  Button,
  Input,
  Empty,
  Spin,
  Modal,
  Statistic,
  Row,
  Col,
  Card as AntCard,
  Space,
  Layout,
  message,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  BookOutlined,
  FolderOutlined,
  ArrowLeftOutlined,
  PictureOutlined,
} from '@ant-design/icons';
import { useCardSets } from '../../hooks/useCardSets';
import type { CardSet } from '../../types';
import CardSetItem from '../ui/CardSetItem';
import CardListView from './CardListView';
import GenerateFromImageModal from '../ui/GenerateFromImageModal';
import CreateCardSetWithFlashcardsModal from '../ui/CreateCardSetWithFlashcardsModal';
import { createCardSetWithFlashcards } from '../../services/cardSetService';
import { getUserIdFromToken } from '../../utils/auth';

const { Content } = Layout;

const FlashCardLayout: React.FC = () => {
  const {
    cardSets,
    loading,
    error,
    deleteCardSet,
    refresh,
  } = useCardSets();

  const [searchText, setSearchText] = useState('');
  const [selectedCardSet, setSelectedCardSet] = useState<CardSet | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  // Filter card sets
  const filteredCardSets = cardSets.filter(set =>
    set.name.toLowerCase().includes(searchText.toLowerCase()) ||
    set.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Handle delete
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa bộ flashcard này? Tất cả các thẻ bên trong sẽ bị xóa.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteCardSet(id);
          message.success('Xóa bộ flashcard thành công');
        } catch (err) {
          message.error('Xóa bộ flashcard thất bại');
        }
      },
    });
  };

  // Handle edit
  const handleEdit = (cardSet: CardSet) => {
    // TODO: Implement edit modal
    message.info('Chức năng chỉnh sửa đang được phát triển');
  };

  // Handle click card set to view cards inside
  const handleCardSetClick = (cardSet: CardSet) => {
    setSelectedCardSet(cardSet);
  };

  // Back to card sets list
  const handleBack = () => {
    setSelectedCardSet(null);
  };

  // Handle create new card set
  const handleCreate = () => {
    setShowCreateModal(true);
  };

  // Handle create card set with flashcards
  const handleCreateCardSetWithFlashcards = async (data: {
    userId: string;
    name: string;
    description: string;
    flashcards: Array<{ front: string; back: string }>;
  }) => {
    try {
      setCreating(true);
      await createCardSetWithFlashcards(data);
      message.success('Tạo bộ flashcard thành công');
      refresh();
    } catch (error: any) {
      console.error('Create error:', error);
      const errorMsg = error?.response?.data?.message || error?.message || 'Không thể tạo bộ flashcard';
      message.error(errorMsg);
      throw error;
    } finally {
      setCreating(false);
    }
  };

  // Handle generate from image
  const handleGenerateFromImage = () => {
    setShowImageModal(true);
  };

  const handleImageModalClose = () => {
    setShowImageModal(false);
  };

  const handleImageModalSuccess = () => {
    refresh(); // Refresh card sets list
  };

  // If a card set is selected, show the cards inside
  if (selectedCardSet) {
    return (
      <div style={{ padding: '16px', paddingTop: '24px', background: '#ffffff' }}>
        <div style={{ marginBottom: '16px' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={handleBack}
            size="large"
            style={{
              borderRadius: '8px',
              border: '2px solid #1890ff',
              fontWeight: 600,
              boxShadow: '0 2px 4px rgba(24, 144, 255, 0.2)',
            }}
          >
            Quay lại danh sách
          </Button>
        </div>
        <CardListView cardSetId={selectedCardSet.id} cardSetName={selectedCardSet.name} />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <Layout style={{ background: '#f0f2f5', minHeight: 'auto' }}>
        <Content style={{ padding: '16px', paddingTop: '24px', minHeight: 'calc(100vh - 64px)' }}>
          <div className="max-w-7xl mx-auto">
            <AntCard>
              <Empty
                description={
                  <div>
                    <p className="text-red-500 font-semibold">❌ Lỗi tải danh sách flashcard</p>
                    <p className="text-gray-600">{error}</p>
                  </div>
                }
              >
                <Button type="primary" onClick={refresh}>
                  Thử lại
                </Button>
              </Empty>
            </AntCard>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ background: '#ffffff', minHeight: '100vh' }}>
      <Content style={{ padding: '16px', paddingTop: '40px', background: '#ffffff' }}>
        <div className="max-w-7xl mx-auto">
          {/* Statistics Cards */}
          <Row gutter={16} className="mb-6">
            <Col xs={24} sm={12} lg={8}>
              <AntCard 
                size="small"
                style={{
                  border: '2px solid #1890ff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(24, 144, 255, 0.15)',
                }}
              >
                <Statistic
                  title="Tổng số bộ flashcard"
                  value={cardSets.length}
                  prefix={<FolderOutlined />}
                  valueStyle={{ color: '#1890ff', fontWeight: 600 }}
                />
              </AntCard>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <AntCard 
                size="small"
                style={{
                  border: '2px solid #52c41a',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(82, 196, 26, 0.15)',
                }}
              >
                <Statistic
                  title="Tổng số thẻ"
                  value={cardSets.reduce((sum, set) => sum + set.totalCards, 0)}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#52c41a', fontWeight: 600 }}
                />
              </AntCard>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <AntCard 
                size="small"
                style={{
                  border: '2px solid #faad14',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(250, 173, 20, 0.15)',
                }}
              >
                <Statistic
                  title="Bộ có Knowledge Base"
                  value={cardSets.filter(set => set.knowledgeBaseId).length}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: '#faad14', fontWeight: 600 }}
                />
              </AntCard>
            </Col>
          </Row>

          {/* Main Content Card */}
          <AntCard
            style={{
              border: '2px solid #d9d9d9',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              background: '#ffffff',
              minHeight: 'calc(100vh - 280px)',
              padding: '8px',
            }}
          >
            {/* Search and Action Buttons */}
            <Row gutter={16} className="mb-6" align="middle">
              <Col xs={24} md={12}>
                <Input
                  size="large"
                  placeholder="Tìm kiếm bộ flashcard..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} md={12} className="flex justify-end">
                <Space size="middle">
                  <Button
                    type="default"
                    size="large"
                    icon={<PictureOutlined />}
                    onClick={handleGenerateFromImage}
                  >
                    Tạo Flashcard từ ảnh
                  </Button>
                  <Button
                    type="default"
                    size="large"
                    icon={<PlusOutlined />}
                    onClick={handleCreate}
                  >
                    Tạo Flashcard thủ công
                  </Button>
                </Space>
              </Col>
            </Row>

            {/* Card Sets Display - Fixed Container */}
            <div style={{ height: '480px' }}>
              {loading ? (
                <div className="flex justify-center items-center" style={{ height: '520px' }}>
                  <Spin size="large" />
                </div>
              ) : filteredCardSets.length === 0 ? (
                <div className="flex justify-center items-center" style={{ height: '520px' }}>
                  <Empty
                    description={
                      cardSets.length === 0
                        ? 'Chưa có bộ flashcard nào. Hãy tạo bộ flashcard đầu tiên!'
                        : 'Không tìm thấy bộ flashcard phù hợp'
                    }
                  >
                    {cardSets.length === 0 && (
                      <Space>
                        <Button 
                          type="default"
                          size="large"
                          icon={<PictureOutlined />} 
                          onClick={handleGenerateFromImage}
                        >
                          Tạo Flashcard từ ảnh
                        </Button>
                        <Button 
                          type="default"
                          size="large"
                          icon={<PlusOutlined />} 
                          onClick={handleCreate}
                        >
                          Tạo Flashcard thủ công
                        </Button>
                      </Space>
                    )}
                  </Empty>
                </div>
              ) : (
                <div 
                  className="grid grid-cols-3 gap-6 overflow-y-auto" 
                  style={{ 
                    height: '520px',
                    paddingTop: '8px',
                    paddingBottom: '8px'
                  }}
                >
                  {filteredCardSets.map(set => (
                    <CardSetItem
                      key={set.id}
                      cardSet={set}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onClick={handleCardSetClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </AntCard>
        </div>
      </Content>

      {/* Generate from Image Modal */}
      <GenerateFromImageModal
        visible={showImageModal}
        onClose={handleImageModalClose}
        onSuccess={handleImageModalSuccess}
      />

      {/* Create Card Set with Flashcards Modal */}
      <CreateCardSetWithFlashcardsModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCardSetWithFlashcards}
        userId={getUserIdFromToken() || ''}
        loading={creating}
      />
    </Layout>
  );
};

export default FlashCardLayout;

