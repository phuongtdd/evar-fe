"use client";

import { ReactNode, useState, useEffect } from "react";
import { Button, Input, Avatar, Select, message, Spin, Modal } from "antd";
import {
  SendOutlined,
  SmileOutlined,
  LinkOutlined,
  PaperClipOutlined,
  CameraOutlined,
  RobotOutlined,
} from "@ant-design/icons";
import { useChatbot, useKnowledgeBases } from "../../hooks/evarTutorHooks";
import MaterialsUploadAreaUpdated from "./materials-upload-area-updated";

interface TutorChatPanelProps {
  onPageJump?: (page: number) => void;
  onKnowledgeBaseSelected?: (kbId: number | null) => void;
}

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  sources?: Array<{
    pageNumber: number;
    snippet: string;
    similarity: number;
  }>;
  timestamp: string;
}

function renderMessageWithPageLinks(
  content: string,
  sources?: ChatMessage["sources"],
  onPageJump?: (page: number) => void
): ReactNode {
  if (!onPageJump || !sources) return content;

  const parts: (string | ReactNode)[] = [];
  let lastIndex = 0;

  // Add source links at the end
  if (sources.length > 0) {
    const sourceLinks = sources.map((source, index) => (
      <button
        key={`source-${index}`}
        onClick={() => onPageJump(source.pageNumber)}
        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm font-medium mr-2 mb-1"
      >
        Trang {source.pageNumber}
      </button>
    ));

    parts.push(content);
    parts.push(
      <div key="sources" className="mt-2 pt-2 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-1">Nguồn tham khảo:</p>
        {sourceLinks}
      </div>
    );

    return parts;
  }

  return content;
}

export default function TutorChatPanel({
  onPageJump,
  onKnowledgeBaseSelected,
}: TutorChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Xin chào! Tôi là AI Tutor của bạn. Hãy chọn một knowledge base và đặt câu hỏi để tôi có thể giúp bạn học tập.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<
    number | null
  >(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Knowledge bases are derived from current user context
  const {
    data: knowledgeBases,
    loading: knowledgeBasesLoading,
    refetch: refetchKnowledgeBases,
  } = useKnowledgeBases();
  const { sendMessage, loading: chatLoading } = useChatbot();

  // Notify parent when KB is selected
  const handleKnowledgeBaseChange = (kbId: number | null) => {
    setSelectedKnowledgeBase(kbId);
    onKnowledgeBaseSelected?.(kbId);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!selectedKnowledgeBase) {
      message.warning("Vui lòng chọn knowledge base trước khi đặt câu hỏi");
      return;
    }

    // Kiểm tra KB status
    const selectedKB = knowledgeBases.find(
      (kb) => kb.id === selectedKnowledgeBase
    );
    if (selectedKB?.status !== "READY") {
      message.warning(
        `Knowledge base đang ở trạng thái: ${selectedKB?.status}. Vui lòng đợi xử lý xong (READY) trước khi chat.`
      );
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      const request = {
        knowledgeBaseId: selectedKnowledgeBase,
        question: inputValue,
        topK: 5,
      };

      const response = await sendMessage(request);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: response.answer,
        sources: response.sources,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);

      // Lấy error message từ backend nếu có
      let errorText = "Xin lỗi, tôi không thể trả lời câu hỏi của bạn lúc này.";

      if (error.response?.data?.message) {
        errorText += ` Lỗi: ${error.response.data.message}`;
      } else if (error.response?.status === 500) {
        errorText += " Lỗi server. Vui lòng kiểm tra backend logs.";
      } else if (error.message) {
        errorText += ` ${error.message}`;
      }

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: errorText,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      message.error(errorText);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="!flex !flex-col !h-full !bg-white">
      <div className="!px-4 !py-3 !border-b !border-gray-200 !flex !items-center !justify-between">
        <h3 className="!text-sm !font-semibold !text-gray-900">AI Tutor</h3>
        <div className="!flex !gap-2">
          <Button
            type="default"
            size="small"
            onClick={() => setShowUploadModal(true)}
          >
            Upload PDF
          </Button>
          <Button
            type="text"
            size="small"
            className="!text-gray-400 !hover:text-gray-600"
          >
            ⚙️
          </Button>
        </div>
      </div>

      {/* Knowledge Base Selection */}
      <div className="!px-4 !py-2 !border-b !border-gray-100 !bg-gray-50">
        <Select
          placeholder="Chọn knowledge base"
          value={selectedKnowledgeBase}
          onChange={handleKnowledgeBaseChange}
          className="!w-full"
          loading={knowledgeBasesLoading}
          options={knowledgeBases.map((kb) => ({
            label: (
              <div className="flex items-center justify-between">
                <span>{kb.fileName}</span>
                <span
                  className={`ml-2 px-2 py-0.5 text-xs rounded ${
                    kb.status === "READY"
                      ? "bg-green-100 text-green-800"
                      : kb.status === "PROCESSING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {kb.status}
                </span>
              </div>
            ),
            value: kb.id,
            disabled: kb.status !== "READY",
          }))}
        />
        {selectedKnowledgeBase &&
          knowledgeBases.find((kb) => kb.id === selectedKnowledgeBase)
            ?.status !== "READY" && (
            <div className="text-xs text-yellow-600 mt-1">
              ⚠️ Knowledge base đang xử lý, vui lòng đợi status = READY
            </div>
          )}
      </div>

      <div className="!flex-1 !overflow-y-auto !p-4 !space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`!flex !gap-3 ${
              message.type === "user" ? "!justify-end" : "!justify-start"
            }`}
          >
            {message.type === "assistant" && (
              <Avatar
                size={32}
                className="!bg-orange-500 !flex !items-center !justify-center !text-white !font-bold !flex-shrink-0"
                icon={<RobotOutlined />}
              />
            )}
            <div
              className={`!max-w-xs !rounded-lg !p-3 !text-sm !leading-relaxed ${
                message.type === "user"
                  ? "!bg-blue-600 !text-white"
                  : "!bg-gray-100 !text-gray-900"
              }`}
            >
              {message.type === "assistant"
                ? renderMessageWithPageLinks(
                    message.content,
                    message.sources,
                    onPageJump
                  )
                : message.content}
            </div>
            {message.type === "user" && (
              <Avatar
                size={32}
                className="!bg-blue-500 !flex !items-center !justify-center !text-white !font-bold !flex-shrink-0"
              >
                U
              </Avatar>
            )}
          </div>
        ))}

        {chatLoading && (
          <div className="!flex !gap-3 !justify-start">
            <Avatar
              size={32}
              className="!bg-orange-500 !flex !items-center !justify-center !text-white !font-bold !flex-shrink-0"
              icon={<RobotOutlined />}
            />
            <div className="!bg-gray-100 !rounded-lg !p-3 !text-sm">
              <Spin size="small" /> Đang suy nghĩ...
            </div>
          </div>
        )}
      </div>

      <Modal
        open={showUploadModal}
        footer={null}
        onCancel={() => setShowUploadModal(false)}
        width={720}
      >
        <MaterialsUploadAreaUpdated
          onClose={() => setShowUploadModal(false)}
          onRefetch={refetchKnowledgeBases}
          onUploaded={(kbId: number) => {
            handleKnowledgeBaseChange(kbId);
            setShowUploadModal(false);
            const assistantMessage: ChatMessage = {
              id: (Date.now() + 2).toString(),
              type: "assistant",
              content:
                " Tài liệu đã được xử lý thành công! Keynotes và Flashcards đã được tự động tạo. Bạn có thể xem chúng ở tab 'Studying Guidance' và 'Flashcards', hoặc bắt đầu đặt câu hỏi ngay.",
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
          }}
        />
      </Modal>

      <div className="!border-t !border-gray-200 !p-4 !space-y-3">
        <div className="!flex !gap-2">
          <Input.TextArea
            placeholder="Đặt câu hỏi về tài liệu..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={2}
            disabled={!selectedKnowledgeBase || chatLoading}
            className="!rounded-lg !border-gray-300 [&.ant-input]:!bg-gray-50 [&.ant-input]:!text-gray-900 [&.ant-input::placeholder]:!text-gray-400"
          />
          <Button
            type="primary"
            icon={<SendOutlined className="!text-white" />}
            onClick={handleSendMessage}
            disabled={
              !inputValue.trim() || !selectedKnowledgeBase || chatLoading
            }
            loading={chatLoading}
            className="!bg-blue-600 !border-0 !rounded-lg !h-10 !px-4 hover:!bg-blue-700"
          />
        </div>

        <div className="!flex !gap-2 !justify-center items-center">
          <Button
            type="text"
            size="small"
            icon={<SmileOutlined />}
            className="!text-gray-400 !hover:text-gray-600"
          />
          <div className="!text-center !text-xs !text-gray-400">
            Powered by EVar Tutor AI
          </div>
        </div>
      </div>
    </div>
  );
}
