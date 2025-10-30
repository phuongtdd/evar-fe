"use client"

import { useState } from "react"
import { Modal, Button, Select, Alert, message } from "antd"
import { ExclamationCircleOutlined, ThunderboltOutlined } from "@ant-design/icons"
import { useKnowledgeBases, useFlashcards } from "../../hooks/evarTutorHooks"
import { flashcardService } from "../../services/evarTutorService"

interface CreateFlashcardsModalProps {
  open: boolean
  onClose: () => void
}

export default function CreateFlashcardsModal({ open, onClose }: CreateFlashcardsModalProps) {
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<number | null>(null)
  const [showError, setShowError] = useState(false)
  const [generating, setGenerating] = useState(false)
  
  const { data: knowledgeBasesData, loading: knowledgeBasesLoading } = useKnowledgeBases()
  const { refetch } = useFlashcards(selectedKnowledgeBase || undefined)
  
  // Ensure knowledgeBases is always an array
  const knowledgeBases = Array.isArray(knowledgeBasesData) ? knowledgeBasesData : []

  const handleCreateFlashcards = async () => {
    if (!selectedKnowledgeBase) {
      setShowError(true)
      return
    }

    try {
      setGenerating(true)
      console.log('🤖 [CREATE MODAL] Generating flashcards for KB:', selectedKnowledgeBase);
      
      // Backend API /card-set/generate/ai tạo CardSet và Flashcards, lưu vào DB
      const cardSetResponse = await flashcardService.generateFlashcards(selectedKnowledgeBase, 5)
      
      console.log('✅ [CREATE MODAL] Generated CardSet:', cardSetResponse);
      console.log('✅ [CREATE MODAL] Total flashcards:', cardSetResponse.totalCards || cardSetResponse.flashcards?.length);
      
      // Refetch để cập nhật UI
      await refetch()
      
      message.success(`✅ Đã tạo ${cardSetResponse.totalCards || 5} flashcards từ AI!`)
      
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
    setSelectedKnowledgeBase(null)
    setShowError(false)
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
        <div>
          <label className="!block !text-sm !font-medium !text-gray-900 !mb-3">Select Knowledge Base:</label>
          <Select
            placeholder="Choose a knowledge base"
            value={selectedKnowledgeBase}
            onChange={(value) => {
              setSelectedKnowledgeBase(value)
              setShowError(false)
            }}
            className="!w-full [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-gray-300 [&_.ant-select-selector]:!h-10"
            loading={knowledgeBasesLoading}
            options={knowledgeBases.map(kb => ({
              label: `${kb.fileName} (${kb.status})`,
              value: kb.id,
              disabled: kb.status !== 'READY'
            }))}
          />
        </div>

        {showError && (
          <Alert
            message="Vui lòng chọn knowledge base trước."
            type="error"
            showIcon
            icon={<ExclamationCircleOutlined />}
            className="[&.ant-alert]:!border-red-200 [&.ant-alert]:!bg-red-50 [&.ant-alert-message]:!text-red-700"
          />
        )}

        <Alert
          message="AI sẽ tự động tạo 5 flashcards từ nội dung tài liệu"
          description="Flashcards sẽ được tạo và lưu trực tiếp vào hệ thống. Bạn có thể xem và chỉnh sửa chúng sau khi tạo xong."
          type="info"
          showIcon
        />

        <Button
          type="primary"
          block
          size="large"
          onClick={handleCreateFlashcards}
          loading={generating}
          disabled={!selectedKnowledgeBase}
          icon={<ThunderboltOutlined />}
          className="!bg-gradient-to-r !from-blue-600 !to-blue-500 !border-0 !text-white !rounded-lg !font-medium !h-11 !hover:shadow-lg !transition-all"
        >
          {generating ? 'Đang tạo flashcards...' : 'Tạo Flashcards với AI'}
        </Button>
      </div>
    </Modal>
  )
}
