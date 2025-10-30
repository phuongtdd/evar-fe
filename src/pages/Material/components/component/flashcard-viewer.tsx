"use client"

import { useState } from "react"
import { Card, Button, Progress, Tag, Space, Modal } from "antd"
import { 
  LeftOutlined, 
  RightOutlined, 
  ReloadOutlined, 
  CheckOutlined,
  CloseOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons"

interface FlashcardViewerProps {
  flashcards: Array<{
    id: string
    front: string
    back: string
    knowledgeBaseId: number
    createdAt: string
  }>
  onBack: () => void
}

export default function FlashcardViewer({ flashcards, onBack }: FlashcardViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set())
  const [difficultCards, setDifficultCards] = useState<Set<string>>(new Set())

  const currentCard = flashcards[currentIndex]
  const progress = ((currentIndex + 1) / flashcards.length) * 100
  const masteredCount = masteredCards.size
  const difficultCount = difficultCards.size

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleMastered = () => {
    const newMastered = new Set(masteredCards)
    newMastered.add(currentCard.id)
    setMasteredCards(newMastered)
    
    const newDifficult = new Set(difficultCards)
    newDifficult.delete(currentCard.id)
    setDifficultCards(newDifficult)
    
    handleNext()
  }

  const handleDifficult = () => {
    const newDifficult = new Set(difficultCards)
    newDifficult.add(currentCard.id)
    setDifficultCards(newDifficult)
    
    const newMastered = new Set(masteredCards)
    newMastered.delete(currentCard.id)
    setMasteredCards(newMastered)
    
    handleNext()
  }

  const handleReset = () => {
    Modal.confirm({
      title: 'Reset Progress?',
      content: 'This will reset all your progress. Are you sure?',
      okText: 'Yes, Reset',
      cancelText: 'Cancel',
      onOk: () => {
        setCurrentIndex(0)
        setIsFlipped(false)
        setMasteredCards(new Set())
        setDifficultCards(new Set())
      }
    })
  }

  if (flashcards.length === 0) {
    return (
      <div className="!flex !items-center !justify-center !h-full">
        <div className="!text-center">
          <p className="!text-gray-500 !mb-4">No flashcards available</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="!h-full !flex !flex-col !p-6 !bg-gradient-to-br !from-blue-50 !to-purple-50">
      {/* Header */}
      <div className="!flex !items-center !justify-between !mb-6">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={onBack}
          className="!rounded-lg"
        >
          Back to List
        </Button>
        
        <Space size="large">
          <div className="!text-center">
            <div className="!text-2xl !font-bold !text-gray-900">{currentIndex + 1}</div>
            <div className="!text-xs !text-gray-500">of {flashcards.length}</div>
          </div>
          
          <div className="!flex !gap-4">
            <div className="!text-center">
              <Tag color="green" className="!text-base !px-3 !py-1">
                <CheckOutlined /> {masteredCount}
              </Tag>
              <div className="!text-xs !text-gray-500 !mt-1">Mastered</div>
            </div>
            
            <div className="!text-center">
              <Tag color="orange" className="!text-base !px-3 !py-1">
                <CloseOutlined /> {difficultCount}
              </Tag>
              <div className="!text-xs !text-gray-500 !mt-1">Difficult</div>
            </div>
          </div>
          
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleReset}
            className="!rounded-lg"
          >
            Reset
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
                <div className="!text-sm !text-blue-600 !font-semibold !mb-4 !uppercase">Question</div>
                <div className="!text-2xl !font-bold !text-gray-900 !text-center !leading-relaxed">
                  {currentCard.front}
                </div>
                <div className="!mt-8 !text-sm !text-gray-400">Click to flip</div>
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
                <div className="!text-sm !text-purple-600 !font-semibold !mb-4 !uppercase">Answer</div>
                <div className="!text-xl !text-gray-800 !text-center !leading-relaxed">
                  {currentCard.back}
                </div>
                <div className="!mt-8 !text-sm !text-gray-400">Click to flip back</div>
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
          className="!rounded-lg !h-12 !px-8"
        >
          Previous
        </Button>

        {isFlipped && (
          <Space size="middle">
            <Button
              size="large"
              danger
              icon={<CloseOutlined />}
              onClick={handleDifficult}
              className="!rounded-lg !h-12 !px-8"
            >
              Difficult
            </Button>
            
            <Button
              size="large"
              type="primary"
              icon={<CheckOutlined />}
              onClick={handleMastered}
              className="!bg-green-600 !border-green-600 hover:!bg-green-700 !rounded-lg !h-12 !px-8"
            >
              Mastered
            </Button>
          </Space>
        )}

        <Button
          size="large"
          type="primary"
          icon={<RightOutlined />}
          onClick={handleNext}
          disabled={currentIndex === flashcards.length - 1}
          className="!rounded-lg !h-12 !px-8"
        >
          Next
        </Button>
      </div>

      {/* Card Status Indicator */}
      {(masteredCards.has(currentCard.id) || difficultCards.has(currentCard.id)) && (
        <div className="!text-center !mt-4">
          {masteredCards.has(currentCard.id) && (
            <Tag color="green" className="!text-base !px-4 !py-2">
              <CheckOutlined /> You've mastered this card
            </Tag>
          )}
          {difficultCards.has(currentCard.id) && (
            <Tag color="orange" className="!text-base !px-4 !py-2">
              <CloseOutlined /> Marked as difficult
            </Tag>
          )}
        </div>
      )}
    </div>
  )
}
