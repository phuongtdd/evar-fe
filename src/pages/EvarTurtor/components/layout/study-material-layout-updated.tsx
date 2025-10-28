"use client";

import { useState, useEffect } from "react";
import { Layout, Tabs, Button, Tooltip, Card, Tag, Empty, Spin } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import MaterialsGrid from "./materials-grid";
import TutorChatPanelUpdated from "../component/tutor-chat-panel-updated";
import PdfViewerUpdated from "../component/pdf-viewer-updated";
import NotePage from "../component/ note-page";
import CreateFlashcardsModalUpdated from "../component/create-flashcards-modal-updated";
import MaterialsUploadAreaUpdated from "../component/materials-upload-area-updated";
import StudyingGuidance from "../component/studying-guidance";
import { useKnowledgeBases, useFlashcards } from "../../hooks/evarTutorHooks";
import FlashcardViewer from "../component/flashcard-viewer";
import { flashcardService } from "../../services/evarTutorService";

const { Content } = Layout;

export default function StudyMaterialLayout() {
  const [activeTab, setActiveTab] = useState("materials");
  const [showCreateFlashcards, setShowCreateFlashcards] = useState(false);
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<number | null>(null);
  const [viewingFlashcards, setViewingFlashcards] = useState(false);
  const [selectedFlashcardKB, setSelectedFlashcardKB] = useState<number | null>(null);
  const [flashcardCounts, setFlashcardCounts] = useState<Record<number, number>>({});
  const [loadingCounts, setLoadingCounts] = useState(false);

  const { data: knowledgeBases, loading: knowledgeBasesLoading, refetch: refetchKnowledgeBases } = useKnowledgeBases();
  const { data: flashcards, loading: flashcardsLoading, deleteFlashcard, refetch: refetchFlashcards } = useFlashcards(selectedFlashcardKB || undefined);

  // Load flashcard counts for all knowledge bases
  const loadFlashcardCounts = async () => {
    if (knowledgeBases.length === 0) return;
    
    setLoadingCounts(true);
    const counts: Record<number, number> = {};
    
    try {
      await Promise.all(
        knowledgeBases.map(async (kb) => {
          try {
            const flashcards = await flashcardService.getFlashcardsByKnowledgeBaseId(kb.id);
            counts[kb.id] = flashcards.length;
          } catch (error) {
            counts[kb.id] = 0;
          }
        })
      );
      setFlashcardCounts(counts);
    } catch (error) {
      console.error('Error loading flashcard counts:', error);
    } finally {
      setLoadingCounts(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'flashcards') {
      loadFlashcardCounts();
    }
  }, [knowledgeBases, activeTab]);

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
              { key: "materials", label: "Knowledge Bases" },
              { key: "guidance", label: "Studying Guidance" },
              { key: "flashcards", label: "Flashcards" },
              { key: "pdf", label: "PDF Views" },
              { key: "notes", label: "Notes" },
            ]}
            className="[&_.ant-tabs-tab]:!px-0 [&_.ant-tabs-tab]:!mr-8"
          />
        </div>

        <Content className="!flex-1 !overflow-auto !px-6 !py-4">
          {showUploadArea ? (
            <MaterialsUploadAreaUpdated 
              onClose={() => setShowUploadArea(false)} 
              onRefetch={refetchKnowledgeBases}
            />
          ) : (
            <>
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
              )}
              {activeTab === "guidance" && selectedKnowledgeBase && knowledgeBases.find(kb => kb.id === selectedKnowledgeBase) ? (
                <StudyingGuidance
                  knowledgeBaseId={selectedKnowledgeBase}
                  knowledgeBase={knowledgeBases.find(kb => kb.id === selectedKnowledgeBase)}
                />
              ) : activeTab === "guidance" && (
                <div className="!flex !items-center !justify-center !h-full !text-center">
                  <div>
                    <p className="!text-lg !text-gray-600 !mb-2">No knowledge base selected</p>
                    <p className="!text-sm !text-gray-500">Please select a knowledge base to view studying guidance</p>
                  </div>
                </div>
              )}
              {activeTab === "flashcards" && (
                viewingFlashcards && flashcards.length > 0 ? (
                  <FlashcardViewer 
                    flashcards={flashcards}
                    onBack={() => setViewingFlashcards(false)}
                  />
                ) : (
                  <div className="!space-y-4">
                    <div className="!flex !items-center !justify-between">
                      <h4 className="!text-lg !font-semibold !text-gray-900">Flashcard Sets</h4>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setShowCreateFlashcards(true)}
                        disabled={knowledgeBases.length === 0}
                        className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700 hover:!border-blue-700"
                      >
                        Create Flashcards
                      </Button>
                    </div>

                    {knowledgeBases.length === 0 ? (
                      <div className="!text-center !py-12">
                        <Empty description="Vui lòng upload PDF trước khi tạo flashcards" />
                      </div>
                    ) : loadingCounts ? (
                      <div className="!flex !justify-center !items-center !py-12">
                        <Spin size="large" tip="Loading flashcard counts..." />
                      </div>
                    ) : (
                      <div className="!grid !grid-cols-1 !md:grid-cols-2 !lg:grid-cols-3 !gap-4">
                        {knowledgeBases.map((kb) => {
                          const kbFlashcardCount = flashcardCounts[kb.id] || 0;
                          
                          return (
                            <Card
                              key={kb.id}
                              className="!border !border-gray-200 !rounded-lg !shadow-sm !hover:shadow-lg !transition-all !cursor-pointer"
                              onClick={() => {
                                setSelectedFlashcardKB(kb.id);
                                // Wait for flashcards to load then show viewer
                                setTimeout(() => setViewingFlashcards(true), 300);
                              }}
                            >
                              <div className="!flex !flex-col !h-full">
                                <div className="!flex !items-start !justify-between !mb-3">
                                  <div className="!flex-1">
                                    <h5 className="!font-semibold !text-gray-900 !mb-2 !line-clamp-2">
                                      {kb.fileName}
                                    </h5>
                                    <p className="!text-sm !text-gray-500 !mb-2">
                                      {new Date(kb.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <span className={`!px-2 !py-1 !text-xs !rounded-full !shrink-0 ${
                                    kb.status === 'READY' ? '!bg-green-100 !text-green-800' :
                                    kb.status === 'PROCESSING' ? '!bg-yellow-100 !text-yellow-800' :
                                    '!bg-red-100 !text-red-800'
                                  }`}>
                                    {kb.status}
                                  </span>
                                </div>
                                
                                <div className="!mt-auto !pt-3 !border-t !border-gray-100">
                                  <div className="!flex !items-center !justify-between">
                                    <Tag color="blue" className="!text-base !px-3 !py-1">
                                      {kbFlashcardCount} cards
                                    </Tag>
                                    {kbFlashcardCount > 0 && (
                                      <span className="!text-xs !text-blue-600 !font-medium">
                                        Click to study →
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )
              )}
              {activeTab === "pdf" && (
                <PdfViewerUpdated
                  knowledgeBases={knowledgeBases}
                  loading={knowledgeBasesLoading}
                />
              )}
              {activeTab === "notes" && <NotePage type="material" />}
            </>
          )}
        </Content>
      </div>

      <div className="!w-180 !border-l !border-gray-200 !bg-white !flex !flex-col">
        <div className="!flex-1 !min-h-0 !border-t !border-gray-200 !overflow-hidden">
          <TutorChatPanelUpdated onPageJump={setCurrentPage} />
        </div>
      </div>

      <CreateFlashcardsModalUpdated
        open={showCreateFlashcards}
        onClose={() => {
          setShowCreateFlashcards(false);
          refetchFlashcards();
          loadFlashcardCounts(); // Refresh counts after creating flashcards
        }}
      />
    </div>
  );
}
