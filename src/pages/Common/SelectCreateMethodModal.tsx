import React from "react";
import { Modal, Button } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";

type Props = {
  open: boolean;
  onManual: () => void;
  onAI: () => void;
  onCancel: () => void;
};

export default function SelectCreateMethodModal({ open, onManual, onAI, onCancel }: Props) {
  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      centered
      width={400}
      className="rounded-xl"
      bodyStyle={{ padding: 40 }}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="text-3xl font-bold">Tạo bài kiểm tra mới</div>
        <Button
          type="text"
          icon={<CloseCircleFilled style={{ color: "#FF3B30", fontSize: 24 }} />}
          onClick={onCancel}
        />
      </div>
      <div className="text-center mb-8 text-base">Vui lòng chọn phương pháp để tiếp tục</div>
      <div className="flex flex-col gap-4 items-center">
        <Button
          type="default"
          size="large"
          className="border-blue-500 text-blue-500 font-bold w-64"
          onClick={onManual}
        >
          Tạo thủ công
        </Button>
        <Button
          type="primary"
          size="large"
          className="bg-blue-500 font-bold w-64"
          onClick={onAI}
        >
          Tạo với AI OCR
        </Button>
      </div>
    </Modal>
  );
}