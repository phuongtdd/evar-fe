"use client"

import { useState, useEffect } from "react"
import { Modal, Button, Select, Alert, Form, Input, Card, Tag, Spin, message } from "antd"
import { UploadOutlined, ExclamationCircleOutlined, PlusOutlined, DeleteOutlined, ThunderboltOutlined } from "@ant-design/icons"
import { useKnowledgeBases, useFlashcards } from "../../hooks/evarTutorHooks"
import { flashcardService } from "../../services/evarTutorService"

type FlashcardRequest = {
  front: string;
  back: string;
  knowledgeBaseId: number;
};

interface CreateFlashcardsModalProps {
  open: boolean
  onClose: () => void
}

export default function CreateFlashcardsModal({ open, onClose }: CreateFlashcardsModalProps) {
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<number | null>(null)
  const [showError, setShowError] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Omit<FlashcardRequest, 'knowledgeBaseId'>[]>([])
  const [form] = Form.useForm()
  
  const { data: knowledgeBases, loading: knowledgeBasesLoading } = useKnowledgeBases()
  const { createFlashcard, refetch } = useFlashcards(selectedKnowledgeBase || undefined)

  const handleCreateFlashcards = async () => {
    if (!selectedKnowledgeBase) {
      setShowError(true)
      return
    }

    try {
      setGenerating(true)
      const generated = await flashcardService.generateFlashcards(selectedKnowledgeBase, 5)
      setGeneratedFlashcards(
        generated.map(fc => ({ front: fc.front, back: fc.back }))
      )
      message.success('AI generated flashcards! Review and save if needed.')
      
    } catch (error) {
      console.error('Generation error:', error)
      message.error('Failed to generate flashcards')
    } finally {
      setGenerating(false)
    }
  }

  const handleSaveFlashcards = async () => {
    if (!selectedKnowledgeBase) return
    
    try {
      const formValues = await form.validateFields()
      
      await Promise.all(
        generatedFlashcards.map((flashcard, idx) => {
          const flashcardData: FlashcardRequest = {
            front: formValues[`front_${idx}`] || flashcard.front,
            back: formValues[`back_${idx}`] || flashcard.back,
            knowledgeBaseId: selectedKnowledgeBase
          }
          return createFlashcard(flashcardData)
        })
      )
      
      message.success('Flashcards created successfully!')
      await refetch()
      onClose()
      resetForm()
      
    } catch (error) {
      console.error('Save error:', error)
      message.error('Failed to save flashcards')
    }
  }

  const resetForm = () => {
    setSelectedKnowledgeBase(null)
    setShowError(false)
    setGeneratedFlashcards([])
    form.resetFields()
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  const removeFlashcard = (index: number) => {
    setGeneratedFlashcards(prev => prev.filter((_, i) => i !== index))
  }

  const addCustomFlashcard = () => {
    const newFlashcard: Omit<FlashcardRequest, 'knowledgeBaseId'> = {
      front: '',
      back: '',
    }
    setGeneratedFlashcards(prev => [...prev, newFlashcard])
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
        {generatedFlashcards.length === 0 ? (
          <>
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
                  label: kb.fileName,
                  value: kb.id
                }))}
              />
            </div>

            {showError && (
              <Alert
                message="You must select a knowledge base."
                type="error"
                showIcon
                icon={<ExclamationCircleOutlined />}
                className="[&.ant-alert]:!border-red-200 [&.ant-alert]:!bg-red-50 [&.ant-alert-message]:!text-red-700"
              />
            )}

            <Button
              type="primary"
              block
              size="large"
              onClick={handleCreateFlashcards}
              loading={generating}
              disabled={!selectedKnowledgeBase}
              className="!bg-gradient-to-r !from-blue-600 !to-blue-500 !border-0 !text-white !rounded-lg !font-medium !h-11 !hover:shadow-lg !transition-all"
            >
              {generating ? 'Generating Flashcards...' : 'Generate Flashcards with AI'}
            </Button>
          </>
        ) : (
          <>
            <div className="!flex !items-center !justify-between">
              <h3 className="!text-lg !font-semibold !text-gray-900">
                Generated Flashcards ({generatedFlashcards.length})
              </h3>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={addCustomFlashcard}
                className="!rounded-lg"
              >
                Add Custom
              </Button>
            </div>

            <Form form={form} layout="vertical" className="!space-y-4">
              {generatedFlashcards.map((flashcard, index) => (
                <Card key={index} size="small" className="!border !border-gray-200">
                  <div className="!flex !items-start !justify-between !mb-4">
                    <h4 className="!font-medium !text-gray-900">Flashcard {index + 1}</h4>
                    <Button
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => removeFlashcard(index)}
                    >
                      Remove
                    </Button>
                  </div>
                  
                  <div className="!grid !grid-cols-1 !md:grid-cols-2 !gap-4">
                    <Form.Item
                      name={`front_${index}`}
                      label="Front"
                      initialValue={flashcard.front}
                      rules={[{ required: true, message: 'Please enter front text' }]}
                    >
                      <Input.TextArea 
                        placeholder="Enter front text" 
                        rows={2}
                      />
                    </Form.Item>
                    
                    <Form.Item
                      name={`back_${index}`}
                      label="Back"
                      initialValue={flashcard.back}
                      rules={[{ required: true, message: 'Please enter back text' }]}
                    >
                      <Input.TextArea 
                        placeholder="Enter back text" 
                        rows={2}
                      />
                    </Form.Item>
                  </div>
                </Card>
              ))}
            </Form>

            <div className="!flex !gap-3 !justify-end">
              <Button 
                onClick={handleClose}
                className="!rounded-lg !h-10"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={handleSaveFlashcards}
                className="!bg-gradient-to-r !from-blue-600 !to-blue-500 !border-0 !text-white !rounded-lg !font-medium !h-10 !px-6 !hover:shadow-lg !transition-all"
              >
                Save Flashcards
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
