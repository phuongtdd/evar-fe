"use client";

import { useState } from "react";
import { Layout, Tabs, Button, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MaterialsGrid from "./materials-grid";
import TutorChatPanel from "../component/tutor-chat-panel";
import PdfViewer from "../component/pdf-viewer";
import NotePage from "../component/ note-page";
import CreateFlashcardsModal from "../component/create-flashcards-modal";
import MaterialsUploadArea from "../component/materials-upload-area";

const { Content } = Layout;

export default function StudyMaterialLayout() {
  const [activeTab, setActiveTab] = useState("quizzes");
  const [showCreateFlashcards, setShowCreateFlashcards] = useState(false);
  const [showUploadArea, setShowUploadArea] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
              New
            </Button>
          </div>
        </div>

        <div className="!px-6 !pt-4 !border-b !border-gray-200">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: "quizzes", label: "Quizzes" },
              { key: "flashcards", label: "Flashcards" },
              { key: "materials", label: "Materials" },
              { key: "pdf", label: "PDF Views" },
              { key: "notes", label: "Notes" },
            ]}
            className="[&_.ant-tabs-tab]:!px-0 [&_.ant-tabs-tab]:!mr-8"
          />
        </div>

        <Content className="!flex-1 !overflow-auto !px-6 !py-4">
          {showUploadArea ? (
            <MaterialsUploadArea onClose={() => setShowUploadArea(false)} />
          ) : (
            <>
              {activeTab === "quizzes" && <MaterialsGrid type="quiz" />}
              {activeTab === "flashcards" && (
                <div className="!flex !items-center !justify-center !h-full">
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => setShowCreateFlashcards(true)}
                    className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700 hover:!border-blue-700"
                  >
                    Create Flashcards
                  </Button>
                </div>
              )}
              {activeTab === "materials" && <MaterialsGrid type="material" />}
              {activeTab === "pdf" && (
                <PdfViewer
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  totalPages={10}
                />
              )}
              {activeTab === "notes" && <NotePage type="material" />}
            </>
          )}
        </Content>
      </div>

      <div className="!w-180 !border-l !border-gray-200 !bg-white !flex !flex-col">
        <div className="!flex-1 !min-h-0 !border-t !border-gray-200 !overflow-hidden">
          <TutorChatPanel onPageJump={setCurrentPage} />
        </div>
      </div>

      <CreateFlashcardsModal
        open={showCreateFlashcards}
        onClose={() => setShowCreateFlashcards(false)}
      />
    </div>
  );
}
