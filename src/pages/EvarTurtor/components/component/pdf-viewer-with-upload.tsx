"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import { Button, Spin, Empty, Space, Tooltip, Input, Card, Tag, Upload, message } from "antd"
import {
  LeftOutlined,
  RightOutlined,
  ExpandOutlined,
  CompressOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FileTextOutlined,
  DownloadOutlined,
  UploadOutlined,
  CloseOutlined,
} from "@ant-design/icons"
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Configure PDF.js worker - Use worker from public folder
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs'

interface KnowledgeBase {
  id: number
  fileName: string
  fileUrl?: string
  status: string
  createdAt: string
}

interface PdfViewerWithUploadProps {
  knowledgeBases: KnowledgeBase[]
  loading?: boolean
  selectedKnowledgeBaseId?: number
  targetPage?: number | null
  highlightText?: string | null
  onPageChanged?: () => void
}

export default function PdfViewerWithUpload({ knowledgeBases, loading, selectedKnowledgeBaseId, targetPage, highlightText, onPageChanged }: PdfViewerWithUploadProps) {
  const [selectedKB, setSelectedKB] = useState<KnowledgeBase | null>(null)
  const [localFile, setLocalFile] = useState<File | null>(null)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [numPages, setNumPages] = useState<number>(0)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1.0)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pageRendering, setPageRendering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pageContainerRef = useRef<HTMLDivElement>(null)

  const handleSelectKB = async (kb: KnowledgeBase) => {
    console.log('📄 Selected Knowledge Base:', {
      id: kb.id,
      fileName: kb.fileName,
      fileUrl: kb.fileUrl,
      status: kb.status,
      hasFileUrl: !!kb.fileUrl,
      fileUrlType: typeof kb.fileUrl
    })
    
    setPdfLoading(true)
    setSelectedKB(kb)
    setLocalFile(null)
    setPdfBlob(null)
    setCurrentPage(1)
    setNumPages(0)
    setZoomLevel(1.0)

    // Fetch PDF as blob to avoid CORS/401 issues
    if (kb.fileUrl) {
      try {
        console.log('📥 Fetching PDF as blob from:', kb.fileUrl)
        
        const response = await fetch(kb.fileUrl, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Accept': 'application/pdf'
          }
        })

        console.log('📡 Fetch response:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const blob = await response.blob()
        console.log('✅ PDF blob created:', {
          size: blob.size,
          type: blob.type
        })
        
        setPdfBlob(blob)
      } catch (error) {
        console.error('❌ Failed to fetch PDF:', error)
        message.error('Failed to load PDF: ' + (error instanceof Error ? error.message : 'Unknown error'))
        setPdfLoading(false)
      }
    }
  }

  // Auto-select KB when selectedKnowledgeBaseId is provided
  useEffect(() => {
    if (selectedKnowledgeBaseId && knowledgeBases.length > 0) {
      const kb = knowledgeBases.find(k => k.id === selectedKnowledgeBaseId)
      if (kb && (!selectedKB || selectedKB.id !== kb.id)) {
        handleSelectKB(kb)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKnowledgeBaseId, knowledgeBases])

  // Jump to target page when provided from keynote click
  useEffect(() => {
    if (targetPage !== null && targetPage !== undefined && numPages > 0) {
      console.log('🎯 Jumping to target page:', targetPage);
      if (targetPage >= 1 && targetPage <= numPages) {
        setCurrentPage(targetPage);
        setPageRendering(true);
        message.success(`Jumped to page ${targetPage}`);
      } else {
        message.warning(`Page ${targetPage} is out of range (1-${numPages})`);
      }
    }
  }, [targetPage, numPages])

  // Highlight text after page is rendered
  useEffect(() => {
    if (!highlightText || pageRendering) return;

    const highlightTextInPDF = () => {
      try {
        // Wait a bit for text layer to be fully rendered
        setTimeout(() => {
          const textLayer = pageContainerRef.current?.querySelector('.react-pdf__Page__textContent');
          if (!textLayer) {
            console.log('⚠️ Text layer not found yet');
            return;
          }

          // Remove previous highlights
          const oldHighlights = textLayer.querySelectorAll('.keynote-highlight');
          oldHighlights.forEach(el => {
            const parent = el.parentNode;
            if (parent) {
              parent.replaceChild(document.createTextNode(el.textContent || ''), el);
            }
          });

          // Clean and prepare search text
          const searchText = highlightText
            .replace(/\*\*/g, '') // Remove markdown bold
            .replace(/\s+/g, ' ')  // Normalize whitespace
            .trim()
            .substring(0, 150); // Use first 150 chars for better matching

          console.log('🔍 Searching for text:', searchText);

          // Get all text spans in the text layer
          const textSpans = Array.from(textLayer.querySelectorAll('span'));
          let found = false;

          // Try to find matching text across multiple spans
          for (let i = 0; i < textSpans.length; i++) {
            let combinedText = '';
            let matchingSpans: HTMLElement[] = [];

            // Combine text from consecutive spans
            for (let j = i; j < Math.min(i + 20, textSpans.length); j++) {
              const span = textSpans[j] as HTMLElement;
              combinedText += span.textContent || '';
              matchingSpans.push(span);

              // Check if we have a match
              const normalizedCombined = combinedText.replace(/\s+/g, ' ').trim();
              const normalizedSearch = searchText.replace(/\s+/g, ' ').trim();

              if (normalizedCombined.toLowerCase().includes(normalizedSearch.toLowerCase().substring(0, 50))) {
                // Highlight all matching spans
                matchingSpans.forEach(s => {
                  s.style.backgroundColor = '#fef08a'; // yellow-200
                  s.style.padding = '2px 0';
                  s.style.borderRadius = '2px';
                  s.classList.add('keynote-highlight');
                });

                // Scroll to the first highlighted span
                matchingSpans[0].scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'center' 
                });

                console.log('✅ Text highlighted successfully');
                message.success('Text highlighted in PDF');
                found = true;
                
                // Clear the highlight text after successful highlight
                if (onPageChanged) {
                  setTimeout(() => onPageChanged(), 2000);
                }
                break;
              }
            }

            if (found) break;
          }

          if (!found) {
            console.log('⚠️ Text not found in current page');
            message.warning('Text not found on this page. Try using Ctrl+F to search.');
            // Still clear after a delay
            if (onPageChanged) {
              setTimeout(() => onPageChanged(), 3000);
            }
          }
        }, 500); // Wait for text layer to render
      } catch (error) {
        console.error('❌ Error highlighting text:', error);
      }
    };

    highlightTextInPDF();
  }, [highlightText, pageRendering, currentPage, onPageChanged])

  // Log knowledge bases when component mounts or updates
  console.log('📚 PDF Viewer - Knowledge Bases:', {
    count: knowledgeBases.length,
    loading: loading,
    selectedKnowledgeBaseId,
    knowledgeBases: knowledgeBases.map(kb => ({
      id: kb.id,
      fileName: kb.fileName,
      fileUrl: kb.fileUrl,
      hasFileUrl: !!kb.fileUrl,
      status: kb.status
    }))
  })

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setPageRendering(true)
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < numPages) {
      setPageRendering(true)
      setCurrentPage(currentPage + 1)
    }
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 3.0))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5))
  }

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen)
  }

  const handleDownload = () => {
    if (selectedKB?.fileUrl) {
      window.open(selectedKB.fileUrl, '_blank')
    }
  }

  const handleLocalFileSelect = (file: File) => {
    if (file.type !== 'application/pdf') {
      message.error('Please select a PDF file')
      return
    }
    setPdfLoading(true)
    setLocalFile(file)
    setSelectedKB(null)
    setCurrentPage(1)
    setNumPages(0)
    setZoomLevel(1.0)
    message.success(`Loading: ${file.name}`)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleLocalFileSelect(file)
    }
  }

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('✅ PDF loaded successfully:', {
      numPages,
      fileName: localFile?.name || selectedKB?.fileName,
      source: localFile ? 'Local' : 'Remote'
    })
    setNumPages(numPages)
    setPdfLoading(false)
  }

  const onDocumentLoadError = (error: Error) => {
    console.error('❌ PDF load error:', {
      error: error.message,
      fileName: localFile?.name || selectedKB?.fileName,
      fileUrl: selectedKB?.fileUrl,
      errorStack: error.stack
    })
    message.error('Failed to load PDF: ' + error.message)
    setPdfLoading(false)
  }

  const clearSelection = () => {
    setSelectedKB(null)
    setLocalFile(null)
    setPdfBlob(null)
    setCurrentPage(1)
    setNumPages(0)
    setPdfLoading(false)
    setPageRendering(false)
  }

  // Get PDF source (local file or blob from Cloudinary) - Memoized to prevent unnecessary reloads
  const pdfSource = useMemo(() => {
    if (localFile) {
      console.log('📄 Using local file')
      return localFile
    }
    if (pdfBlob) {
      console.log('📄 Using PDF blob')
      return pdfBlob
    }
    return null
  }, [localFile, pdfBlob])

  // Log PDF source for debugging
  if (selectedKB || localFile) {
    console.log('🔗 PDF Source:', {
      type: localFile ? 'Local File' : 'Remote URL',
      source: localFile ? localFile.name : selectedKB?.fileUrl,
      pdfSource: pdfSource,
      isValid: !!pdfSource
    })
  }

  // No selection - show grid + upload option
  if (!selectedKB && !localFile && !pdfBlob) {
    return (
      <div className="!h-full !p-6">
        <div className="!mb-6 !flex !items-center !justify-between">
          <div>
            <h4 className="!text-lg !font-semibold !text-gray-900 !mb-2">PDF Viewer</h4>
            <p className="!text-sm !text-gray-500">Choose from uploaded files or select a local PDF</p>
          </div>
          
          {/* Local File Upload Button */}
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => fileInputRef.current?.click()}
            className="!bg-blue-600 !border-blue-600"
          >
            Open Local PDF
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
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

  // PDF Viewer with selected file
  const pdfViewerContent = (
    <div className="!flex !flex-col !h-full !bg-gray-50">
      {/* PDF Header */}
      <div className="!flex !items-center !justify-between !px-4 !py-3 !border-b !border-gray-200 !bg-white">
        <div className="!flex !items-center !gap-3">
          <Button
            icon={<CloseOutlined />}
            onClick={clearSelection}
            className="!text-gray-600"
          >
            Close
          </Button>
          <div>
            <h3 className="!text-gray-900 !font-semibold !line-clamp-1">
              {localFile ? localFile.name : selectedKB?.fileName}
            </h3>
            <p className="!text-xs !text-gray-500">
              {numPages > 0 ? `Page ${currentPage} of ${numPages}` : 'Loading...'}
            </p>
          </div>
          {localFile && (
            <Tag color="blue">Local File</Tag>
          )}
        </div>
        {selectedKB?.fileUrl && (
          <Button
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            className="!text-gray-600"
          >
            Download
          </Button>
        )}
      </div>

      {/* Highlight Text Banner */}
      {highlightText && (
        <div className="!px-4 !py-2 !bg-yellow-50 !border-b !border-yellow-200">
          <div className="!flex !items-center !gap-2">
            <span className="!text-yellow-800 !text-sm !font-medium">✨ Highlighting:</span>
            <span className="!text-yellow-900 !text-sm !italic !line-clamp-1">"{highlightText.substring(0, 100)}..."</span>
            <span className="!text-xs !text-yellow-600 !ml-auto">Text will be highlighted in yellow</span>
          </div>
        </div>
      )}

      {/* PDF Viewer Area */}
      <div className="!flex-1 !overflow-auto !flex !items-start !justify-center !bg-gray-100 !p-4">
        {pdfSource ? (
          <div className="!relative" ref={pageContainerRef}>
            {/* Loading overlay for page rendering */}
            {(pdfLoading || pageRendering) && (
              <div className="!absolute !inset-0 !flex !items-center !justify-center !bg-white !bg-opacity-80 !z-10">
                <Spin size="large" tip={pdfLoading ? "Loading PDF..." : "Rendering page..."} />
              </div>
            )}
            
            <div style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}>
              <Document
                file={pdfSource}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="!flex !flex-col !items-center !justify-center !py-12 !min-h-[600px]">
                    <Spin size="large" />
                    <p className="!mt-4 !text-gray-600">Loading PDF document...</p>
                    <p className="!text-sm !text-gray-400">This may take a few moments</p>
                  </div>
                }
              >
                <Page
                  pageNumber={currentPage}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className="!shadow-lg"
                  loading={
                    <div className="!flex !items-center !justify-center !min-h-[600px] !bg-white">
                      <Spin size="large" tip="Rendering page..." />
                    </div>
                  }
                  onRenderSuccess={() => setPageRendering(false)}
                  onLoadSuccess={() => setPageRendering(false)}
                />
              </Document>
            </div>
          </div>
        ) : (
          <div className="!text-center !py-12">
            <Empty description="No PDF selected" />
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="!flex !items-center !justify-between !px-4 !py-3 !border-t !border-gray-200 !bg-white">
        <Button
          icon={<LeftOutlined />}
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || numPages === 0 || pdfLoading || pageRendering}
          loading={pageRendering && currentPage > 1}
          className="!text-gray-600"
        >
          Previous
        </Button>

        <Space>
          <div className="!flex !items-center !gap-2">
            <Input
              type="number"
              min="1"
              max={numPages}
              value={currentPage}
              onChange={(e) => {
                const page = Number.parseInt(e.target.value, 10)
                if (page >= 1 && page <= numPages) {
                  setPageRendering(true)
                  setCurrentPage(page)
                }
              }}
              className="!w-16 !text-center"
              disabled={numPages === 0 || pdfLoading}
            />
            <span className="!text-gray-600">/ {numPages || '?'}</span>
          </div>

          <Tooltip title="Zoom In">
            <Button
              icon={<ZoomInOutlined />}
              onClick={handleZoomIn}
              disabled={zoomLevel >= 3.0}
              size="small"
              className="!text-gray-600"
            />
          </Tooltip>

          <span className="!text-sm !text-gray-600">{Math.round(zoomLevel * 100)}%</span>

          <Tooltip title="Zoom Out">
            <Button
              icon={<ZoomOutOutlined />}
              onClick={handleZoomOut}
              disabled={zoomLevel <= 0.5}
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
          disabled={currentPage === numPages || numPages === 0 || pdfLoading || pageRendering}
          loading={pageRendering && currentPage < numPages}
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
