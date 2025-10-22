import React from "react";
import { Modal, Button } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";

type Props = {
  open: boolean;
  onCancel: () => void;
  onSave: () => void;
};

export default function SaveConfirmModal({ open, onCancel, onSave }: Props) {
  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      centered
      width={340}
      bodyStyle={{ padding: 32 }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="text-2xl font-bold">Xác nhận lưu</div>
        <Button
          type="text"
          icon={<CloseCircleFilled style={{ color: "#FF3B30", fontSize: 20 }} />}
          onClick={onCancel}
        />
      </div>
      <div className="text-center text-red-500 font-semibold mb-6">Vui lòng lựa chọn</div>
      <div className="flex gap-4 justify-center">
        <Button
          type="primary"
          danger
          className="bg-red-500 font-bold w-28"
          onClick={onCancel}
        >
          Hủy
        </Button>
        <Button
          type="primary"
          className="bg-blue-500 font-bold w-28"
          onClick={onSave}
        >
          Lưu
        </Button>
      </div>
    </Modal>
  );
}