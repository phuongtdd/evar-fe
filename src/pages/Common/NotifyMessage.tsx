import React from "react";
import { Button, message, Space } from "antd";

interface MessageProps {
  onAction?: (
    showMessage: (
      type: "success" | "warning" | "error",
      content: string
    ) => void
  ) => void;
}

const NotifyMessage: React.FC<MessageProps> = ({ onAction }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const showMessage = (
    type: "success" | "error" | "warning",
    content: string
  ) => {
    messageApi.open({
      type,
      content,
    });
  };


  return (
    <>
      {contextHolder}
      <Space>
        <div></div>
      </Space>
    </>
  );
};

export default NotifyMessage;
