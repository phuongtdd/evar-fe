import { useState } from "react";
import { Input, Avatar } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { chatList, chatMessagesByChatId } from "../../mock/data";
import { ChatItem, ChatMessage } from "../../types";
import Modal from "../ui/Modal";
import ConversationContent from "./ConversationContent";

const ChatLayout = () => {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [showListOptionsModal, setShowListOptionsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [chats, setChats] = useState<ChatItem[]>(chatList); 
  const [searchQuery, setSearchQuery] = useState(""); 

  const handleCreateChat = () => {
    if (newName.trim()) {
      const newChat: ChatItem = {
        id: chats.length + 1,
        name: newName,
        message: "Bắt đầu cuộc trò chuyện mới",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${chats.length + 1}`,
      };
      setChats([...chats, newChat]);
      chatMessagesByChatId[newChat.id] = []; 
      setNewName("");
      setShowCreateModal(false);
      setSelectedChat(newChat.id); 
    }
  };

  const handleRename = () => {
    if (newName.trim() && selectedChat) {
      setChats(
        chats.map((chat) =>
          chat.id === selectedChat ? { ...chat, name: newName } : chat
        )
      );
      setNewName("");
      setShowRenameModal(false);
      setShowListOptionsModal(false);
    }
  };

  const handleDelete = () => {
    if (selectedChat) {
      setChats(chats.filter((chat) => chat.id !== selectedChat));
      delete chatMessagesByChatId[selectedChat]; 
      setShowDeleteModal(false);
      setShowListOptionsModal(false);
    }
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex h-screen flex-col bg-gray-50">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex w-96 flex-col border-r border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between gap-2">
                <Input
                  placeholder="Tìm cuộc trò chuyện"
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="rounded-lg"
                  size="large"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100">
                    <UserOutlined className="text-md" />
                  </button>
                  <button
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <PlusOutlined className="text-lg" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  className={`flex cursor-pointer items-center gap-3 border-b border-gray-100 p-4 transition-colors hover:bg-[#497ee0] ${
                    selectedChat === chat.id ? "bg-[#6392E9]" : ""
                  }`}
                >
                  <Avatar size={48} src={chat.avatar} />
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${selectedChat === chat.id ? "text-white" : "text-black"}`}>
                        {chat.name}
                      </span>
                      <span className={`text-xs ${selectedChat === chat.id ? "text-white" : "text-black"}`}>{chat.time}</span>
                    </div>
                    <p className={`truncate text-sm ${selectedChat === chat.id ? "text-white" : "text-black"}`}>
                      {chat.message}
                    </p>
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedChat(chat.id);
                      setShowListOptionsModal(true);
                    }}
                  >
                    <MoreOutlined />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-1 bg-white">
            {selectedChat ? (
              <ConversationContent chatId={selectedChat} />
            ) : (
              <main className="flex flex-1 items-center justify-center bg-white">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <span className="flex text-[24px] font-semibold text-gray-800 items-center justify-center top-20">
                      Vui lòng chọn 1 cuộc hội thoại
                    </span>
                    <div className="flex h-124 w-124 items-center justify-center">
                      <img
                        src="https://cdn.dribbble.com/userupload/33219605/file/original-3e652baea723121800ca0068452af00e.gif"
                        alt="robot ui"
                      />
                    </div>
                  </div>
                </div>
              </main>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showListOptionsModal}
        onClose={() => setShowListOptionsModal(false)}
        title="Tuỳ chọn cuộc trò chuyện"
      >
        <div className="flex flex-col gap-3">
          <button
            className="w-full h-10 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            onClick={() => {
              setShowListOptionsModal(false);
              setShowDeleteModal(true);
            }}
          >
            Xoá hội thoại
          </button>
          <button
            className="w-full h-10 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => {
              setShowListOptionsModal(false);
              setShowRenameModal(true);
            }}
          >
            Đặt biệt danh
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Xác nhận xóa hội thoại"
      >
        <div className="flex flex-col gap-4">
          <p className="text-center text-gray-600">Bạn có chắc chắn muốn xóa hội thoại này?</p>
          <div className="flex gap-3">
            <button
              className="flex-1 h-10 rounded-lg bg-gray-300 text-gray-700 font-medium hover:bg-gray-400 transition-colors duration-200"
              onClick={() => setShowDeleteModal(false)}
            >
              Hủy
            </button>
            <button
              className="flex-1 h-10 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors duration-200"
              onClick={handleDelete}
            >
              Xóa
            </button>
          </div>
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal
        isOpen={showRenameModal}
        onClose={() => setShowRenameModal(false)}
        title="Đặt biệt danh"
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nhập biệt danh mới"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-3">
            <button
              className="flex-1 h-10 rounded-lg bg-gray-300 text-gray-700 font-medium hover:bg-gray-400 transition-colors duration-200"
              onClick={() => setShowRenameModal(false)}
            >
              Hủy
            </button>
            <button
              className="flex-1 h-10 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
              onClick={handleRename}
            >
              Lưu
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo cuộc trò chuyện mới"
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nhập tên cuộc trò chuyện"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-3">
            <button
              className="flex-1 h-10 rounded-lg bg-gray-300 text-gray-700 font-medium hover:bg-gray-400 transition-colors duration-200"
              onClick={() => setShowCreateModal(false)}
            >
              Hủy
            </button>
            <button
              className="flex-1 h-10 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
              onClick={handleCreateChat}
            >
              Tạo
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ChatLayout;