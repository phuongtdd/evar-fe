import React, { useState } from 'react';
import { Card, Button, Progress, Tag, Space, Modal } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  ReloadOutlined,
  CheckOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
  TrophyOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { FlashCard } from '../../types/cardSet';
import MathContent from '../../../createExam-AI/components/ui/MathContent';

interface StudyModeViewerProps {
  flashcards: FlashCard[];
  onBack: () => void;
}

const StudyModeViewer: React.FC<StudyModeViewerProps> = ({ flashcards, onBack }) => {
  const [cardList, setCardList] = useState<FlashCard[]>(flashcards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rememberedCards, setRememberedCards] = useState<Set<string>>(new Set());
  const [completedCount, setCompletedCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentCard = cardList[currentIndex];
  const progress = (completedCount / flashcards.length) * 100;

  const handleNext = () => {
    if (currentIndex < cardList.length - 1) {
      // Mặc định đánh dấu thẻ hiện tại là "Đã nhớ" khi ấn "Sau"
      if (!rememberedCards.has(currentCard.id)) {
        const newRemembered = new Set(rememberedCards);
        newRemembered.add(currentCard.id);
        setRememberedCards(newRemembered);
        setCompletedCount(completedCount + 1);
      }
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      // Hoàn thành tất cả flashcard - show completion screen
      // Đánh dấu thẻ cuối cùng là "Đã nhớ" nếu chưa được đánh dấu
      if (!rememberedCards.has(currentCard.id)) {
        const newRemembered = new Set(rememberedCards);
        newRemembered.add(currentCard.id);
        setRememberedCards(newRemembered);
        setCompletedCount(completedCount + 1);
      }
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      // Lấy thẻ trước (thẻ sẽ hiển thị)
      const previousCard = cardList[currentIndex - 1];
      
      // Bỏ đánh dấu "Đã nhớ" của thẻ trước và giảm tiến độ ngay
      if (rememberedCards.has(previousCard.id)) {
        const newRemembered = new Set(rememberedCards);
        newRemembered.delete(previousCard.id);
        setRememberedCards(newRemembered);
        setCompletedCount(completedCount - 1);
      }
      
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRemembered = () => {
    const newRemembered = new Set(rememberedCards);
    newRemembered.add(currentCard.id);
    setRememberedCards(newRemembered);
    setCompletedCount(completedCount + 1);
    
    // Check if this is the last card
    if (currentIndex === cardList.length - 1) {
      setIsCompleted(true);
    } else {
      handleNext();
    }
  };

  const handleSkip = () => {
    // Đẩy thẻ hiện tại ra cuối danh sách
    const newCardList = [...cardList];
    const skippedCard = newCardList[currentIndex];
    newCardList.splice(currentIndex, 1);
    newCardList.push(skippedCard);
    setCardList(newCardList);
    setIsFlipped(false);
    // Không tăng completedCount để tiến độ không thay đổi
  };

  const handleReset = () => {
    Modal.confirm({
      title: 'Làm lại từ đầu?',
      content: 'Bạn có chắc chắn muốn reset toàn bộ tiến trình học?',
      okText: 'Đồng ý',
      cancelText: 'Hủy',
      onOk: () => {
        setCardList(flashcards);
        setCurrentIndex(0);
        setIsFlipped(false);
        setRememberedCards(new Set());
        setCompletedCount(0);
        setIsCompleted(false);
      },
    });
  };

  const handleRestart = () => {
    setCardList(flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setRememberedCards(new Set());
    setCompletedCount(0);
    setIsCompleted(false);
  };

  if (flashcards.length === 0) {
    return (
      <div className="!flex !items-center !justify-center !h-full">
        <div className="!text-center">
          <p className="!text-gray-500 !mb-4">Không có flashcard nào</p>
          <Button onClick={onBack}>Quay lại</Button>
        </div>
      </div>
    );
  }

  // Show completion screen
  if (isCompleted) {
    return (
      <div className="!h-full !flex !items-center !justify-center !bg-gradient-to-br !from-green-50 !via-blue-50 !to-purple-50 !p-6">
        <div className="!text-center !max-w-2xl !w-full">
          <div className="!mb-8">
            <div className="!mb-4">
              <CheckCircleOutlined 
                style={{ fontSize: '120px', color: '#52c41a' }}
              />
            </div>
            <h1 className="!text-4xl !font-bold !text-gray-900 !mb-2">
              🎉 Bạn đã hoàn thành!
            </h1>
            <p className="!text-xl !text-gray-600 !mb-8">
              Chúc mừng bạn đã học xong tất cả flashcard
            </p>
          </div>

          <div className="!bg-white !rounded-2xl !shadow-2xl !p-8 !mb-8">
            <Space direction="vertical" size="large" className="!w-full">
              <div className="!flex !items-center !justify-around !mb-6">
                <div className="!text-center">
                  <div className="!text-4xl !font-bold !text-blue-600 !mb-2">
                    {flashcards.length}
                  </div>
                  <div className="!text-gray-600 !text-lg">
                    Tổng số thẻ
                  </div>
                </div>
                <div className="!text-center">
                  <div className="!text-4xl !font-bold !text-green-600 !mb-2">
                    {rememberedCards.size}
                  </div>
                  <div className="!text-gray-600 !text-lg">
                    Thẻ đã nhớ
                  </div>
                </div>
              </div>

              <div className="!mb-6">
                <Progress
                  percent={Math.round((rememberedCards.size / flashcards.length) * 100)}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                  format={(percent) => `${percent}%`}
                />
              </div>

              <div className="!flex !items-center !justify-center !gap-4">
                <Button
                  size="large"
                  icon={<TrophyOutlined />}
                  onClick={handleRestart}
                  style={{
                    backgroundColor: '#1890ff',
                    borderColor: '#1890ff',
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}
                >
                  Học lại
                </Button>
                <Button
                  size="large"
                  icon={<ArrowLeftOutlined />}
                  onClick={onBack}
                  style={{
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}
                >
                  Quay lại danh sách
                </Button>
              </div>
            </Space>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="!h-full !flex !flex-col !p-6 !bg-gradient-to-br !from-blue-50 !to-purple-50">
      {/* Header */}
      <div className="!flex !items-center !justify-between !mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          size="large"
        >
          Quay lại
        </Button>

        <Space size="middle">
          <Tag color="purple" style={{ fontSize: '18px', padding: '8px 16px', fontWeight: 600 }}>
            {currentIndex + 1} / {flashcards.length}
          </Tag>

          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
            size="large"
            type="primary"
          >
            Làm lại
          </Button>
        </Space>
      </div>

      {/* Progress Bar */}
      <Progress
        percent={Math.round(progress)}
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
        className="!mb-6"
      />

      {/* Flashcard */}
      <div className="!flex-1 !flex !items-center !justify-center !mb-6">
        <div
          className="!relative !w-full !max-w-3xl !h-96 !cursor-pointer"
          style={{ perspective: '1000px' }}
          onClick={handleFlip}
        >
          <div
            className={`!relative !w-full !h-full !transition-transform !duration-300 ${
              isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.3s',
            }}
          >
            {/* Front */}
            <Card
              className="!absolute !w-full !h-full !border-2 !border-blue-300 !shadow-2xl !rounded-2xl !flex !items-center !justify-center"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)',
              }}
            >
              <div className="!flex !flex-col !items-center !justify-center !h-full !p-8">
                <div className="!text-sm !text-blue-600 !font-semibold !mb-4 !uppercase">
                  Câu hỏi
                </div>
                <div className="!text-2xl !font-bold !text-gray-900 !text-center !leading-relaxed">
                  <MathContent content={currentCard.front} />
                </div>
                <div className="!mt-8 !text-sm !text-gray-400">Click để lật thẻ</div>
              </div>
            </Card>

            {/* Back */}
            <Card
              className="!absolute !w-full !h-full !border-2 !border-purple-300 !shadow-2xl !rounded-2xl !flex !items-center !justify-center !bg-gradient-to-br !from-purple-50 !to-pink-50"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <div className="!flex !flex-col !items-center !justify-center !h-full !p-8">
                <div className="!text-sm !text-purple-600 !font-semibold !mb-4 !uppercase">
                  Câu trả lời
                </div>
                <div className="!text-xl !text-gray-800 !text-center !leading-relaxed">
                  <MathContent content={currentCard.back} />
                </div>
                <div className="!mt-8 !text-sm !text-gray-400">Click để lật lại</div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="!flex !items-center !justify-between !gap-4">
        <Button
          size="large"
          icon={<LeftOutlined />}
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Trước
        </Button>

        {isFlipped && (
          <Space size="middle">
            <Button
              size="large"
              icon={<CloseOutlined />}
              onClick={handleSkip}
            >
              Bỏ qua
            </Button>

            <Button
              size="large"
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleRemembered}
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
            >
              Đã nhớ
            </Button>
          </Space>
        )}

        <Button
          size="large"
          icon={<RightOutlined />}
          onClick={handleNext}
        >
          {currentIndex === cardList.length - 1 ? 'Hoàn thành' : 'Sau'}
        </Button>
      </div>
    </div>
  );
};

export default StudyModeViewer;

