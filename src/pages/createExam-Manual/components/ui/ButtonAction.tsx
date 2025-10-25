import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  setShowSaveModal: (value: boolean) => void;
}

const ButtonAction = ({ setShowSaveModal }: Props) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            icon={<ArrowLeftOutlined />}
            className="font-semibold"
            onClick={() => navigate("/quiz")}
          >
            Về trang quản lí
          </Button>
          <span className="text-xl font-bold ml-4">Tạo Quiz thủ công</span>
        </div>
        <div className="flex gap-3">
          <Button type="primary" danger>
            Đóng tạo
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            className="bg-blue-500 font-semibold"
            onClick={() => setShowSaveModal(true)}
          >
            Lưu bài quiz
          </Button>
        </div>
      </div>
    </>
  );
};

export default ButtonAction;
