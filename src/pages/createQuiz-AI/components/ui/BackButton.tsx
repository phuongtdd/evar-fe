import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        icon={<ArrowLeftOutlined />}
        type="primary"
        onClick={() => navigate("/dashboard")}
      >
        <span>Về trang quản lí</span>
      </Button>
    </>
  );
};

export default BackButton;
