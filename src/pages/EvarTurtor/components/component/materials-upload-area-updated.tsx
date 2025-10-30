import { useState, useEffect, useCallback } from "react"
import { Upload, Button, message, Form, Input, Select, Card, Progress, Tag, Alert } from "antd"
import type { UploadFile } from "antd"
import { usePdfUpload, getCurrentUserId, knowledgeBaseService, flashcardService } from "../../hooks/evarTutorHooks"
import { CheckCircleOutlined, ExclamationCircleOutlined, FileTextOutlined, InboxOutlined } from "@ant-design/icons"

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
}

export default function MaterialsUploadArea({ onClose, onUploaded, onRefetch, autoGenerateFlashcards = true }: MaterialsUploadAreaProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([])
  const [form] = Form.useForm()
  const [generatingFlashcards, setGeneratingFlashcards] = useState<Record<number, boolean>>({})
  
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

    try {
      // Upload each PDF file
      for (const file of fileList) {
        if (file.originFileObj) {
          try {
            // Add to upload statuses
            const uploadStatus: UploadStatus = {
              file,
              status: 'uploading'
            }
            setUploadStatuses(prev => [...prev, uploadStatus])
            
            // Upload the file
            const response = await uploadPdf(file.originFileObj, userId)
            
            // Update status to processing
            setUploadStatuses(prev => prev.map(status => 
              status.file.uid === file.uid 
                ? { ...status, status: 'processing', knowledgeBaseId: response.knowledgeBaseId }
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
      
    } catch (error) {
      console.error('Submit error:', error)
      message.error("Failed to upload files")
    }
  }

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
              message.success(`File ${status.file.name} processed successfully!`)
              
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
              
              // Auto-generate flashcards if enabled
              let flashcardsGenerated = false;
              if (autoGenerateFlashcards && !generatingFlashcards[kbId]) {
                setGeneratingFlashcards(prev => ({ ...prev, [kbId]: true }))
                try {
                  console.log('🤖 Starting flashcard generation for KB:', kbId);
                  message.info(`Generating flashcards for ${status.file.name}...`)
                  const flashcardSet = await flashcardService.generateFlashcards(kbId, 10)
                  console.log('✅ Flashcard generation complete:', flashcardSet)
                  const count = flashcardSet?.flashcards?.length || flashcardSet?.totalCards || 10;
                  message.success(`${count} flashcards generated for ${status.file.name}!`)
                  flashcardsGenerated = true;
                } catch (error: any) {
                  console.error('❌ Flashcard generation failed:', error)
                  console.error('Error details:', error.response?.data || error.message)
                  message.error(`Failed to generate flashcards: ${error.response?.data?.message || error.message}`)
                } finally {
                  setGeneratingFlashcards(prev => ({ ...prev, [kbId]: false }))
                }
              }
              
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
        description="Only PDF files are supported. Files will be processed to extract text and create flashcards automatically. Maximum file size is 10MB."
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

      {allFilesProcessed && (
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
    </div>
  )
}
