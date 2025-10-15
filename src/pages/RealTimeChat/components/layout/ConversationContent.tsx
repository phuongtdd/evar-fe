import { Avatar, Button, Input } from "antd";
import {
  CloseOutlined,
  FilterOutlined,
  MoreOutlined,
  PaperClipOutlined,
  SearchOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { chatList, chatMessagesByChatId } from "../../mock/data";
import { ChatMessage, sharedFiles } from "../../types";
import { useState } from "react";
import Modal from "../ui/Modal";
import ChatHeader from "../ui/ChatHeader";
import TabChatDetail from "../ui/TabChatDetail";
import Message from "../ui/Message";
import SendMessage from "../ui/SendMessage";

interface Props {
  chatId: number;
}

export default function ConversationContent({ chatId }: Props) {
  const selectedChatData = chatList.find((chat) => chat.id === chatId);
  const [messages, setMessages] = useState<ChatMessage[]>(
    chatMessagesByChatId[chatId] || []
  );
  const [showDetails, setShowDetails] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(
    null
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg: ChatMessage = {
        id: messages.length + 1,
        type: "sent",
        content: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMsg]);
      chatMessagesByChatId[chatId] = [...messages, newMsg];
      setNewMessage("");
    }
  };

  const handleDeleteMessage = () => {
    if (selectedMessageId) {
      const updatedMessages = messages.filter(
        (msg) => msg.id !== selectedMessageId
      );
      setMessages(updatedMessages);
      chatMessagesByChatId[chatId] = updatedMessages;
      setShowOptionsModal(false);
      setSelectedMessageId(null);
    }
  };

  const handleCopyMessage = () => {
    if (selectedMessageId) {
      const message = messages.find((msg) => msg.id === selectedMessageId);
      if (message?.content) {
        navigator.clipboard.writeText(message.content);
      }
      setShowOptionsModal(false);
      setSelectedMessageId(null);
    }
  };

  if (!chatId || !selectedChatData) {
    return null;
  }

  return (
    <>
      <main className="relative flex flex-1 flex-col bg-white min-h-0 h-full">
        <ChatHeader
          selectedChatData={selectedChatData}
          showDetails={showDetails}
          setShowDetails={setShowDetails}
        />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 pb-24">
            {showDetails ? (
              <>
                {showDetails && (
                  <div
                    className="absolute inset-0 z-10 bg-gray-900/40"
                    onClick={() => setShowDetails(false)}
                  />
                )}
                <TabChatDetail
                  showDetails={showDetails}
                  setShowDetails={setShowDetails}
                  sharedFiles={sharedFiles}
                />
              </>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <Message
                    message={message}
                    setSelectedMessageId={setSelectedMessageId}
                    setShowOptionsModal={setShowOptionsModal}
                  />
                ))}
              </div>
            )}
          </div>
          <SendMessage
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
          />
        </div>
      </main>

      <Modal
        isOpen={showOptionsModal}
        onClose={() => {
          setShowOptionsModal(false);
          setSelectedMessageId(null);
        }}
        title="Tùy chọn tin nhắn"
      >
        <div className="flex flex-col gap-3">
          <button
            className="w-full h-10 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={handleDeleteMessage}
          >
            Xóa tin nhắn
          </button>
          <button
            className="w-full h-10 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleCopyMessage}
          >
            Sao chép
          </button>
        </div>
      </Modal>
    </>
  );
}
