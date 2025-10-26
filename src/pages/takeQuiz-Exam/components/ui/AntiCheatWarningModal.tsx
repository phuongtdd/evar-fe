import React from "react";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

interface AntiCheatWarningModalProps {
  visible: boolean;
  type: "copy-paste" | "tab-switch";
  count: number;
  onClose: () => void;
}

const AntiCheatWarningModal: React.FC<AntiCheatWarningModalProps> = ({
  visible,
  type,
  count,
  onClose,
}) => {
  const isCopyPaste = type === "copy-paste";
  const maxAttempts = isCopyPaste ? Infinity : 3;
  const remainingAttempts = maxAttempts === Infinity ? Infinity : maxAttempts - count;

  const getTitle = () => {
    if (isCopyPaste) {
      return "⚠️ Cảnh báo: Phát hiện Copy-Paste";
    }
    return "⚠️ Cảnh báo: Phát hiện chuyển Tab";
  };

  const getContent = () => {
    if (isCopyPaste) {
      return (
        <div className="space-y-3">
          <p className="text-[16px] text-gray-700">
            Hệ thống đã phát hiện bạn đang cố gắng sao chép nội dung trong bài thi.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-[14px] text-red-700 font-semibold">
              ⛔ Hành vi này bị cấm trong quá trình thi
            </p>
          </div>
          <p className="text-[14px] text-gray-600">
            Số lần vi phạm: <span className="font-bold text-red-600">{count}</span>
          </p>
          <p className="text-[14px] text-gray-600">
            Vui lòng tuân thủ quy định thi để đảm bảo tính công bằng.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        <p className="text-[16px] text-gray-700">
          Hệ thống đã phát hiện bạn chuyển sang tab/cửa sổ khác trong quá trình thi.
        </p>
        <div className={`border rounded-lg p-3 ${remainingAttempts <= 1 ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <p className={`text-[14px] font-semibold ${remainingAttempts <= 1 ? 'text-red-700' : 'text-yellow-700'}`}>
            {remainingAttempts <= 1 
              ? "⛔ Cảnh báo cuối cùng!" 
              : "⚠️ Hành vi này bị cấm trong quá trình thi"}
          </p>
        </div>
        <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
          <span className="text-[14px] text-gray-600">Số lần vi phạm:</span>
          <span className="font-bold text-red-600 text-[18px]">{count}/3</span>
        </div>
        {remainingAttempts > 0 && (
          <p className="text-[14px] text-gray-600">
            Còn lại: <span className="font-bold text-orange-600">{remainingAttempts}</span> lần cảnh báo
          </p>
        )}
        {remainingAttempts <= 1 && (
          <div className="bg-red-100 border border-red-300 rounded-lg p-3">
            <p className="text-[14px] text-red-800 font-semibold">
              🚨 Nếu vi phạm thêm 1 lần nữa, bài thi sẽ tự động được nộp!
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      open={visible}
      title={
        <div className="flex items-center gap-2">
          <ExclamationCircleOutlined className="text-red-500 text-[24px]" />
          <span className="text-[18px] font-bold">{getTitle()}</span>
        </div>
      }
      onOk={onClose}
      onCancel={onClose}
      okText="Đã hiểu"
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{
        className: "!bg-[#6392e9] !hover:bg-[#5282d8]",
      }}
      centered
      width={500}
    >
      {getContent()}
    </Modal>
  );
};

export default AntiCheatWarningModal;
