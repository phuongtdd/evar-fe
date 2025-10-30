"use client"

import { useState, useEffect } from "react"
import { Modal, Button, Select, Alert, Form, Input, Card, Tag, Spin, message } from "antd"
import { UploadOutlined, ExclamationCircleOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons"
import { useMaterials, useFlashcardsLegacy } from "../../hooks/evarTutorHooks"
import { StudyMaterial, Flashcard } from "../../types"
import { DIFFICULTY_LABELS } from "../../constants"

interface CreateFlashcardsModalProps {
  open: boolean
  onClose: () => void
}

export default function CreateFlashcardsModal({ open, onClose }: CreateFlashcardsModalProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null)
  const [showError, setShowError] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Omit<Flashcard, 'id' | 'createdAt' | 'reviewCount' | 'successRate'>[]>([])
  const [form] = Form.useForm()
  
  const { data: materialsData, loading: materialsLoading } = useMaterials()
  const { createFlashcard } = useFlashcardsLegacy()

  const materials = materialsData?.data || []

  const handleCreateFlashcards = async () => {
    if (!selectedMaterial) {
      setShowError(true)
      return
    }
    // Remove mock generation: just prepare one empty flashcard for manual input
    const material = materials.find(m => m.id === selectedMaterial)
    if (!material) return
    const newFlashcard: Omit<Flashcard, 'id' | 'createdAt' | 'reviewCount' | 'successRate'> = {
      front: '',
      back: '',
      materialId: material.id,
      materialTitle: material.title,
      difficulty: 'easy',
      tags: []
    }
    setGeneratedFlashcards([newFlashcard])
  }

  const handleSaveFlashcards = async () => {
    try {
      const formValues = await form.validateFields()
      
      for (const flashcard of generatedFlashcards) {
        const flashcardData = {
          ...flashcard,
          front: formValues[`front_${generatedFlashcards.indexOf(flashcard)}`] || flashcard.front,
          back: formValues[`back_${generatedFlashcards.indexOf(flashcard)}`] || flashcard.back,
          difficulty: formValues[`difficulty_${generatedFlashcards.indexOf(flashcard)}`] || flashcard.difficulty,
          tags: formValues[`tags_${generatedFlashcards.indexOf(flashcard)}`] || flashcard.tags
        }
        
        await createFlashcard(flashcardData)
      }
      
      message.success('Flashcards created successfully!')
      onClose()
      resetForm()
      
    } catch (error) {
      console.error('Save error:', error)
      message.error('Failed to save flashcards')
    }
  }

  const resetForm = () => {
    setSelectedMaterial(null)
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
    const newFlashcard: Omit<Flashcard, 'id' | 'createdAt' | 'reviewCount' | 'successRate'> = {
      front: '',
      back: '',
      materialId: selectedMaterial || '',
      materialTitle: materials.find(m => m.id === selectedMaterial)?.title || '',
      difficulty: 'easy',
      tags: []
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
              <label className="!block !text-sm !font-medium !text-gray-900 !mb-3">Select Study Material:</label>
              <Select
                placeholder="Choose a study material"
                value={selectedMaterial}
                onChange={(value) => {
                  setSelectedMaterial(value)
                  setShowError(false)
                }}
                className="!w-full [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-gray-300 [&_.ant-select-selector]:!h-10"
                loading={materialsLoading}
                options={materials.map(material => ({
                  label: material.title,
                  value: material.id
                }))}
              />
            </div>

            {showError && (
              <Alert
                message="You must select a study material."
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
              disabled={!selectedMaterial}
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
                  
                  <div className="!grid !grid-cols-1 !md:grid-cols-2 !gap-4">
                    <Form.Item
                      name={`difficulty_${index}`}
                      label="Difficulty"
                      initialValue={flashcard.difficulty}
                    >
                      <Select placeholder="Select difficulty">
                        <Select.Option value="easy">Easy</Select.Option>
                        <Select.Option value="medium">Medium</Select.Option>
                        <Select.Option value="hard">Hard</Select.Option>
                      </Select>
                    </Form.Item>
                    
                    <Form.Item
                      name={`tags_${index}`}
                      label="Tags"
                      initialValue={flashcard.tags}
                    >
                      <Select
                        mode="tags"
                        placeholder="Enter tags"
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </div>
                  
                  <div className="!flex !items-center !gap-2 !mt-2">
                    <Tag color="blue">{DIFFICULTY_LABELS[flashcard.difficulty]}</Tag>
                    {flashcard.tags.map(tag => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
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
