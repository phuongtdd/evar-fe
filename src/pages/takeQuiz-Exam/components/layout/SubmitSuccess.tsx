import React, { useState, useEffect } from "react";
import { Button, Card, Spin, Collapse, Tag, Badge, Tooltip, Modal } from "antd";
import {
  CheckCircleOutlined,
  HomeOutlined,
  EyeOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

interface SubmitSuccessProps {
  examName?: string;
  submittedAt?: string;
  onViewResults?: () => void;
  onBackToDashboard?: () => void;
  submissionDetails?: any; 
  totalQuestions?: number; 
}

const SubmitSuccess: React.FC<SubmitSuccessProps> = ({
  examName = "Bài thi",
  submittedAt = new Date().toLocaleString("vi-VN"),
  onViewResults,
  onBackToDashboard,
  submissionDetails,
  totalQuestions = 10,
}) => {
  const [isViewingResults, setIsViewingResults] = useState(false);
  const [isGoingHome, setIsGoingHome] = useState(false);
  const [showQuestionDetails, setShowQuestionDetails] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: string]: boolean}>({});
  const [imageErrorStates, setImageErrorStates] = useState<{[key: string]: boolean}>({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");


  const handleImageLoad = (questionIndex: number) => {
    setImageLoadingStates(prev => ({ ...prev, [questionIndex]: false }));
    setImageErrorStates(prev => ({ ...prev, [questionIndex]: false }));
  };

  const handleImageError = (questionIndex: number) => {
    setImageLoadingStates(prev => ({ ...prev, [questionIndex]: false }));
    setImageErrorStates(prev => ({ ...prev, [questionIndex]: true }));
  };

  const handleImageClick = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl);
    setPreviewVisible(true);
  };

  // Initialize image loading states when submission details change
  useEffect(() => {
    if (submissionDetails?.questions) {
      const initialLoadingStates: {[key: string]: boolean} = {};
      const initialErrorStates: {[key: string]: boolean} = {};
      
      submissionDetails.questions.forEach((question: any, index: number) => {
        if (question.questionImg) {
          initialLoadingStates[index] = true;
          initialErrorStates[index] = false;
        }
      });
      
      setImageLoadingStates(initialLoadingStates);
      setImageErrorStates(initialErrorStates);
    }
  }, [submissionDetails]);

  const handleViewResults = () => {
    console.log("SubmitSuccess - handleViewResults called");
    console.log("Submission details in SubmitSuccess:", submissionDetails);
    setShowQuestionDetails(true);
  };

  const handleQuestionSelect = (index: number) => {
    setSelectedQuestionIndex(index);

    setTimeout(() => {
      const questionElement = document.getElementById(`question-${index}`);
      if (questionElement) {
        questionElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const getQuestionStatus = (question: any) => {
    if (!question.answers) return "not-answered";
    const hasCorrectAnswer = question.answers.some(
      (answer: any) => answer.correct && answer.select
    );
    const hasSelectedAnswer = question.answers.some(
      (answer: any) => answer.select
    );

    if (hasCorrectAnswer) return "correct";
    if (hasSelectedAnswer) return "wrong";
    return "not-answered";
  };

  const getQuestionStatusColor = (status: string) => {
    switch (status) {
      case "correct":
        return "bg-green-500";
      case "wrong":
        return "bg-red-500";
      case "not-answered":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      <div className="p-5 flex flex-col items-center justify-center">
        <Card className="w-[70%] flex flex-col items-center justify-center">
          <div className="text-center flex flex-col items-center justify-center gap-3">
            <div className="mb-8">
              <p className="text-[24px] text-green-500 mb-4">
                Bạn đã nộp bài thi thành công.
              </p>
              <div className="flex flex-row items-center">
                <span className="text-[24px]">Kết quả :</span>
                <span className="text-[54px] mx-auto">
                  <span>
                    {submissionDetails ? submissionDetails.totalScore : 4}
                  </span>
                  <span>/{totalQuestions}</span>
                </span>
              </div>
              <p className="text-[16px] text-gray-500">
                Thời gian nộp bài: {submittedAt}
              </p>
            </div>

            <div
              className="grid grid-cols-2 
            !gap-[15.25rem] px-4"
            >
              {/* Left Column - Stats */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-normal">
                    Số câu hỏi :
                  </span>
                  <span className="text-lg font-semibold text-gray-900">
                    {submissionDetails
                      ? submissionDetails.questions.length
                      : 40}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-normal">
                    Số câu đúng :
                  </span>
                  <span className="text-lg font-semibold text-green-600">
                    {submissionDetails
                      ? submissionDetails.totalScore
                      : 40}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-normal">
                    Số câu sai :
                  </span>
                  <span className="text-lg font-semibold text-red-600">
                    {submissionDetails
                      ? submissionDetails.questions.length - submissionDetails.totalScore
                      : 10}
                  </span>
                </div>
              </div>

              {/* Right Column - Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-normal">bài thi : </span>
                  <span className="text-gray-900 font-semibold">
                    {submissionDetails?.examName || examName}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-normal">
                    Người làm bài :{" "}
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {submissionDetails?.username || "Super Idol desaurung"}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-normal">
                    Thời gian làm bài :{" "}
                  </span>
                  <span className="text-gray-900 font-semibold">
                    20:20:00 / 120:00:00
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              {onViewResults && (
                <Button
                  onClick={handleViewResults}
                  loading={isViewingResults}
                  icon={<EyeOutlined />}
                  className="!bg-[#6392e9] !hover:bg-[#5282d8] text-white rounded-[8px] h-[50px] px-8 text-[18px] font-semibold"
                >
                  {isViewingResults ? "Đang tải..." : "Chi tiết"}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {showQuestionDetails && submissionDetails && (
          <div className="w-[70%] mx-auto mt-8 flex flex-row justify-between gap-4">
            <Card className="flex-1 !p-0 !bg-white !border-0">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <Button
                    onClick={() => setShowQuestionDetails(false)}
                    className="!bg-gray-500 !hover:bg-gray-600 text-white rounded-[8px]"
                  >
                  Đóng
                  </Button>
                </div>

                <section
                  className="order-1"
                  id="question-details"
                  aria-label="Question details"
                >
                  <h3 className="text-[20px] font-semibold text-black mb-4">
                    Chi tiết từng câu hỏi
                  </h3>

                  {submissionDetails.questions.map(
                    (question: any, index: number) => {
                      const isCorrect = question.answers.some(
                        (answer: any) => answer.correct && answer.select
                      );
                      const userSelectedAnswer = question.answers.find(
                        (answer: any) => answer.select
                      );
                      const correctAnswer = question.answers.find(
                        (answer: any) => answer.correct
                      );

                      return (
                        <div
                          key={index}
                          id={`question-${index}`}
                          className="mb-6 bg-white rounded-[12px] border border-[#d5d5d5] p-6"
                        >
                          <div className="flex items-center gap-4 mb-6">
                            <span className="text-[24px] text-black">
                              Câu hỏi số :
                            </span>
                            <Badge className="bg-[#6392e9] text-white text-[24px] px-4 py-2 rounded-[8px]">
                              {index + 1}
                            </Badge>
                            {isCorrect ? (
                              <CheckCircleOutlined className="text-green-500 text-2xl" />
                            ) : (
                              <CloseCircleOutlined className="text-red-500 text-2xl" />
                            )}
                          </div>


<div className="w-full flex flex-col items-center justify-center relative">
       {question.questionImg && (
        <>
        <strong className="absolute top-0 left-0">Hình ảnh: </strong>
          <div className="mt-4 max-width-[300px] relative">
            {imageLoadingStates[index] && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-[8px] border border-[#d5d5d5] min-h-[200px]">
                <div className="text-center">
                  <Spin size="large" />
                  <p className="mt-2 text-gray-500 text-sm">Đang tải hình ảnh...</p>
                </div>
              </div>
            )}
            {imageErrorStates[index] && (
              <div className="flex items-center justify-center bg-gray-100 rounded-[8px] border border-[#d5d5d5] min-h-[200px] p-4">
                <div className="text-center text-gray-500">
                  <p className="text-sm">Không thể tải hình ảnh</p>
                  <p className="text-xs mt-1">Vui lòng kiểm tra kết nối mạng</p>
                </div>
              </div>
            )}
            <Tooltip title="Nhấn để xem hình ảnh lớn hơn" placement="top">
              <img
                src={question.questionImg}
                alt="Question image"
                className={`max-w-full h-auto rounded-[8px] border !border-[#d5d5d5] transition-opacity duration-300 ${
                  imageLoadingStates[index] || imageErrorStates[index] ? 'opacity-0 absolute' : 'opacity-100 image-loaded'
                } ${!imageErrorStates[index] ? 'cursor-pointer hover:opacity-80' : ''}`}
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
                onClick={() => handleImageClick(question.questionImg)}
                style={{ display: imageLoadingStates[index] || imageErrorStates[index] ? 'none' : 'block' }}
              />
            </Tooltip>
            {!imageErrorStates[index] && !imageLoadingStates[index] && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                <EyeOutlined className="text-sm" />
              </div>
            )}
          </div>
        </>
        )}  
      </div>
                          <div className="text-[18px] text-black mb-6 leading-relaxed">
                            {question.questionContent}
                          </div>

                          {userSelectedAnswer && (
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-[8px]">
                              <p className="text-[16px] font-semibold text-blue-800">
                                Lựa chọn của bạn:{" "}
                                {String.fromCharCode(
                                  65 +
                                    question.answers.indexOf(userSelectedAnswer)
                                )}
                              </p>
                            </div>
                          )}

                          {!isCorrect && correctAnswer && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-[8px]">
                              <p className="text-[16px] font-semibold text-green-800">
                                Đáp án đúng:{" "}
                                {String.fromCharCode(
                                  65 + question.answers.indexOf(correctAnswer)
                                )}
                              </p>
                            </div>
                          )}

                          <div className="space-y-3">
                            {question.answers.map(
                              (answer: any, answerIndex: number) => {
                                const isUserSelected = answer.select;
                                const isCorrectAnswer = answer.correct;

                                return (
                                  <div
                                    key={answerIndex}
                                    className={`p-4 rounded-[8px] border-2 flex items-center justify-between ${
                                      isCorrectAnswer
                                        ? "bg-green-50 border-green-300"
                                        : isUserSelected && !isCorrectAnswer
                                        ? "bg-red-50 border-red-300"
                                        : "bg-gray-50 border-gray-200"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="font-bold text-[18px]">
                                        {String.fromCharCode(65 + answerIndex)}.
                                      </span>
                                      <span className="text-[16px]">
                                        {answer.answerContent}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      {isCorrectAnswer ? (
                                        <CheckCircleOutlined className="text-green-600 text-xl" />
                                      ) : isUserSelected && !isCorrectAnswer ? (
                                        <CloseCircleOutlined className="text-red-600 text-xl" />
                                      ) : null}
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </section>
              </div>
            </Card>

            <Card className="w-[30%] h-[500px] !p-4">
              <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-3">Bản đồ câu hỏi</h3>
                <div className="text-[14px] font-medium w-full justify-end"> 
                  Số câu hỏi : 
                  <span>{submissionDetails.questions.length}</span>
                </div>
                <div className="flex justify-center gap-6 text-sm my-5">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-green-500 rounded"></span>
                    <span>Đúng</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-red-500 rounded"></span>
                    <span>Sai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-orange-500 rounded"></span>
                    <span>Chưa trả lời</span>
                  </div>
                </div>
                <div className="overflow-y-auto">
                  <div className="grid grid-cols-5 gap-2 min-w-max mb-4">
                    {submissionDetails.questions.map(
                      (question: any, index: number) => {
                        const status = getQuestionStatus(question);
                        const isSelected = selectedQuestionIndex === index;
                        return (
                          <button
                            key={index}
                            onClick={() => handleQuestionSelect(index)}
                            className={`
                          w-10 h-10 rounded-lg text-white font-semibold text-sm
                          ${getQuestionStatusColor(status)}
                          ${
                            isSelected
                              ? "ring-4 ring-blue-300 scale-110 shadow-lg"
                              : ""
                          }
                          hover:opacity-80 hover:scale-105 transition-all duration-200
                          shadow-md
                          `}
                            title={`Câu ${index + 1}: ${
                              status === "correct"
                                ? "Đúng"
                                : status === "wrong"
                                ? "Sai"
                                : "Chưa trả lời"
                            }`}
                          >
                            {index + 1}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Image Preview Modal */}
        <Modal
          title="Xem hình ảnh câu hỏi"
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={null}
          width="auto"
          centered
          className="image-preview-modal"
          styles={{
            body: { padding: 0, textAlign: 'center' }
          }}
        >
          {previewImageUrl && (
            <img
              src={previewImageUrl}
              alt="Question image preview"
              className="max-w-full max-h-[80vh] object-contain"
              style={{ maxWidth: '90vw' }}
            />
          )}
        </Modal>
      </div>
    </>
  );
};

export default SubmitSuccess;


                          {/* {question.questionImg && (
                            <div className="mb-6">
                              <p className="text-[16px] text-[#6392e9] font-bold mb-4">
                                Hình ảnh:
                              </p>
                              <div className="relative bg-white border border-[#d5d5d5] rounded-[8px] p-4">
                                <img
                                  src={question.questionImg}
                                  alt={`Question ${index + 1} image`}
                                  className="w-full h-auto max-h-96 object-contain"
                                />
                                <button className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-1">
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )} */}