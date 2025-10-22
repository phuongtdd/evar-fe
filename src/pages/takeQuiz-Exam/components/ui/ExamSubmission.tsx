import React from 'react';
import { Button, Modal } from 'antd';
import { ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ExamSubmissionProps } from '../../types';
import { EXAM_MESSAGES } from '../../constants';

const ExamSubmission: React.FC<ExamSubmissionProps> = ({
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const handleSubmit = () => {
    setIsModalVisible(true);
  };

  const handleConfirmSubmit = () => {
    setIsModalVisible(false);
    onSubmit();
  };

  const handleCancelSubmit = () => {
    setIsModalVisible(false);
  };

  return (
    <>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <ExclamationCircleOutlined className="text-[#faad14] text-[20px]" />
            <span className="text-[20px] font-semibold">Xác nhận nộp bài</span>
          </div>
        }
        open={isModalVisible}
        onOk={handleConfirmSubmit}
        onCancel={handleCancelSubmit}
        okText="Nộp bài"
        cancelText="Hủy"
        okButtonProps={{
          className: 'bg-[#6392e9] hover:bg-[#5282d8] text-white rounded-[8px]'
        }}
        cancelButtonProps={{
          className: 'rounded-[8px]'
        }}
        centered
      >
        <div className="py-4">
          <p className="text-[16px] text-gray-700 mb-4">
            {EXAM_MESSAGES.SUBMIT_CONFIRMATION}
          </p>
          <div className="bg-[#f0f9ff] border border-[#0ea5e9] rounded-[8px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleOutlined className="text-[#0ea5e9]" />
              <span className="text-[14px] font-semibold text-[#0ea5e9]">
                Lưu ý quan trọng:
              </span>
            </div>
            <ul className="text-[14px] text-gray-600 space-y-1">
              <li>• Sau khi nộp bài, bạn không thể thay đổi đáp án</li>
              <li>• Hệ thống sẽ tự động tính điểm dựa trên đáp án của bạn</li>
              <li>• Kết quả sẽ được hiển thị ngay sau khi nộp bài</li>
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ExamSubmission;
