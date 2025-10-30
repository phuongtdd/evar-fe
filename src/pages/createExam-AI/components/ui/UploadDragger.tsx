import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Button, Spin } from "antd";
import { ocrService } from "../../services/ocrService";
import { QuizInfo, Question } from "../../types";

const { Dragger } = Upload;

interface UploadDraggerProps {
  onProcess: () => void;
  onRemove?: () => void;
  quizInfo: QuizInfo | null;
  onOcrSuccess?: (questions: Question[]) => void;
}

const UploadDragger: React.FC<UploadDraggerProps> = ({ 
  onProcess, 
  onRemove, 
  quizInfo, 
  onOcrSuccess 
}) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessOCR = async () => {
    if (!quizInfo) {
      message.error('Vui lòng nhập thông tin đề thi trước');
      return;
    }

    if (fileList.length === 0) {
      message.error('Vui lòng chọn file trước');
      return;
    }

    setIsProcessing(true);
    const hideLoading = message.loading('Đang xử lý OCR...', 0);

    try {
      const file = fileList[0] as File;
      
      const response = await ocrService.generateExamFromImage({
        file,
        subjectId: quizInfo.subjectId,
        questionType: quizInfo.questionType || 'SINGLE_CHOICE',
        duration: quizInfo.duration || 60,
        examName: quizInfo.examName,
      });

      // Transform backend response to frontend Question format
      const questions: Question[] = response.questions.map((q, index) => ({
        id: index + 1,
        number: index + 1,
        content: q.content,
        questionType: q.questionType,
        hardLevel: q.hardLevel,
        quesScore: q.quesScore,
        questionImg: q.questionImg || undefined,
        answers: q.answers.map(a => ({
          content: a.content,
          isCorrect: false, // User needs to mark correct answers manually
        })),
      }));

      message.success(`Tạo thành công ${questions.length} câu hỏi từ OCR!`);
      
      if (onOcrSuccess) {
        onOcrSuccess(questions);
      }
      
      onProcess();
    } catch (error: any) {
      console.error('OCR Error:', error);
      message.error(error.message || 'Lỗi xử lý OCR. Vui lòng thử lại.');
    } finally {
      hideLoading();
      setIsProcessing(false);
    }
  };

  const props = {
    name: "file",
    multiple: false,
    fileList,
    beforeUpload: (file: File) => {
      // Validate file type - only PNG and JPG supported
      const isPNG = file.type === 'image/png';
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg';
      
      if (!isPNG && !isJPG) {
        message.error('Chỉ hỗ trợ file ảnh PNG và JPG!');
        return Upload.LIST_IGNORE;
      }

      // Validate file size (max 10MB)
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File phải nhỏ hơn 10MB!');
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      message.success(`${file.name} đã được chọn`);
      
      // Prevent auto upload
      return false;
    },
    onRemove: (file: any) => {
      setFileList([]);
      if (onRemove) {
        onRemove();
      }
    },
  };

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-end">
     <div className="w-full">
       <Dragger {...props}>
        {fileList.length === 0 && (
          <>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Kéo thả hoặc click để chọn file
            </p>
            <p className="ant-upload-hint">
              Chỉ hỗ trợ file ảnh PNG và JPG. Kích thước tối đa 10MB.
              <br />
              File sẽ được xử lý bằng AI OCR để tạo câu hỏi tự động.
            </p>
          </>
        )}
      </Dragger>
     </div>
      <Button
        type="primary"
        onClick={handleProcessOCR}
        disabled={fileList.length === 0 || isProcessing}
        loading={isProcessing}
        className="mt-5"
      >
        {isProcessing ? 'Đang xử lý...' : 'Xử lý với AI OCR'}
      </Button>
    </div>
    </>
  );
};

export default UploadDragger;
