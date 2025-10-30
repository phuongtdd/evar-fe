"use client";

import { useState, useEffect } from "react";
import { Layout, Tabs, Button, Tooltip, Card, Tag, Empty, Spin, Alert, Input, message } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import MaterialsGrid from "./materials-grid";
import TutorChatPanelUpdated from "../component/tutor-chat-panel-updated";
import PdfViewerWithUpload from "../component/pdf-viewer-with-upload";
import CreateFlashcardsModalUpdated from "../component/create-flashcards-modal-updated";
import MaterialsUploadAreaUpdated from "../component/materials-upload-area-updated";
import { useKnowledgeBases, useFlashcards, knowledgeBaseService } from "../../hooks/evarTutorHooks";
import FlashcardViewer from "../component/flashcard-viewer";
import { flashcardService } from "../../services/evarTutorService";
import NotePage from "../component/ note-page";

const { Content } = Layout;

export default function StudyMaterialLayout() {
  const [activeTab, setActiveTab] = useState("flashcards");
  const [showCreateFlashcards, setShowCreateFlashcards] = useState(false);
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<number | null>(null);
  const [viewingFlashcards, setViewingFlashcards] = useState(false);
  const [studyGuide, setStudyGuide] = useState("");
  const [keyNotes, setKeyNotes] = useState("");
  const [parsedKeyNotes, setParsedKeyNotes] = useState<any>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [targetPage, setTargetPage] = useState<number | null>(null);
  const [highlightText, setHighlightText] = useState<string | null>(null);
  const [chatRefetchTrigger, setChatRefetchTrigger] = useState(0); // Trigger for chat panel KB refetch

  // Handler to receive selected KB from chatbot
  const handleKnowledgeBaseSelected = (kbId: number | null) => {
    setSelectedKnowledgeBase(kbId);
  };

  const { data: knowledgeBasesData, loading: knowledgeBasesLoading, refetch: refetchKnowledgeBases } = useKnowledgeBases();
  const { data: flashcardsData, loading: flashcardsLoading, deleteFlashcard, refetch: refetchFlashcards } = useFlashcards(selectedKnowledgeBase || undefined);
  
  // Ensure arrays are always valid
  const knowledgeBases = Array.isArray(knowledgeBasesData) ? knowledgeBasesData : [];
  const flashcards = Array.isArray(flashcardsData) ? flashcardsData : [];

  // Load study guide and key notes when KB is selected or KB list changes
  useEffect(() => {
    const loadContent = async () => {
      if (selectedKnowledgeBase) {
        setLoadingContent(true);
        try {
          // console.log('📖 Loading content for KB:', selectedKnowledgeBase);
          const detail = await knowledgeBaseService.getKnowledgeBaseDetail(selectedKnowledgeBase);
          setStudyGuide(detail.studyGuide || "");
          setKeyNotes(detail.keyNotes || "");
          
          try {
            const kn = await knowledgeBaseService.getKeyNotes(selectedKnowledgeBase);
            setParsedKeyNotes(kn);
          } catch {}
          
          // console.log('✅ Content loaded successfully');
        } catch (error) {
          console.error("Failed to load content:", error);
        } finally {
          setLoadingContent(false);
        }
      }
    };
    loadContent();
  }, [selectedKnowledgeBase, knowledgeBases]);

  return (
    <div className="!flex !h-screen !w-full !bg-white mt-12 ">
      <div className="!flex-1 !flex !flex-col !border-r !border-gray-200">
        <div className="!flex !items-center !justify-between !px-6 !py-4 !border-b !border-gray-200">
          <div className="!flex !gap-2">
            <h3>Tài nguyên học tập</h3>
          </div>

          <div className="!flex !gap-2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700 hover:!border-blue-700"
              onClick={() => setShowUploadArea(!showUploadArea)}
            >
              Upload PDF
            </Button>
          </div>
        </div>

        <div className="!px-6 !pt-4 !border-b !border-gray-200">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: "flashcards", label: "Flashcards" },
              { key: "studyGuide", label: "Study Guide" },
              { key: "keyNotes", label: "Key Notes" },
              { key: "notes", label: "Notes" },
              { key: "pdf", label: "PDF Viewer" },
            ]}
            className="[&_.ant-tabs-tab]:!px-0 [&_.ant-tabs-tab]:!mr-8"
          />
        </div>

        <Content className="!flex-1 !overflow-auto !px-6 !py-4">
          {showUploadArea ? (
            <MaterialsUploadAreaUpdated 
              onClose={() => setShowUploadArea(false)} 
              onRefetch={async () => {
                console.log('🔄 Refetching knowledge bases...');
                await refetchKnowledgeBases();
                console.log('✅ Knowledge bases refetched');
              }}
              onUploaded={async (kbId: number) => {
                console.log('\n=== UPLOAD COMPLETED ===' );
                console.log('📦 Upload completed for KB ID:', kbId);
                console.log('Current selected KB:', selectedKnowledgeBase);
                console.log('Current active tab:', activeTab);
                
                // Close upload area first
                setShowUploadArea(false);
                console.log('✅ Upload area closed');
                
                // Auto-select the newly uploaded KB
                setSelectedKnowledgeBase(kbId);
                console.log('✅ Auto-selected KB:', kbId);
                
                // Switch to PDF tab to show the uploaded PDF
                setActiveTab('pdf');
                console.log('✅ Switched to PDF tab');
                
                // Wait for state updates and then refresh data
                setTimeout(async () => {
                  console.log('\n=== REFRESHING DATA ===');
                  console.log('🔄 Refetching data for KB:', kbId);
                  
                  try {
                    // Refresh KB list to ensure latest data
                    await refetchKnowledgeBases();
                    console.log('✅ Knowledge bases refetched');
                    
                    // Refresh flashcards
                    await refetchFlashcards();
                    console.log('✅ Flashcards refetched successfully');
                    
                    // Trigger refetch in chat panel
                    setChatRefetchTrigger(prev => prev + 1);
                    console.log('✅ Chat panel KB list refresh triggered');
                    
                    message.success('✅ PDF uploaded and flashcards generated! View them in the Flashcards tab.');
                  } catch (error) {
                    console.error('❌ Failed to refresh data:', error);
                    message.error('Failed to refresh data. Please reload the page.');
                  }
                  
                  console.log('=== UPLOAD FLOW COMPLETE ===\n');
                }, 1000);
              }}
            />
          ) : (
            <>
              {/* Materials tab is commented out - using flashcards as default
              {activeTab === "materials" && (
                <div className="!space-y-4">
                  <h4 className="!text-lg !font-semibold !text-gray-900">Knowledge Bases</h4>
                  {knowledgeBasesLoading ? (
                    <div className="!text-center !py-8">
                      <div className="!text-gray-500">Đang tải...</div>
                    </div>
                  ) : knowledgeBases.length === 0 ? (
                    <div className="!text-center !py-8">
                      <div className="!text-gray-500 !mb-4">Chưa có knowledge base nào</div>
                      <Button
                        type="primary"
                        onClick={() => setShowUploadArea(true)}
                        className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700 hover:!border-blue-700"
                      >
                        Upload PDF đầu tiên
                      </Button>
                    </div>
                  ) : (
                    <div className="!grid !grid-cols-1 !md:grid-cols-2 !lg:grid-cols-3 !gap-4">
                      {knowledgeBases.map((kb) => (
                        <div
                          key={kb.id}
                          className="!border !border-gray-200 !rounded-lg !p-4 !hover:shadow-md !transition-shadow !cursor-pointer"
                          onClick={() => setSelectedKnowledgeBase(kb.id)}
                        >
                          <div className="!flex !items-start !justify-between !mb-2">
                            <h5 className="!font-medium !text-gray-900 !truncate">{kb.fileName}</h5>
                            <span className={`!px-2 !py-1 !text-xs !rounded-full ${
                              kb.status === 'READY' ? '!bg-green-100 !text-green-800' :
                              kb.status === 'PROCESSING' ? '!bg-yellow-100 !text-yellow-800' :
                              '!bg-red-100 !text-red-800'
                            }`}>
                              {kb.status}
                            </span>
                          </div>
                          <p className="!text-sm !text-gray-500 !mb-2">
                            Tạo lúc: {new Date(kb.createdAt).toLocaleDateString()}
                          </p>
                          {kb.studyGuide && (
                            <p className="!text-sm !text-gray-600 !line-clamp-2">
                              {kb.studyGuide.substring(0, 100)}...
                            </p>
                          )}
                          {kb.keyNotes && (
                            <p className="!text-xs !text-gray-500 !line-clamp-1 !mt-1">
                              Key notes: {kb.keyNotes.substring(0, 80)}...
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )} */}
              {activeTab === "flashcards" && (
                selectedKnowledgeBase ? (
                  viewingFlashcards && flashcards.length > 0 ? (
                    <FlashcardViewer 
                      flashcards={flashcards}
                      onBack={() => setViewingFlashcards(false)}
                    />
                  ) : (
                    <div className="!space-y-4">
                      <Alert
                        message="💡 Flashcards are automatically generated when you upload a PDF"
                        description={`Viewing flashcards for: ${knowledgeBases.find(kb => kb.id === selectedKnowledgeBase)?.fileName || 'Selected knowledge base'}`}
                        type="info"
                        showIcon
                        closable
                      />
                      <div className="!flex !items-center !justify-between">
                        <h4 className="!text-lg !font-semibold !text-gray-900">Flashcards</h4>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => setShowCreateFlashcards(true)}
                          className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700 hover:!border-blue-700"
                        >
                          Create Flashcards
                        </Button>
                      </div>

                      {flashcardsLoading ? (
                        <div className="!flex !justify-center !items-center !py-12">
                          <Spin size="large" tip="Loading flashcards..." />
                        </div>
                      ) : flashcards.length === 0 ? (
                        <div className="!text-center !py-12">
                          <Empty description="No flashcards available for this knowledge base. Click 'Create Flashcards' to generate some!" />
                        </div>
                      ) : (
                        <div className="!space-y-3">
                          <Card className="!border !border-gray-200 !rounded-lg !shadow-sm">
                            <div className="!flex !items-center !justify-between">
                              <div>
                                <h5 className="!font-semibold !text-gray-900 !mb-1">
                                  {knowledgeBases.find(kb => kb.id === selectedKnowledgeBase)?.fileName}
                                </h5>
                                <p className="!text-sm !text-gray-500">
                                  {flashcards.length} flashcard{flashcards.length !== 1 ? 's' : ''}
                                </p>
                              </div>
                              <Button
                                type="primary"
                                onClick={() => setViewingFlashcards(true)}
                                className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700"
                              >
                                Start Studying
                              </Button>
                            </div>
                          </Card>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div className="!flex !items-center !justify-center !h-full !text-center">
                    <div className="!max-w-md">
                      <p className="!text-lg !font-semibold !text-gray-700 !mb-3">🎴 No Knowledge Base Selected</p>
                      <p className="!text-sm !text-gray-600 !mb-4">
                        To view flashcards, please select a knowledge base from the dropdown in the chatbot section on the right, or upload a new PDF file.
                      </p>
                      <Button
                        type="primary"
                        onClick={() => setShowUploadArea(true)}
                        className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700"
                      >
                        Upload PDF Now
                      </Button>
                    </div>
                  </div>
                )
              )}
              
              {activeTab === "studyGuide" && (
                selectedKnowledgeBase ? (
                  loadingContent ? (
                    <div className="!flex !justify-center !items-center !py-12">
                      <Spin size="large" tip="Loading study guide..." />
                    </div>
                  ) : (
                    <div className="!space-y-4">
                      <div className="!flex !items-center !justify-between">
                        <h4 className="!text-lg !font-semibold !text-gray-900">Study Guide</h4>
                      </div>
                      <Card className="!border !border-gray-200">
                        <Input.TextArea
                          value={studyGuide}
                          placeholder="Study guide will appear here after processing..."
                          className="!min-h-[500px]"
                          readOnly
                        />
                      </Card>
                    </div>
                  )
                ) : (
                  <div className="!flex !items-center !justify-center !h-full !text-center">
                    <div className="!max-w-md">
                      <p className="!text-lg !font-semibold !text-gray-700 !mb-3">📖 No Knowledge Base Selected</p>
                      <p className="!text-sm !text-gray-600 !mb-4">
                        To view study guide, please select a knowledge base from the dropdown in the chatbot section on the right, or upload a new PDF file.
                      </p>
                      <Button
                        type="primary"
                        onClick={() => setShowUploadArea(true)}
                        className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700"
                      >
                        Upload PDF Now
                      </Button>
                    </div>
                  </div>
                )
              )}

              {activeTab === "keyNotes" && (
                selectedKnowledgeBase ? (
                  loadingContent ? (
                    <div className="!flex !justify-center !items-center !py-12">
                      <Spin size="large" tip="Loading key notes..." />
                    </div>
                  ) : (
                    <div className="!space-y-4">
                      <div className="!flex !items-center !justify-between">
                        <h4 className="!text-lg !font-semibold !text-gray-900">Key Notes</h4>
                      </div>
                      <Card className="!border !border-gray-200">
                        {parsedKeyNotes?.notes?.length ? (
                          <div className="!space-y-2 !max-h-[600px] !overflow-auto">
                            {parsedKeyNotes.notes.map((n: any) => (
                              <div 
                                key={n.id} 
                                className="!border !border-gray-200 !rounded !p-3 !bg-gray-50 hover:!bg-blue-50 hover:!border-blue-300 !cursor-pointer !transition-all"
                                onDoubleClick={() => {
                                  if (n.pageNumber !== null) {
                                    console.log('📍 Jumping to page:', n.pageNumber, 'with text:', n.content);
                                    setTargetPage(n.pageNumber);
                                    setHighlightText(n.content);
                                    setActiveTab('pdf');
                                    message.info(`Jumping to page ${n.pageNumber}...`);
                                  } else {
                                    message.warning('No page number available for this note');
                                  }
                                }}
                                title="Double-click to jump to PDF page"
                              >
                                <div className="!text-sm !text-gray-900 !mb-1">{n.content}</div>
                                {n.pageNumber !== null && (
                                  <div className="!text-xs !text-gray-500 !flex !items-center !gap-1">
                                    <span>📄 Page {n.pageNumber}</span>
                                    <span className="!text-blue-500">• Double-click to view</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Input.TextArea
                            value={keyNotes}
                            placeholder="Key notes will appear here after processing..."
                            className="!min-h-[500px]"
                            readOnly
                          />
                        )}
                      </Card>
                    </div>
                  )
                ) : (
                  <div className="!flex !items-center !justify-center !h-full !text-center">
                    <div className="!max-w-md">
                      <p className="!text-lg !font-semibold !text-gray-700 !mb-3">📝 No Knowledge Base Selected</p>
                      <p className="!text-sm !text-gray-600 !mb-4">
                        To view key notes, please select a knowledge base from the dropdown in the chatbot section on the right, or upload a new PDF file.
                      </p>
                      <Button
                        type="primary"
                        onClick={() => setShowUploadArea(true)}
                        className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700"
                      >
                        Upload PDF Now
                      </Button>
                    </div>
                  </div>
                )
              )}

              {activeTab === "notes" && (
                selectedKnowledgeBase ? (
                  <div className="!h-full">
                    <NotePage knowledgeBaseId={selectedKnowledgeBase} />
                  </div>
                ) : (
                  <div className="!flex !items-center !justify-center !h-full !text-center">
                    <div className="!max-w-md">
                      <p className="!text-lg !font-semibold !text-gray-700 !mb-3">📝 No Knowledge Base Selected</p>
                      <p className="!text-sm !text-gray-600 !mb-4">
                        To take notes, please select a knowledge base from the dropdown in the chatbot section on the right, or upload a new PDF file.
                      </p>
                      <Button
                        type="primary"
                        onClick={() => setShowUploadArea(true)}
                        className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700"
                      >
                        Upload PDF Now
                      </Button>
                    </div>
                  </div>
                )
              )}

              {activeTab === "pdf" && (
                selectedKnowledgeBase && knowledgeBases.find(kb => kb.id === selectedKnowledgeBase) ? (
                  <PdfViewerWithUpload
                    knowledgeBases={[knowledgeBases.find(kb => kb.id === selectedKnowledgeBase)!]}
                    loading={knowledgeBasesLoading}
                    selectedKnowledgeBaseId={selectedKnowledgeBase}
                    targetPage={targetPage}
                    highlightText={highlightText}
                    onPageChanged={() => {
                      setTargetPage(null);
                      setHighlightText(null);
                    }}
                  />
                ) : (
                  <div className="!flex !items-center !justify-center !h-full !text-center">
                    <div className="!max-w-md">
                      <p className="!text-lg !font-semibold !text-gray-700 !mb-3">📄 No Knowledge Base Selected</p>
                      <p className="!text-sm !text-gray-600 !mb-4">
                        To view the PDF, please select a knowledge base from the dropdown in the chatbot section on the right, or upload a new PDF file.
                      </p>
                      <Button
                        type="primary"
                        onClick={() => setShowUploadArea(true)}
                        className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700"
                      >
                        Upload PDF Now
                      </Button>
                    </div>
                  </div>
                )
              )}
            </>
          )}
        </Content>
      </div>

      <div className="!w-180 !border-l !border-gray-200 !bg-white !flex !flex-col">
        <div className="!flex-1 !min-h-0 !border-t !border-gray-200 !overflow-hidden">
          <TutorChatPanelUpdated 
            onPageJump={setCurrentPage}
            onKnowledgeBaseSelected={handleKnowledgeBaseSelected}
            refetchTrigger={chatRefetchTrigger}
          />
        </div>
      </div>

      <CreateFlashcardsModalUpdated
        open={showCreateFlashcards}
        onClose={() => {
          setShowCreateFlashcards(false);
          refetchFlashcards();
        }}
      />
    </div>
  );
}
