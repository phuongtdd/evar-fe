import { MoreOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import React from "react";
import { ChatItem } from "../../types";

interface ChatProps{
    selectedChatData : ChatItem,
    showDetails: boolean
    setShowDetails: (value: boolean ) => void;
}

const ChatHeader = ({selectedChatData,showDetails, setShowDetails} :ChatProps) => {
  return (
    <>
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar size={48} src={selectedChatData?.avatar} />
          <span className="text-lg font-semibold">
            {selectedChatData?.name}
          </span>
        </div>
        <button
          className="text-gray-600 hover:text-gray-900"
          onClick={() => setShowDetails(!showDetails)}
        >
          <MoreOutlined className="text-xl" />
        </button>
      </div>
    </>
  );
};

export default ChatHeader;
