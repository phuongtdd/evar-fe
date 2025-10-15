import { MoreOutlined, PaperClipOutlined } from "@ant-design/icons";
import React from "react";
import { ChatMessage } from "../../types";


interface MessageProps {
  message: ChatMessage;
  setSelectedMessageId: (value: number) => void;
  setShowOptionsModal: (value: boolean) => void;
}

const Message = ({ message, setSelectedMessageId , setShowOptionsModal}: MessageProps) => {
  return (
    <>
      <div
        key={message.id}
        className={`flex ${
          message.type === "sent" ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`flex max-w-2xl flex-col gap-1 ${
            message.type === "sent" ? "items-end" : "items-start"
          }`}
        >
          {message.content && (
            <div
              className={`rounded-2xl px-4 py-3 ${
                message.type === "sent"
                  ? "bg-blue-100 text-gray-900"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          )}
          {message.attachment && (
            <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm border border-gray-200">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <PaperClipOutlined className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {message.attachment.name}
                </p>
                <p className="text-xs text-gray-500">
                  {message.attachment.size}
                </p>
              </div>
            </div>
          )}
          {!message.content && !message.attachment && (
            <div className="group relative flex items-center gap-2 rounded-2xl bg-blue-100 px-4 py-3">
              <div className="h-16 w-64"></div>
              <button
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMessageId(message.id);
                  setShowOptionsModal(true);
                }}
              >
                <MoreOutlined className="text-gray-600" />
              </button>
            </div>
          )}
          <span className="px-2 text-xs text-gray-500">{message.time}</span>
        </div>
      </div>
    </>
  );
};

export default Message;
