"use client"

import { useState } from "react"
import { Modal, Button, Alert, message, Slider, InputNumber, Space } from "antd"
import { ExclamationCircleOutlined, ThunderboltOutlined } from "@ant-design/icons"
import { useFlashcards } from "../../hooks/evarTutorHooks"
import { flashcardService } from "../../services/evarTutorService"

interface CreateFlashcardsModalProps {
  open: boolean
  onClose: () => void
  knowledgeBaseId?: number | null
  onCreated?: () => void | Promise<void>
}

export default function CreateFlashcardsModal({ open, onClose, knowledgeBaseId, onCreated }: CreateFlashcardsModalProps) {
  const [showError, setShowError] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [flashcardCount, setFlashcardCount] = useState<number>(10)
  
  const { refetch } = useFlashcards(knowledgeBaseId || undefined)

  const handleCreateFlashcards = async () => {
    if (!knowledgeBaseId) {
      setShowError(true)
      return
    }

    try {
      setGenerating(true)
      console.log('🤖 [CREATE MODAL] Generating flashcards for KB:', knowledgeBaseId);
      
      // Backend API /card-set/generate/ai tạo CardSet và Flashcards, lưu vào DB
      const count = Math.max(1, Math.min(15, flashcardCount))
      const cardSetResponse = await flashcardService.generateFlashcards(knowledgeBaseId, count)
      
      console.log('✅ [CREATE MODAL] Generated CardSet:', cardSetResponse);
      console.log('✅ [CREATE MODAL] Total flashcards:', cardSetResponse.totalCards || cardSetResponse.flashcards?.length);
      
      // Refetch để cập nhật UI
      await refetch()
      await onCreated?.()
      
      message.success(`✅ Đã tạo ${cardSetResponse.totalCards || count} flashcards từ AI!`)
      
      // Đóng modal và reset
      onClose()
      resetForm()
      
    } catch (error: any) {
      console.error('❌ [CREATE MODAL] Generation error:', error)
      const errorMsg = error?.response?.data?.message || error?.message || 'Không thể tạo flashcards'
      message.error(errorMsg)
    } finally {
      setGenerating(false)
    }
  }

  const resetForm = () => {
    setShowError(false)
    setFlashcardCount(10)
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  return (
    <Modal
      title="Create Flashcards"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={800}
      className="[&_.ant-modal-content]:!rounded-lg [&_.ant-modal-header]:!border-b [&_.ant-modal-header]:!border-gray-200"
    >
      <div className="!space-y-6 !py-4">
        {!knowledgeBaseId && (
          <Alert
            message="Vui lòng chọn knowledge base bên khung chat trước khi tạo flashcards."
            type="warning"
            showIcon
            className="[&.ant-alert]:!border-yellow-200 [&.ant-alert]:!bg-yellow-50 [&.ant-alert-message]:!text-yellow-700"
          />
        )}

        {showError && (
          <Alert
            message="Vui lòng chọn knowledge base trước."
            type="error"
            showIcon
            icon={<ExclamationCircleOutlined />}
            className="[&.ant-alert]:!border-red-200 [&.ant-alert]:!bg-red-50 [&.ant-alert-message]:!text-red-700"
          />
        )}

        <div className="!space-y-4">
          <Alert
            message="Chọn số lượng flashcards muốn tạo (1–15)"
            description="Mỗi lần tạo sẽ là một bộ thẻ (Card Set) MỚI cho tài liệu đã chọn. Bạn có thể tạo nhiều bộ cho cùng một tài liệu."
            type="info"
            showIcon
          />
          <div>
            <label className="!block !text-sm !font-medium !text-gray-900 !mb-3">Số lượng flashcards</label>
            <div className="!space-y-3">
              <Slider
                min={1}
                max={15}
                value={flashcardCount}
                onChange={(v) => setFlashcardCount(v as number)}
                marks={{ 1: '1', 5: '5', 10: '10', 15: '15' }}
              />
              <div className="!flex !items-center !justify-end">
                <Space>
                  <span className="!text-sm !text-gray-600">Nhập số lượng</span>
                  <InputNumber min={1} max={15} value={flashcardCount} onChange={(v) => setFlashcardCount((v as number) ? Math.max(1, Math.min(15, v as number)) : 10)} />
                </Space>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="primary"
          block
          size="large"
          onClick={handleCreateFlashcards}
          loading={generating}
          disabled={!knowledgeBaseId}
          icon={<ThunderboltOutlined />}
          className="!bg-gradient-to-r !from-blue-600 !to-blue-500 !border-0 !text-white !rounded-lg !font-medium !h-11 !hover:shadow-lg !transition-all"
        >
          {generating ? 'Đang tạo flashcards...' : `Tạo ${flashcardCount} Flashcards với AI`}
        </Button>
      </div>
    </Modal>
  )
}
