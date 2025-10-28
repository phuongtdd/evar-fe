"use client"

import { useState } from "react"
import { Button, Spin, Empty, Space, Tooltip, Input, Card, Select, Tag } from "antd"
import {
  LeftOutlined,
  RightOutlined,
  ExpandOutlined,
  CompressOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FileTextOutlined,
  DownloadOutlined,
} from "@ant-design/icons"

interface KnowledgeBase {
  id: number
  fileName: string
  fileUrl?: string
  status: string
  createdAt: string
}

interface PdfViewerUpdatedProps {
  knowledgeBases: KnowledgeBase[]
  loading?: boolean
}

export default function PdfViewerUpdated({ knowledgeBases, loading }: PdfViewerUpdatedProps) {
  const [selectedKB, setSelectedKB] = useState<KnowledgeBase | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [pdfLoading, setPdfLoading] = useState(false)

  const totalPages = 10 // This would come from PDF metadata in real implementation

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50))
  }

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const handleDownload = () => {
    if (selectedKB?.fileUrl) {
      window.open(selectedKB.fileUrl, '_blank')
    }
  }

  const handleSelectKB = (kb: KnowledgeBase) => {
    setSelectedKB(kb)
    setCurrentPage(1)
    setZoomLevel(100)
  }

  // No KB selected - show selection grid
  if (!selectedKB) {
    return (
      <div className="!h-full !p-6">
        <div className="!mb-6">
          <h4 className="!text-lg !font-semibold !text-gray-900 !mb-2">Select a PDF to View</h4>
          <p className="!text-sm !text-gray-500">Choose from your uploaded knowledge bases</p>
        </div>

        {loading ? (
          <div className="!flex !justify-center !items-center !py-12">
            <Spin size="large" />
          </div>
        ) : knowledgeBases.length === 0 ? (
          <div className="!text-center !py-12">
            <Empty description="No PDFs uploaded yet" />
          </div>
        ) : (
          <div className="!grid !grid-cols-1 !md:grid-cols-2 !lg:grid-cols-3 !gap-4">
            {knowledgeBases.map((kb) => (
              <Card
                key={kb.id}
                hoverable
                className="!border !border-gray-200 !rounded-lg !shadow-sm !hover:shadow-lg !transition-all !cursor-pointer"
                onClick={() => handleSelectKB(kb)}
              >
                <div className="!flex !flex-col !h-full">
                  <div className="!flex !items-start !gap-3 !mb-3">
                    <div className="!w-12 !h-12 !bg-red-100 !rounded-lg !flex !items-center !justify-center !shrink-0">
                      <FileTextOutlined className="!text-2xl !text-red-600" />
                    </div>
                    <div className="!flex-1 !min-w-0">
                      <h5 className="!font-semibold !text-gray-900 !mb-1 !line-clamp-2">
                        {kb.fileName}
                      </h5>
                      <p className="!text-xs !text-gray-500">
                        {new Date(kb.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="!mt-auto !pt-3 !border-t !border-gray-100">
                    <div className="!flex !items-center !justify-between">
                      <Tag color={kb.status === 'READY' ? 'green' : 'orange'}>
                        {kb.status}
                      </Tag>
                      <span className="!text-xs !text-blue-600 !font-medium">
                        Click to view →
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    )
  }

  // PDF Viewer with selected KB
  const pdfViewerContent = (
    <div className="!flex !flex-col !h-full !bg-gray-50">
      {/* PDF Header */}
      <div className="!flex !items-center !justify-between !px-4 !py-3 !border-b !border-gray-200 !bg-white">
        <div className="!flex !items-center !gap-3">
          <Button
            icon={<LeftOutlined />}
            onClick={() => setSelectedKB(null)}
            className="!text-gray-600"
          >
            Back
          </Button>
          <div>
            <h3 className="!text-gray-900 !font-semibold !line-clamp-1">{selectedKB.fileName}</h3>
            <p className="!text-xs !text-gray-500">Page {currentPage} of {totalPages}</p>
          </div>
        </div>
        <Button
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          className="!text-gray-600"
        >
          Download
        </Button>
      </div>

      {/* PDF Viewer Area */}
      <div className="!flex-1 !overflow-auto !flex !items-center !justify-center !bg-gray-100 !p-4">
        {pdfLoading ? (
          <Spin size="large" />
        ) : selectedKB.fileUrl ? (
          <iframe
            src={`${selectedKB.fileUrl}#page=${currentPage}`}
            className="!w-full !h-full !border-0 !rounded-lg !shadow-lg !bg-white"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'center top',
              maxWidth: '900px',
            }}
            title={selectedKB.fileName}
          />
        ) : (
          <div className="!text-center">
            <Empty description="PDF file not available" />
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="!flex !items-center !justify-between !px-4 !py-3 !border-t !border-gray-200 !bg-white">
        <Button
          icon={<LeftOutlined />}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="!text-gray-600"
        >
          Previous
        </Button>

        <Space>
          <div className="!flex !items-center !gap-2">
            <Input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = Number.parseInt(e.target.value, 10)
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page)
                }
              }}
              className="!w-16 !text-center"
            />
            <span className="!text-gray-600">/ {totalPages}</span>
          </div>

          <Tooltip title="Zoom In">
            <Button
              icon={<ZoomInOutlined />}
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              size="small"
              className="!text-gray-600"
            />
          </Tooltip>

          <span className="!text-sm !text-gray-600">{zoomLevel}%</span>

          <Tooltip title="Zoom Out">
            <Button
              icon={<ZoomOutOutlined />}
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              size="small"
              className="!text-gray-600"
            />
          </Tooltip>

          <Tooltip title={isFullScreen ? "Exit Full Screen" : "Full Screen"}>
            <Button
              icon={isFullScreen ? <CompressOutlined /> : <ExpandOutlined />}
              onClick={handleFullScreen}
              size="small"
              className="!text-gray-600"
            />
          </Tooltip>
        </Space>

        <Button
          icon={<RightOutlined />}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="!text-gray-600"
        >
          Next
        </Button>
      </div>
    </div>
  )

  if (isFullScreen) {
    return (
      <div className="!fixed !inset-0 !z-50 !bg-black">
        {pdfViewerContent}
      </div>
    )
  }

  return pdfViewerContent
}
