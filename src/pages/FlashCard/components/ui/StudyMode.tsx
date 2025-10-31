import React, { useState, useEffect } from 'react';
import { Button, Card, Progress, Space, Tag, Modal } from 'antd';
import { 
  CheckOutlined, 
  CloseOutlined, 
  ReloadOutlined, 
  ArrowLeftOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons';
import { FlashCard } from '../../types';
import { shuffleArray } from '../../utils';
import MathContent from '../../../createExam-AI/components/ui/MathContent';

interface StudyModeProps {
  cards: FlashCard[];
  onComplete: (results: { correct: number; total: number }) => void;
  onExit: () => void;
  onUpdateStats: (cardId: string, correct: boolean) => Promise<void>;
}

const StudyMode: React.FC<StudyModeProps> = ({ cards, onComplete, onExit, onUpdateStats }) => {
  const [cardList, setCardList] = useState<FlashCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rememberedCards, setRememberedCards] = useState<Set<string>>(new Set());
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    setCardList(shuffleArray(cards));
  }, [cards]);

  const currentCard = cardList[currentIndex];
  const progress = (completedCount / cards.length) * 100;

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
      // Show completion
      onComplete({ correct: rememberedCards.size, total: cardList.length });
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

  const handleRemembered = async () => {
    const newRemembered = new Set(rememberedCards);
    newRemembered.add(currentCard.id);
    setRememberedCards(newRemembered);
    setCompletedCount(completedCount + 1);
    
    // Update stats
    await onUpdateStats(currentCard.id, true);
    
    handleNext();
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
      content: 'Điều này sẽ reset toàn bộ tiến độ của bạn. Bạn có chắc không?',
      okText: 'Có, làm lại',
      cancelText: 'Hủy',
      onOk: () => {
        setCardList(shuffleArray(cards));
        setCurrentIndex(0);
        setIsFlipped(false);
        setRememberedCards(new Set());
        setCompletedCount(0);
      }
    });
  };

  if (!currentCard) {
    return (
      <div className="!flex !items-center !justify-center !h-full">
        <div className="!text-center">
          <p className="!text-gray-500 !mb-4">Không có flashcard nào</p>
          <Button onClick={onExit}>Quay lại</Button>
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
          onClick={onExit}
          size="large"
        >
          Quay lại
        </Button>
        
        <Space size="middle">
          <Tag color="purple" style={{ fontSize: '18px', padding: '8px 16px', fontWeight: 600 }}>
            {currentIndex + 1} / {cardList.length}
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
            className={`!relative !w-full !h-full !transition-transform !duration-500 ${
              isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}
            style={{ 
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s'
            }}
          >
            {/* Front */}
            <Card
              className="!absolute !w-full !h-full !border-2 !border-blue-300 !shadow-2xl !rounded-2xl !flex !items-center !justify-center"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(0deg)'
              }}
            >
              <div className="!flex !flex-col !items-center !justify-center !h-full !p-8">
                <div className="!text-sm !text-blue-600 !font-semibold !mb-4 !uppercase">Câu hỏi</div>
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
                transform: 'rotateY(180deg)'
              }}
            >
              <div className="!flex !flex-col !items-center !justify-center !h-full !p-8">
                <div className="!text-sm !text-purple-600 !font-semibold !mb-4 !uppercase">Câu trả lời</div>
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
          disabled={currentIndex === cardList.length - 1}
        >
          Sau
        </Button>
      </div>
    </div>
  );
};

export default StudyMode;

