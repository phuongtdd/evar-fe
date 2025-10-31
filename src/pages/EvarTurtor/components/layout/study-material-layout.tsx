"use client";

import { useState, useEffect } from "react";
import { Layout, Tabs, Button, Tooltip, Card, Tag, Empty, Spin, Alert, Input, message } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import TutorChatPanelUpdated from "../component/tutor-chat-panel-updated";
import PdfViewerWithUpload from "../component/pdf-viewer-with-upload";
import CreateFlashcardsModalUpdated from "../component/create-flashcards-modal-updated";
import MaterialsUploadAreaUpdated from "../component/materials-upload-area-updated";
import { useKnowledgeBases, useFlashcards, knowledgeBaseService, flashcardService as flashcardSvc } from "../../hooks/evarTutorHooks";
import FlashcardViewer from "../component/flashcard-viewer";
import NotePage from "../component/ note-page";


const { Content } = Layout;

export default function StudyMaterialLayout() {
  const [activeTab, setActiveTab] = useState("flashcards");
  const [showCreateFlashcards, setShowCreateFlashcards] = useState(false);
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<number | null>(null);
  const [selectedCardSetId, setSelectedCardSetId] = useState<string | undefined>(undefined);
  const [cardSets, setCardSets] = useState<any[]>([]);
  const [viewingFlashcards, setViewingFlashcards] = useState(false);
  const [studyGuide, setStudyGuide] = useState("");
  const [keyNotes, setKeyNotes] = useState("");
  const [parsedKeyNotes, setParsedKeyNotes] = useState<any>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [targetPage, setTargetPage] = useState<number | null>(null);
  const [highlightText, setHighlightText] = useState<string | null>(null);
  const [chatRefetchTrigger, setChatRefetchTrigger] = useState(0); 

  // Handler to receive selected KB from chatbot
  const handleKnowledgeBaseSelected = (kbId: number | null) => {
    setSelectedKnowledgeBase(kbId);
  };

  const { data: knowledgeBasesData, loading: knowledgeBasesLoading, refetch: refetchKnowledgeBases } = useKnowledgeBases();
  const { data: flashcardsData, loading: flashcardsLoading, deleteFlashcard, refetch: refetchFlashcards } = useFlashcards(selectedKnowledgeBase || undefined, selectedCardSetId);
  
  const knowledgeBases = Array.isArray(knowledgeBasesData) ? knowledgeBasesData : [];
  const flashcards = Array.isArray(flashcardsData) ? flashcardsData : [];

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

  // Load card sets for selected KB and maintain selection
  useEffect(() => {
    const loadSets = async () => {
      if (!selectedKnowledgeBase) {
        setCardSets([]);
        setSelectedCardSetId(undefined);
        return;
      }
      try {
        const sets = await flashcardSvc.listCardSetsByKnowledgeBase(selectedKnowledgeBase);
        setCardSets(sets);
        // If current selection not found, default to newest set
        if (!selectedCardSetId || !sets.find(s => s.id === selectedCardSetId)) {
          if (sets.length > 0) {
            const newest = [...sets].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];
            setSelectedCardSetId(newest.id);
          } else {
            setSelectedCardSetId(undefined);
          }
        }
      } catch (e) {
        setCardSets([]);
        setSelectedCardSetId(undefined);
      }
    };
    loadSets();
  }, [selectedKnowledgeBase]);

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
              Tải lên PDF
            </Button>
          </div>
        </div>

        <div className="!px-6 !pt-4 !border-b !border-gray-200">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: "flashcards", label: "Thẻ ghi nhớ" },
              { key: "studyGuide", label: "Hướng dẫn học tập" },
              { key: "keyNotes", label: "Ghi chú quan trọng" },
              { key: "notes", label: "Ghi chú" },
              { key: "pdf", label: "Xem PDF" },
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
                
                setShowUploadArea(false);
                console.log('✅ Upload area closed');
                
                setSelectedKnowledgeBase(kbId);
                console.log('✅ Auto-selected KB:', kbId);
                
                setActiveTab('pdf');
                console.log('✅ Switched to PDF tab');
                
                setTimeout(async () => {
                  console.log('\n=== REFRESHING DATA ===');
                  console.log('🔄 Refetching data for KB:', kbId);
                  
                  try {
                    await refetchKnowledgeBases();
                    console.log('✅ Knowledge bases refetched');
                    
                    await refetchFlashcards();
                    console.log('✅ Flashcards refetched successfully');
                    
                    setChatRefetchTrigger(prev => prev + 1);
                    console.log('✅ Chat panel KB list refresh triggered');
                    
                    message.success('✅ PDF đã được tải lên! Hãy chọn số lượng flashcards để tạo.');
                  } catch (error) {
                    console.error('❌ Failed to refresh data:', error);
                    message.error('Không thể làm mới dữ liệu. Vui lòng tải lại trang.');
                  }
                  
                  console.log('=== UPLOAD FLOW COMPLETE ===\n');
                }, 1000);
              }}
            />
          ) : (
            <>
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
                        message="💡 Thẻ ghi nhớ được tự động tạo khi bạn tải lên PDF"
                        description={`Đang xem thẻ ghi nhớ cho: ${knowledgeBases.find(kb => kb.id === selectedKnowledgeBase)?.fileName || 'Tài nguyên học liệu đã chọn'}`}
                        type="info"
                        showIcon
                        closable
                      />
                      <div className="!flex !items-center !justify-between">
                        <h4 className="!text-lg !font-semibold !text-gray-900">Thẻ ghi nhớ</h4>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => setShowCreateFlashcards(true)}
                          className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700 hover:!border-blue-700"
                        >
                          Tạo thẻ ghi nhớ
                        </Button>
                      </div>
                      {/* Card Set Selector */}
                      <div className="!flex !items-center !gap-3">
                        <div className="!text-sm !text-gray-600">Bộ thẻ:</div>
                        <select
                          className="!border !border-gray-300 !rounded-lg !px-3 !py-2"
                          value={selectedCardSetId || ''}
                          onChange={async (e) => {
                            setSelectedCardSetId(e.target.value || undefined);
                            await refetchFlashcards();
                          }}
                        >
                          {cardSets.length === 0 && (
                            <option value="">Chưa có bộ thẻ</option>
                          )}
                          {cardSets.map((s) => (
                            <option key={s.id} value={s.id}>{s.name || 'Untitled'} ({s.flashcardCount || s.totalCards || 0})</option>
                          ))}
                        </select>
                        <Button
                          onClick={async () => {
                            if (!selectedKnowledgeBase) return;
                            const created = await flashcardSvc.createEmptySetForKnowledgeBase(selectedKnowledgeBase);
                            const sets = await flashcardSvc.listCardSetsByKnowledgeBase(selectedKnowledgeBase);
                            setCardSets(sets);
                            setSelectedCardSetId(created.id);
                            await refetchFlashcards();
                          }}
                        >
                          Tạo bộ trống
                        </Button>
                      </div>

                      {flashcardsLoading ? (
                        <div className="!flex !justify-center !items-center !py-12">
                          <Spin size="large" tip="Đang tải thẻ ghi nhớ..." />
                        </div>
                      ) : flashcards.length === 0 ? (
                        <div className="!text-center !py-12">
                          <Empty description="Chưa có thẻ ghi nhớ nào cho tài nguyên học liệu này. Nhấn 'Tạo thẻ ghi nhớ' để tạo!" />
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
                                  {flashcards.length} thẻ ghi nhớ
                                </p>
                              </div>
                              <Button
                                type="primary"
                                onClick={() => setViewingFlashcards(true)}
                                className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700"
                              >
                                Bắt đầu học
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
                      <p className="!text-lg !font-semibold !text-gray-700 !mb-3">🎴 Chưa chọn tài nguyên học liệu</p>
                      <p className="!text-sm !text-gray-600 !mb-4">
                        Để xem thẻ ghi nhớ, vui lòng chọn tài nguyên học liệu từ dropdown ở phần chatbot bên phải, hoặc tải lên file PDF mới.
                      </p>
                      <Button
                        type="primary"
                        onClick={() => setShowUploadArea(true)}
                        className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700"
                      >
                        Tải lên PDF ngay
                      </Button>
                    </div>
                  </div>
                )
              )}
              
              {activeTab === "studyGuide" && (
                selectedKnowledgeBase ? (
                  loadingContent ? (
                    <div className="!flex !justify-center !items-center !py-12">
                      <Spin size="large" tip="Đang tải hướng dẫn học tập..." />
                    </div>
                  ) : (
                    <div className="!space-y-4">
                      <div className="!flex !items-center !justify-between">
                        <h4 className="!text-lg !font-semibold !text-gray-900">Hướng dẫn học tập</h4>
                      </div>
                      <Card className="!border !border-gray-200">
                        <Input.TextArea
                          value={studyGuide}
                          placeholder="Hướng dẫn học tập sẽ xuất hiện ở đây sau khi xử lý..."
                          className="!min-h-[500px]"
                          readOnly
                        />
                      </Card>
                    </div>
                  )
                ) : (
                  <div className="!flex !items-center !justify-center !h-full !text-center">
                    <div className="!max-w-md">
                      <p className="!text-lg !font-semibold !text-gray-700 !mb-3">📖 Chưa chọn tài nguyên học liệu</p>
                      <p className="!text-sm !text-gray-600 !mb-4">
                        Để xem hướng dẫn học tập, vui lòng chọn tài nguyên học liệu từ dropdown ở phần chatbot bên phải, hoặc tải lên file PDF mới.
                      </p>
                      <Button
                        type="primary"
                        onClick={() => setShowUploadArea(true)}
                        className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700"
                      >
                        Tải lên PDF ngay
                      </Button>
                    </div>
                  </div>
                )
              )}

              {activeTab === "keyNotes" && (
                selectedKnowledgeBase ? (
                  loadingContent ? (
                    <div className="!flex !justify-center !items-center !py-12">
                      <Spin size="large" tip="Đang tải ghi chú quan trọng..." />
                    </div>
                  ) : (
                    <div className="!space-y-4">
                      <div className="!flex !items-center !justify-between">
                        <h4 className="!text-lg !font-semibold !text-gray-900">Ghi chú quan trọng</h4>
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
                                    message.info(`Đang chuyển đến trang ${n.pageNumber}...`);
                                  } else {
                                    message.warning('Không có số trang cho ghi chú này');
                                  }
                                }}
                                title="Nhấp đúp để chuyển đến trang PDF"
                              >
                                <div className="!text-sm !text-gray-900 !mb-1">{n.content}</div>
                                {n.pageNumber !== null && (
                                  <div className="!text-xs !text-gray-500 !flex !items-center !gap-1">
                                    <span>📄 Trang {n.pageNumber}</span>
                                    <span className="!text-blue-500">• Nhấp đúp để xem</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <Input.TextArea
                            value={keyNotes}
                            placeholder="Ghi chú quan trọng sẽ xuất hiện ở đây sau khi xử lý..."
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
                      <p className="!text-lg !font-semibold !text-gray-700 !mb-3">📝 Chưa chọn tài nguyên học liệu</p>
                      <p className="!text-sm !text-gray-600 !mb-4">
                        Để xem ghi chú quan trọng, vui lòng chọn tài nguyên học liệu từ dropdown ở phần chatbot bên phải, hoặc tải lên file PDF mới.
                      </p>
                      <Button
                        type="primary"
                        onClick={() => setShowUploadArea(true)}
                        className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700"
                      >
                        Tải lên PDF ngay
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
                      <p className="!text-lg !font-semibold !text-gray-700 !mb-3">📝 Chưa chọn tài nguyên học liệu</p>
                      <p className="!text-sm !text-gray-600 !mb-4">
                        Để ghi chú, vui lòng chọn tài nguyên học liệu từ dropdown ở phần chatbot bên phải, hoặc tải lên file PDF mới.
                      </p>
                      <Button
                        type="primary"
                        onClick={() => setShowUploadArea(true)}
                        className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700"
                      >
                        Tải lên PDF ngay
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
                      <p className="!text-lg !font-semibold !text-gray-700 !mb-3">📄 Chưa chọn tài nguyên học liệu</p>
                      <p className="!text-sm !text-gray-600 !mb-4">
                        Để xem PDF, vui lòng chọn tài nguyên học liệu từ dropdown ở phần chatbot bên phải, hoặc tải lên file PDF mới.
                      </p>
                      <Button
                        type="primary"
                        onClick={() => setShowUploadArea(true)}
                        className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700"
                      >
                        Tải lên PDF ngay
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
        knowledgeBaseId={selectedKnowledgeBase || undefined}
        onCreated={async () => {
          await refetchFlashcards();
          if (selectedKnowledgeBase) {
            const sets = await flashcardSvc.listCardSetsByKnowledgeBase(selectedKnowledgeBase);
            setCardSets(sets);
            if (sets.length > 0 && !sets.find(s => s.id === selectedCardSetId)) {
              const newest = [...sets].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];
              setSelectedCardSetId(newest.id);
            }
          }
        }}
        onClose={() => {
          setShowCreateFlashcards(false);
          refetchFlashcards();
          if (selectedKnowledgeBase) {
            flashcardSvc.listCardSetsByKnowledgeBase(selectedKnowledgeBase).then((sets) => {
              setCardSets(sets);
              if (sets.length > 0 && !sets.find(s => s.id === selectedCardSetId)) {
                const newest = [...sets].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];
                setSelectedCardSetId(newest.id);
              }
            });
          }
        }}
      />
    </div>
  );
}
