import { PaperClipOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import React from "react";
import { ChatMessage } from "../../types";

interface Props {
  newMessage: string;
  handleSendMessage: () => void; 
  setNewMessage: (value: string) => void;
}

const SendMessage = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
}: Props) => {
  return (
    <>
      <div className="w-full p-4 bg-white border-t border-gray-200 ">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-blue-50 px-4 py-3">
            <Input
              placeholder="Nhập tin nhắn ......"
              className="flex-1 bg-transparent"
              size="large"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onPressEnter={handleSendMessage}
            />
            <button className="flex h-8 w-8 items-center justify-center text-blue-600 hover:text-blue-700">
              <PaperClipOutlined className="text-lg" />
            </button>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<SendOutlined />}
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            onClick={handleSendMessage}
          />
        </div>
      </div>
    </>
  );
};

export default SendMessage;
