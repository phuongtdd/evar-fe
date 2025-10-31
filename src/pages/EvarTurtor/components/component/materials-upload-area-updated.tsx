import { useState, useEffect, useCallback } from "react"
import { Upload, Button, message, Form, Input, Select, Card, Progress, Tag, Alert, Modal, Slider, InputNumber, Space, Spin } from "antd"
import type { UploadFile } from "antd"
import { usePdfUpload, getCurrentUserId, knowledgeBaseService, flashcardService } from "../../hooks/evarTutorHooks"
import { CheckCircleOutlined, ExclamationCircleOutlined, FileTextOutlined, InboxOutlined, ThunderboltOutlined } from "@ant-design/icons"

interface MaterialsUploadAreaProps {
  onClose: () => void
  onUploaded?: (knowledgeBaseId: number) => void
  onRefetch?: () => void
  autoGenerateFlashcards?: boolean // New prop to control auto-generation
}

interface UploadStatus {
  file: UploadFile
  status: 'uploading' | 'processing' | 'ready' | 'error'
  knowledgeBaseId?: number
  error?: string
  fileName?: string
}

interface FlashcardGenerationRequest {
  knowledgeBaseId: number
  fileName: string
}

export default function MaterialsUploadArea({ onClose, onUploaded, onRefetch, autoGenerateFlashcards = false }: MaterialsUploadAreaProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([])
  const [form] = Form.useForm()
  const [generatingFlashcards, setGeneratingFlashcards] = useState<Record<number, boolean>>({})
  const [showFlashcardModal, setShowFlashcardModal] = useState(false)
  const [flashcardCount, setFlashcardCount] = useState(10)
  const [pendingGenerations, setPendingGenerations] = useState<FlashcardGenerationRequest[]>([])
  const [showUploadProgressModal, setShowUploadProgressModal] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState<'uploading' | 'processing' | 'completed'>('uploading')
  const [hasShownUploadSuccessMessage, setHasShownUploadSuccessMessage] = useState(false)
  
  const { uploadPdf, uploading, error } = usePdfUpload()
  

  const userId = getCurrentUserId() || undefined

  const formatFileSize = (bytes: number): string => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const handleUpload = (info: any) => {
    let newFileList = [...info.fileList]
    
    // Only allow PDF files
    newFileList = newFileList.map(file => {
      if (file.name && !file.name.toLowerCase().endsWith('.pdf')) {
        message.error(`File ${file.name} is not a PDF. Only PDF files are supported.`)
        return { ...file, status: 'error' }
      }
      
      if (file.size && file.size > 10 * 1024 * 1024) { // 10MB limit
        message.error(`File ${file.name} is too large. Maximum size is 10MB.`)
        return { ...file, status: 'error' }
      }
      
      return file
    }).filter(file => file.status !== 'error')
    
    setFileList(newFileList)
  }

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.error("Please select PDF files to upload")
      return
    }

    // Mở modal ngay khi click
    setShowUploadProgressModal(true)
    setOverallProgress(0)
    setCurrentStep('uploading')
    setUploadStatuses([])
    setHasShownUploadSuccessMessage(false)

    try {
      // Upload each PDF file
      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i]
        if (file.originFileObj) {
          try {
            // Cập nhật progress cho upload
            const uploadProgress = Math.round(((i) / fileList.length) * 50)
            setOverallProgress(uploadProgress)
            
            // Add to upload statuses
            const uploadStatus: UploadStatus = {
              file,
              status: 'uploading'
            }
            setUploadStatuses(prev => [...prev, uploadStatus])
            
            // Upload the file (không hiển thị message ở đây)
            const response = await uploadPdf(file.originFileObj, userId)
            
            // Update progress sau khi upload xong file này
            const uploadCompleteProgress = Math.round(((i + 1) / fileList.length) * 50)
            setOverallProgress(uploadCompleteProgress)
            
            // Update status to processing
            setUploadStatuses(prev => prev.map(status => 
              status.file.uid === file.uid 
                ? { ...status, status: 'processing', knowledgeBaseId: response.knowledgeBaseId, fileName: file.name }
                : status
            ))

            // Cache KB id temporarily (will be updated with full data when READY)
            try {
              if (userId && response.knowledgeBaseId) {
                const cacheKey = `evar_kb_cache_${userId}`
                const existing = JSON.parse(localStorage.getItem(cacheKey) || '[]') as any[]
                const newEntry = {
                  id: response.knowledgeBaseId,
                  fileName: file.name || `KB-${response.knowledgeBaseId}`,
                  fileUrl: response.fileUrl || null,
                  status: 'PROCESSING',
                  createdAt: new Date().toISOString(),
                }
                const merged = [newEntry, ...existing.filter(e => e.id !== newEntry.id)]
                localStorage.setItem(cacheKey, JSON.stringify(merged))
                console.log('📝 Temporary cache entry created for KB:', response.knowledgeBaseId)
              }
            } catch {}
            
          } catch (error) {
            console.error('Upload error for file:', file.name, error)
            setUploadStatuses(prev => prev.map(status => 
              status.file.uid === file.uid 
                ? { ...status, status: 'error', error: error instanceof Error ? error.message : 'Upload failed' }
                : status
            ))
          }
        }
      }
      
      // Tất cả files đã upload xong, chuyển sang processing
      setCurrentStep('processing')
      setOverallProgress(50)
      
    } catch (error) {
      console.error('Submit error:', error)
      message.error("Failed to upload files")
      setShowUploadProgressModal(false)
    }
  }

  // Tính toán overall progress dựa trên uploadStatuses
  useEffect(() => {
    if (!showUploadProgressModal || uploadStatuses.length === 0) return
    
    const totalFiles = uploadStatuses.length
    const readyFiles = uploadStatuses.filter(s => s.status === 'ready').length
    const errorFiles = uploadStatuses.filter(s => s.status === 'error').length
    const processingFiles = uploadStatuses.filter(s => s.status === 'processing').length
    const uploadingFiles = uploadStatuses.filter(s => s.status === 'uploading').length
    
    // Tính progress: 0-50% cho upload, 50-100% cho processing
    let progress = 0
    
    if (uploadingFiles > 0) {
      // Vẫn đang upload
      const uploadedCount = totalFiles - uploadingFiles
      progress = Math.round((uploadedCount / totalFiles) * 50)
    } else {
      // Đã upload xong, đang processing
      progress = 50 + Math.round((readyFiles / totalFiles) * 50)
      
      if (progress > 100) progress = 100
    }
    
    setOverallProgress(progress)
    
    // Kiểm tra nếu TẤT CẢ files đã hoàn thành (ready hoặc error)
    const allCompleted = totalFiles > 0 && (readyFiles + errorFiles) === totalFiles
    
    if (allCompleted && currentStep !== 'completed') {
      setCurrentStep('completed')
      setOverallProgress(100)
      
      // Đợi một chút để hiển thị 100% và đóng modal
      setTimeout(() => {
        setShowUploadProgressModal(false)
        
        // Hiển thị message thành công chỉ 1 lần sau khi đóng modal
        if (!hasShownUploadSuccessMessage && readyFiles > 0) {
          const successMessage = readyFiles === 1 
            ? `Đã tải và xử lý thành công: ${uploadStatuses.find(s => s.status === 'ready')?.fileName}`
            : `Đã tải và xử lý thành công ${readyFiles} file PDF`
          setTimeout(() => {
            message.success(successMessage)
            setHasShownUploadSuccessMessage(true)
          }, 300)
        }
      }, 800)
    }
  }, [uploadStatuses, showUploadProgressModal, currentStep, hasShownUploadSuccessMessage])

  // Polling logic using useEffect
  useEffect(() => {
    const pollingIntervals: { [key: string]: NodeJS.Timeout } = {}
    
    uploadStatuses.forEach(status => {
      if (status.status === 'processing' && status.knowledgeBaseId) {
        const kbId = status.knowledgeBaseId
        const fileUid = status.file.uid
        
        // Start polling for this file
        const pollStatus = async () => {
          try {
            const kbStatus = await knowledgeBaseService.getKnowledgeBaseStatus(kbId)
            
            if (kbStatus.status === 'READY') {
              // Update to ready
              setUploadStatuses(prev => prev.map(u => 
                u.file.uid === fileUid ? { ...u, status: 'ready' } : u
              ))
              // KHÔNG hiển thị message ở đây, sẽ hiển thị sau khi TẤT CẢ files xong
              
              // Fetch latest KB detail to ensure fresh data
              try {
                console.log('📥 Fetching latest KB detail for ID:', kbId)
                const latestKB = await knowledgeBaseService.getKnowledgeBaseDetail(kbId)
                
                // Update cache with fresh data from server
                if (userId) {
                  const cacheKey = `evar_kb_cache_${userId}`
                  const existing = JSON.parse(localStorage.getItem(cacheKey) || '[]') as any[]
                  const updatedEntry = {
                    id: latestKB.id,
                    fileName: latestKB.fileName,
                    fileUrl: latestKB.fileUrl,
                    status: latestKB.status,
                    createdAt: latestKB.createdAt,
                  }
                  const merged = [updatedEntry, ...existing.filter(e => e.id !== latestKB.id)]
                  localStorage.setItem(cacheKey, JSON.stringify(merged))
                  console.log('✅ Cache updated with latest KB data:', updatedEntry)
                }
              } catch (error) {
                console.error('Failed to fetch latest KB detail:', error)
              }
              
              // Không hiển thị pop-up flashcard tự động sau khi upload
              // User có thể tạo flashcard thủ công nếu muốn
              
              // Delay to ensure backend has committed all data
              console.log('⏳ Waiting for backend to commit all data...')
              await new Promise(resolve => setTimeout(resolve, 1500))
              
              // Refresh KB list first to get latest data
              console.log('🔄 Triggering knowledge base data refresh...')
              if (onRefetch) {
                try {
                  await onRefetch();
                  console.log('✅ Knowledge base data refreshed successfully');
                } catch (error) {
                  console.error('❌ Failed to refresh knowledge base data:', error);
                }
              } else {
                console.warn('⚠️ onRefetch callback is not provided!');
              }
              
              // Notify parent with the KB ID to auto-select it
              console.log('📢 Notifying parent component with KB ID:', kbId)
              if (onUploaded) {
                onUploaded(kbId);
                console.log('✅ Parent notified successfully');
              } else {
                console.warn('⚠️ onUploaded callback is not provided!');
              }
              
              // Clear interval
              if (pollingIntervals[fileUid]) {
                clearInterval(pollingIntervals[fileUid])
                delete pollingIntervals[fileUid]
              }
            } else if (kbStatus.status === 'FAILED') {
              // Update to error
              setUploadStatuses(prev => prev.map(u => 
                u.file.uid === fileUid ? { ...u, status: 'error', error: 'Processing failed' } : u
              ))
              message.error(`Failed to process file ${status.file.name}`)
              
              // Clear interval
              if (pollingIntervals[fileUid]) {
                clearInterval(pollingIntervals[fileUid])
                delete pollingIntervals[fileUid]
              }
            }
          } catch (error) {
            console.error('Polling error:', error)
          }
        }
        
        // Poll every 2 seconds if not already polling
        if (!pollingIntervals[fileUid]) {
          pollingIntervals[fileUid] = setInterval(pollStatus, 2000)
          pollStatus() // Call immediately
        }
      }
    })
    
    // Cleanup on unmount
    return () => {
      Object.values(pollingIntervals).forEach(interval => clearInterval(interval))
    }
  }, [uploadStatuses, onUploaded, onRefetch, autoGenerateFlashcards, generatingFlashcards])

  const removeFile = (file: UploadFile) => {
    setFileList(prev => prev.filter(f => f.uid !== file.uid))
    setUploadStatuses(prev => prev.filter(status => status.file.uid !== file.uid))
  }

  const getStatusIcon = (status: UploadStatus['status']) => {
    switch (status) {
      case 'uploading':
        return <Progress type="circle" size={20} percent={50} />
      case 'processing':
        return <Progress type="circle" size={20} percent={75} />
      case 'ready':
        return <CheckCircleOutlined className="!text-green-500" />
      case 'error':
        return <ExclamationCircleOutlined className="!text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: UploadStatus['status']) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...'
      case 'processing':
        return 'Processing...'
      case 'ready':
        return 'Ready'
      case 'error':
        return 'Error'
      default:
        return 'Pending'
    }
  }

  const allFilesProcessed = uploadStatuses.length > 0 && uploadStatuses.every(status => 
    status.status === 'ready' || status.status === 'error'
  )

  return (
    <div className="!space-y-6 !py-8">
      <div>
        <h2 className="!text-2xl !font-bold !text-gray-900 !mb-2">Upload PDF Documents</h2>
        <p className="!text-gray-600">Upload PDF files to create knowledge base for AI tutoring</p>
      </div>

      <Alert
        message="PDF Upload Information"
        description="Only PDF files are supported. After processing, you'll choose how many flashcards to generate. Maximum file size is 10MB."
        type="info"
        showIcon
        className="!mb-6"
      />

      <Form form={form} layout="vertical" className="!mb-6">
        <Form.Item
          name="description"
          label="Description (Optional)"
        >
          <Input.TextArea 
            placeholder="Enter description for your documents" 
            rows={3}
          />
        </Form.Item>
      </Form>

      <Upload.Dragger
        multiple
        onChange={handleUpload}
        fileList={fileList}
        showUploadList={false}
        accept=".pdf"
        beforeUpload={() => false}
        className="[&.ant-upload-drag]:!border-2 [&.ant-upload-drag]:!border-dashed [&.ant-upload-drag]:!border-gray-300 [&.ant-upload-drag]:!rounded-lg [&.ant-upload-drag]:!bg-gray-50 [&.ant-upload-drag:hover]:!border-blue-400 [&.ant-upload-drag:hover]:!bg-blue-50"
      >
        <p className="!ant-upload-drag-icon">
          <InboxOutlined className="!text-4xl !text-gray-400" />
        </p>
        <p className="!ant-upload-text !text-gray-900 !font-medium">Click or drag PDF files here to upload</p>
        <p className="!ant-upload-hint !text-gray-500">
          Supported format: PDF only
        </p>
        <p className="!ant-upload-hint !text-gray-400 !text-sm">
          Maximum file size: 10MB
        </p>
      </Upload.Dragger>

      {/* File List */}
      {fileList.length > 0 && (
        <div className="!space-y-3">
          <h3 className="!text-lg !font-semibold !text-gray-900">Selected Files</h3>
          {fileList.map((file) => {
            const uploadStatus = uploadStatuses.find(status => status.file.uid === file.uid)
            return (
              <Card key={file.uid} size="small" className="!border !border-gray-200">
                <div className="!flex !items-center !justify-between">
                  <div className="!flex !items-center !gap-3 !flex-1">
                    <FileTextOutlined className="!text-red-500" />
                    <div className="!flex-1">
                      <p className="!font-medium !text-gray-900 !mb-1">{file.name}</p>
                      <div className="!flex !items-center !gap-2">
                        <span className="!text-sm !text-gray-500">
                          {formatFileSize(file.size || 0)}
                        </span>
                        <Tag color="red">PDF</Tag>
                        {uploadStatus && (
                          <Tag color={
                            uploadStatus.status === 'ready' ? 'green' :
                            uploadStatus.status === 'error' ? 'red' :
                            uploadStatus.status === 'processing' ? 'blue' : 'default'
                          }>
                            {getStatusText(uploadStatus.status)}
                          </Tag>
                        )}
                      </div>
                      {uploadStatus?.error && (
                        <p className="!text-sm !text-red-500 !mt-1">{uploadStatus.error}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="!flex !items-center !gap-2">
                    {uploadStatus && getStatusIcon(uploadStatus.status)}
                    
                    <Button
                      type="text"
                      size="small"
                      danger
                      onClick={() => removeFile(file)}
                      disabled={uploading || uploadStatus?.status === 'processing'}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <div className="!flex !gap-3 !justify-end !mt-4">
        <Button 
          onClick={onClose} 
          className="!rounded-lg !h-10"
          disabled={uploading}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleSubmit}
          loading={uploading}
          disabled={fileList.length === 0}
          className="!bg-blue-600 !border-0 !rounded-lg !h-10 !px-6 hover:!bg-blue-700 !text-white"
        >
          {uploading ? 'Uploading...' : 'Upload PDFs'}
        </Button>
      </div>

      {allFilesProcessed && pendingGenerations.length === 0 && (
        <div className="!mt-4">
          <Button
            type="primary"
            onClick={onClose}
            className="!bg-green-600 !border-0 !rounded-lg !h-10 !px-6 hover:!bg-green-700 !text-white"
          >
            Continue to Study Materials
          </Button>
        </div>
      )}

      {/* Upload Progress Modal */}
      <Modal
        open={showUploadProgressModal}
        closable={false}
        maskClosable={false}
        footer={null}
        centered
        width={380}
        className="upload-progress-modal"
        styles={{
          body: { padding: '32px 24px' }
        }}
      >
        <div className="!flex !flex-col !items-center !justify-center">
          <Progress 
            type="circle"
            percent={overallProgress} 
            status={currentStep === 'completed' ? "success" : "active"}
            strokeColor={{
              '0%': '#1890ff',
              '100%': '#52c41a',
            }}
            format={(percent) => `${percent}%`}
            size={120}
          />
          <div className="!mt-6 !text-center">
            <p className="!text-base !font-medium !text-gray-800 !mb-1">
              {currentStep === 'uploading' && 'Đang tải PDF lên...'}
              {currentStep === 'processing' && 'Đang xử lý PDF...'}
              {currentStep === 'completed' && 'Hoàn tất!'}
            </p>
            <p className="!text-sm !text-gray-500">
              {uploadStatuses.length > 0 && (
                <>
                  {uploadStatuses.filter(s => s.status === 'ready').length} / {uploadStatuses.length} file đã sẵn sàng
                </>
              )}
            </p>
          </div>
        </div>
      </Modal>

      {/* Flashcard Generation Modal */}
      <Modal
        open={showFlashcardModal}
        onCancel={() => {
          setShowFlashcardModal(false)
          setPendingGenerations([])
          setFlashcardCount(10)
        }}
        footer={null}
        width={600}
        centered
        className="flashcard-generation-modal"
      >
        <div className="!space-y-6 !py-4">
          <div className="!text-center">
            <div className="!inline-flex !items-center !justify-center !w-16 !h-16 !bg-gradient-to-br !from-blue-500 !to-purple-600 !rounded-full !mb-4">
              <ThunderboltOutlined className="!text-3xl !text-white" />
            </div>
            <h2 className="!text-2xl !font-bold !text-gray-900 !mb-2">
              Generate AI Flashcards
            </h2>
            <p className="!text-gray-600">
              Your PDF has been uploaded successfully! Now choose how many flashcards you'd like to generate.
            </p>
          </div>

          {pendingGenerations.length > 0 && (
            <div className="!bg-blue-50 !border !border-blue-200 !rounded-lg !p-4">
              <p className="!text-sm !font-medium !text-blue-900 !mb-2">Files ready for flashcard generation:</p>
              <div className="!space-y-1">
                {pendingGenerations.map((gen, idx) => (
                  <div key={idx} className="!flex !items-center !gap-2 !text-sm !text-blue-800">
                    <FileTextOutlined />
                    <span className="!font-medium">{gen.fileName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="!space-y-4">
            <div>
              <label className="!block !text-sm !font-semibold !text-gray-700 !mb-3">
                Number of Flashcards
              </label>
              <div className="!space-y-4">
                <Slider
                  min={1}
                  max={15}
                  value={flashcardCount}
                  onChange={(value) => setFlashcardCount(value)}
                  marks={{ 1: '1', 5: '5', 10: '10', 15: '15' }}
                  className="!mb-2"
                />
                <div className="!flex !items-center !justify-between">
                  <span className="!text-sm !text-gray-600">Adjust the slider or enter a number</span>
                  <InputNumber
                    min={1}
                    max={15}
                    value={flashcardCount}
                    onChange={(value) => setFlashcardCount(value ? Math.max(1, Math.min(15, value)) : 10)}
                    className="!w-24"
                    size="large"
                  />
                </div>
              </div>
            </div>

            <div className="!bg-gradient-to-r !from-purple-50 !to-blue-50 !border !border-purple-200 !rounded-lg !p-4">
              <div className="!flex !items-start !gap-3">
                <div className="!flex-shrink-0 !mt-0.5">
                  <div className="!w-8 !h-8 !bg-purple-500 !rounded-full !flex !items-center !justify-center">
                    <span className="!text-white !font-bold">💡</span>
                  </div>
                </div>
                <div>
                  <h4 className="!font-semibold !text-purple-900 !mb-1">Recommendation</h4>
                  <p className="!text-sm !text-purple-800">
                    We recommend starting with <strong>10-20 flashcards</strong> for optimal learning. You can always generate more later!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="!flex !gap-3 !justify-end !pt-4 !border-t !border-gray-200">
            <Button
              size="large"
              onClick={() => {
                setShowFlashcardModal(false)
                setPendingGenerations([])
                setFlashcardCount(10)
                message.info('Flashcard generation skipped. You can generate them later from the Flashcards tab.')
                onClose()
              }}
              className="!rounded-lg !h-11 !px-6"
            >
              Skip for Now
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<ThunderboltOutlined />}
              loading={Object.values(generatingFlashcards).some(v => v)}
              onClick={async () => {
                for (const gen of pendingGenerations) {
                  setGeneratingFlashcards(prev => ({ ...prev, [gen.knowledgeBaseId]: true }))
                  try {
                    const count = Math.max(1, Math.min(15, flashcardCount))
                    console.log('🤖 Starting flashcard generation for KB:', gen.knowledgeBaseId, 'count:', count)
                    message.info(`Generating ${count} flashcards for ${gen.fileName}...`)
                    const flashcardSet = await flashcardService.generateFlashcards(gen.knowledgeBaseId, count)
                    console.log('✅ Flashcard generation complete:', flashcardSet)
                    const generated = flashcardSet?.flashcards?.length || flashcardSet?.totalCards || count
                    message.success(`${generated} flashcards generated for ${gen.fileName}!`)
                    
                    // Delay to ensure backend has committed all data
                    await new Promise(resolve => setTimeout(resolve, 1500))
                    
                    // Refresh data
                    if (onRefetch) {
                      await onRefetch()
                    }
                    
                    // Notify parent
                    if (onUploaded) {
                      onUploaded(gen.knowledgeBaseId)
                    }
                  } catch (error: any) {
                    console.error('❌ Flashcard generation failed:', error)
                    message.error(`Failed to generate flashcards: ${error.response?.data?.message || error.message}`)
                  } finally {
                    setGeneratingFlashcards(prev => ({ ...prev, [gen.knowledgeBaseId]: false }))
                  }
                }
                
                setShowFlashcardModal(false)
                setPendingGenerations([])
                setFlashcardCount(10)
                onClose()
                // Ensure UI reflects latest generated data
                setTimeout(() => {
                  window.location.reload();
                }, 300);
              }}
              className="!bg-gradient-to-r !from-blue-600 !to-purple-600 !border-0 !rounded-lg !h-11 !px-8 hover:!from-blue-700 hover:!to-purple-700 !text-white !font-semibold !shadow-lg"
            >
              Generate {flashcardCount} Flashcards
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
