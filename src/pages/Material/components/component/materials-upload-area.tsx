"use client"

import { useState } from "react"
import { Upload, Button, message, Form, Input, Select, Card, Progress, Tag } from "antd"
import { InboxOutlined, FileTextOutlined, FileImageOutlined, FileOutlined } from "@ant-design/icons"
import type { UploadFile } from "antd"
import { usePdfUpload, getCurrentUserId } from "../../hooks/materialHooks"
import { StudyMaterial } from "../../types"
import { FILE_TYPES, UPLOAD_LIMITS} from "../../constants/index"
import { formatFileSize } from "../../utils"
interface MaterialsUploadAreaProps {
  onClose: () => void
}

export default function MaterialsUploadArea({ onClose }: MaterialsUploadAreaProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [form] = Form.useForm()
  
  const { uploadPdf } = usePdfUpload()

  const handleUpload = (info: any) => {
    let newFileList = [...info.fileList]
    
    if (newFileList.length > UPLOAD_LIMITS.MAX_FILES_PER_UPLOAD) {
      message.warning(`Maximum ${UPLOAD_LIMITS.MAX_FILES_PER_UPLOAD} files allowed`)
      newFileList = newFileList.slice(0, UPLOAD_LIMITS.MAX_FILES_PER_UPLOAD)
    }
    
    newFileList = newFileList.map(file => {
      if (file.size && file.size > UPLOAD_LIMITS.MAX_FILE_SIZE) {
        message.error(`File ${file.name} is too large. Maximum size is ${formatFileSize(UPLOAD_LIMITS.MAX_FILE_SIZE)}`)
        return { ...file, status: 'error' }
      }
      
      const extension = file.name?.split('.').pop()?.toLowerCase()
      if (extension && !UPLOAD_LIMITS.ALLOWED_EXTENSIONS.includes(`.${extension}` as any)) {
        message.error(`File ${file.name} has unsupported format`)
        return { ...file, status: 'error' }
      }
      
      return file
    }).filter(file => file.status !== 'error')
    
    setFileList(newFileList)
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName?.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return <FileTextOutlined className="!text-red-500" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImageOutlined className="!text-green-500" />
      default:
        return <FileOutlined className="!text-gray-500" />
    }
  }

  const getFileType = (fileName: string): StudyMaterial['type'] => {
    const extension = fileName?.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return 'pdf'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image'
      default:
        return 'document'
    }
  }

  // simple progress updater for UX (sets to 100% on completion)
  const markUploaded = (file: UploadFile) => {
    setUploadProgress(prev => ({ ...prev, [file.uid]: 100 }))
  }

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.error("Please select files to upload")
      return
    }

    try {
      setUploading(true)
      
      // Get form values
      const formValues = await form.validateFields()
      
      // Upload each file to Cloudinary via signed upload, then backend
      for (const file of fileList) {
        if (file.status === 'done') continue
        
        try {
          const raw = file.originFileObj as File | undefined
          if (!raw) {
            message.error(`Missing file content for ${file.name}`)
            continue
          }
          const userId = getCurrentUserId() || undefined
          await uploadPdf(raw, userId)
          markUploaded(file)
          
        } catch (error) {
          console.error('Upload error for file:', file.name, error)
          message.error(`Failed to upload ${file.name}`)
        }
      }
      
      message.success("Materials uploaded successfully")
      onClose()
      
    } catch (error) {
      console.error('Submit error:', error)
      message.error("Failed to upload materials")
    } finally {
      setUploading(false)
      setUploadProgress({})
    }
  }

  const removeFile = (file: UploadFile) => {
    setFileList(prev => prev.filter(f => f.uid !== file.uid))
    setUploadProgress(prev => {
      const newProgress = { ...prev }
      delete newProgress[file.uid]
      return newProgress
    })
  }

  return (
    <div className="!space-y-6 !py-8">
      <div>
        <h2 className="!text-2xl !font-bold !text-gray-900 !mb-2">Upload Study Materials</h2>
        <p className="!text-gray-600">Upload PDFs, documents, or images to create exercises</p>
      </div>

      <Form form={form} layout="vertical" className="!mb-6">
        <div className="!grid !grid-cols-1 !md:grid-cols-2 !gap-4">
          <Form.Item
            name="title"
            label="Default Title"
            rules={[{ required: true, message: 'Please enter a default title' }]}
          >
            <Input placeholder="Enter default title for materials" />
          </Form.Item>
          
          <Form.Item
            name="tags"
            label="Tags"
          >
            <Select
              mode="tags"
              placeholder="Enter tags (optional)"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </div>
        
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea 
            placeholder="Enter description (optional)" 
            rows={3}
          />
        </Form.Item>
      </Form>

      <Upload.Dragger
        multiple
        onChange={handleUpload}
        fileList={fileList}
        showUploadList={false}
        className="[&.ant-upload-drag]:!border-2 [&.ant-upload-drag]:!border-dashed [&.ant-upload-drag]:!border-gray-300 [&.ant-upload-drag]:!rounded-lg [&.ant-upload-drag]:!bg-gray-50 [&.ant-upload-drag:hover]:!border-blue-400 [&.ant-upload-drag:hover]:!bg-blue-50"
      >
        <p className="!ant-upload-drag-icon">
          <InboxOutlined className="!text-4xl !text-gray-400" />
        </p>
        <p className="!ant-upload-text !text-gray-900 !font-medium">Click or drag files here to upload</p>
        <p className="!ant-upload-hint !text-gray-500">
          Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG
        </p>
        <p className="!ant-upload-hint !text-gray-400 !text-sm">
          Maximum file size: {formatFileSize(UPLOAD_LIMITS.MAX_FILE_SIZE)} | Max files: {UPLOAD_LIMITS.MAX_FILES_PER_UPLOAD}
        </p>
      </Upload.Dragger>

      {/* File List */}
      {fileList.length > 0 && (
        <div className="!space-y-3">
          <h3 className="!text-lg !font-semibold !text-gray-900">Selected Files</h3>
          {fileList.map((file) => (
            <Card key={file.uid} size="small" className="!border !border-gray-200">
              <div className="!flex !items-center !justify-between">
                <div className="!flex !items-center !gap-3 !flex-1">
                  {getFileIcon(file.name || '')}
                  <div className="!flex-1">
                    <p className="!font-medium !text-gray-900 !mb-1">{file.name}</p>
                    <div className="!flex !items-center !gap-2">
                      <span className="!text-sm !text-gray-500">
                        {formatFileSize(file.size || 0)}
                      </span>
                      <Tag color="blue">
                        {getFileType(file.name || '')}
                      </Tag>
                    </div>
                  </div>
                </div>
                
                <div className="!flex !items-center !gap-2">
                  {uploadProgress[file.uid] !== undefined && (
                    <div className="!w-20">
                      <Progress 
                        percent={Math.round(uploadProgress[file.uid])} 
                        size="small"
                        status={uploadProgress[file.uid] === 100 ? 'success' : 'active'}
                      />
                    </div>
                  )}
                  
                  <Button
                    type="text"
                    size="small"
                    danger
                    onClick={() => removeFile(file)}
                    disabled={uploading}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </Card>
          ))}
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
          {uploading ? 'Uploading...' : 'Upload Materials'}
        </Button>
      </div>
    </div>
  )
}
