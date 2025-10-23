"use client";

import { Button, message } from "antd";

export default function TestMessage() {
  const showMessages = () => {
    message.success("Success message!");
    message.error("Error message!");
    message.warning("Warning message!");
    message.info("Info message!");
  };

  return (
    <div className="p-4">
      <h3>Test Message Component</h3>
      <Button onClick={showMessages} type="primary">
        Test All Messages
      </Button>
    </div>
  );
}
