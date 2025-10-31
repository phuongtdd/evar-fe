import React, { useState, useEffect } from "react";
import { Button, Card, Spin, Collapse, Tag, Badge, Tooltip, Modal } from "antd";
import {
  CheckCircleOutlined,
  HomeOutlined,
  EyeOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import BackButton from "../../../Common/BackButton";
import MathContent from "../../../createExam-AI/components/ui/MathContent";
import "../../styles/table-fixes.css";

interface SubmitSuccessProps {
  examName?: string;
  submittedAt?: string;
  onViewResults?: () => void;
  onBackToDashboard?: () => void;
  submissionDetails?: any;
  totalQuestions?: number;
  examResults?: any;
  examData?: any;
}

const SubmitSuccess: React.FC<SubmitSuccessProps> = ({
  examName = "Bài thi",
  submittedAt = new Date().toLocaleString("vi-VN"),
  onViewResults,
  onBackToDashboard,
  submissionDetails,
  totalQuestions = 10,
  examResults,
  examData,
}) => {
  const [isViewingResults, setIsViewingResults] = useState(false);
  const [isGoingHome, setIsGoingHome] = useState(false);
  const [showQuestionDetails, setShowQuestionDetails] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);
  const [imageLoadingStates, setImageLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [imageErrorStates, setImageErrorStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>("");

  const handleImageLoad = (questionIndex: number) => {
    setImageLoadingStates((prev) => ({ ...prev, [questionIndex]: false }));
    setImageErrorStates((prev) => ({ ...prev, [questionIndex]: false }));
  };

  const handleImageError = (questionIndex: number) => {
    setImageLoadingStates((prev) => ({ ...prev, [questionIndex]: false }));
    setImageErrorStates((prev) => ({ ...prev, [questionIndex]: true }));
  };

  const handleImageClick = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl);
    setPreviewVisible(true);
  };

  const calculateCorrectAnswers = () => {
    if (!submissionDetails?.questions) return 0;

    let correctCount = 0;
    submissionDetails.questions.forEach((question: any) => {
      const correctAnswers = question.answers.filter(
        (answer: any) => answer.correct
      );
      const userSelectedAnswers = question.answers.filter(
        (answer: any) => answer.select
      );

      // If no correct answer info from backend, treat as wrong
      const hasCorrectAnswerInfo = correctAnswers.length > 0;
      if (!hasCorrectAnswerInfo) {
        return; // Skip this question, count as wrong
      }

      const allCorrectSelected = correctAnswers.every(
        (answer: any) => answer.select
      );
      const noWrongSelected = question.answers.every((answer: any) =>
        !answer.correct ? !answer.select : true
      );

      if (allCorrectSelected && noWrongSelected) {
        correctCount++;
      }
    });

    return correctCount;
  };

  const calculateUserScore = () => {
    if (submissionDetails?.totalScore !== undefined) {
      console.log('Using submissionDetails.totalScore:', submissionDetails.totalScore);
      return submissionDetails.totalScore;
    }
    
    if (examResults?.totalScore !== undefined) {
      console.log('Using examResults.totalScore:', examResults.totalScore);
      return examResults.totalScore;
    }
    
    if (!submissionDetails?.questions) return 0;

    let userScore = 0;
    submissionDetails.questions.forEach((question: any) => {
      const correctAnswers = question.answers.filter(
        (answer: any) => answer.correct
      );
      const userSelectedAnswers = question.answers.filter(
        (answer: any) => answer.select
      );

      // If no correct answer info from backend, treat as wrong (no points)
      const hasCorrectAnswerInfo = correctAnswers.length > 0;
      if (!hasCorrectAnswerInfo) {
        return; // Skip this question, no points awarded
      }

      const allCorrectSelected = correctAnswers.every(
        (answer: any) => answer.select
      );
      const noWrongSelected = question.answers.every((answer: any) =>
        !answer.correct ? !answer.select : true
      );

      if (allCorrectSelected && noWrongSelected) {
        // Add the question's point value (default to 1 if not specified)
        userScore += question.pointValue || 1;
      }
    });

    console.log('Calculated userScore from questions:', userScore);
    return userScore;
  };

  const calculateTotalPossiblePoints = () => {
    // Sử dụng examData để tính tổng điểm có thể đạt được
    if (examData?.questions) {
      let totalPoints = 0;
      examData.questions.forEach((question: any) => {
        totalPoints += question.quesScore || 1;
      });
      return totalPoints;
    }
    
    // Fallback về logic cũ nếu không có examData
    if (!submissionDetails?.questions) return totalQuestions;

    let totalPoints = 0;
    submissionDetails.questions.forEach((question: any) => {
      totalPoints += question.pointValue || 1;
    });

    return totalPoints;
  };

  const getTimeSpent = () => {
    if (examResults?.timeSpent) {
      return examResults.timeSpent;
    }
    return 0;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeLimit = () => {
    if (examData?.timeLimit) {
      return examData.timeLimit;
    }
    return 90 * 60;
  };

  useEffect(() => {
    if (submissionDetails?.questions) {
      const initialLoadingStates: { [key: string]: boolean } = {};
      const initialErrorStates: { [key: string]: boolean } = {};

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

    const correctAnswers = question.answers.filter(
      (answer: any) => answer.correct
    );
    const userSelectedAnswers = question.answers.filter(
      (answer: any) => answer.select
    );

    // If no correct answer info from backend, treat as wrong
    const hasCorrectAnswerInfo = correctAnswers.length > 0;
    if (!hasCorrectAnswerInfo) {
      return userSelectedAnswers.length > 0 ? "wrong" : "not-answered";
    }

    const allCorrectSelected = correctAnswers.every(
      (answer: any) => answer.select
    );
    const noWrongSelected = question.answers.every((answer: any) =>
      !answer.correct ? !answer.select : true
    );

    if (allCorrectSelected && noWrongSelected) {
      return "correct";
    }

    if (userSelectedAnswers.length > 0) {
      return "wrong";
    }

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
      <div className="p-5 flex flex-col items-center justify-center relative">
        <div className="absolute top-12 left-0">
          <BackButton url="/dashboard" />
        </div>
        <Card className="w-[70%] flex flex-col items-center justify-center">
          <div className="text-center flex flex-col items-center justify-center gap-3">
            <div className="mb-8">
              <p className="text-[24px] text-green-500 mb-4">
                Bạn đã nộp bài thi thành công.
              </p>
              <div className="flex flex-row items-center">
                <span className="text-[24px]">Kết quả :</span>
                <span className="text-[54px] mx-auto">
                  <span>{calculateUserScore()}</span>
                  <span>/{calculateTotalPossiblePoints()}</span>
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
                    {calculateCorrectAnswers()}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-700 font-normal">
                    Số câu sai :
                  </span>
                  <span className="text-lg font-semibold text-red-600">
                    {totalQuestions - calculateCorrectAnswers()}
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
                    {formatTime(getTimeSpent())} / {formatTime(getTimeLimit())}
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
                      const userSelectedAnswers = question.answers.filter(
                        (answer: any) => answer.select
                      );
                      const correctAnswers = question.answers.filter(
                        (answer: any) => answer.correct
                      );

                      // If backend doesn't return any correct answer (all correct: false), treat as wrong
                      const hasCorrectAnswerInfo = correctAnswers.length > 0;
                      
                      const allCorrectAnswersSelected = hasCorrectAnswerInfo 
                        ? correctAnswers.every((answer: any) => answer.select)
                        : false;
                      const noWrongAnswersSelected = hasCorrectAnswerInfo
                        ? question.answers.every((answer: any) =>
                            !answer.correct ? !answer.select : true
                          )
                        : false;
                      const isCorrect =
                        hasCorrectAnswerInfo && allCorrectAnswersSelected && noWrongAnswersSelected;

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
                              <CheckCircleOutlined className="!text-green-500 text-2xl" />
                            ) : (
                              <CloseCircleOutlined className="!text-red-500 text-2xl" />
                            )}
                          </div>

                          <span>
                            Kết luận:
                            {isCorrect ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-medium">
                                Đúng
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-800 rounded font-medium">
                                Sai
                              </span>
                            )}
                          </span>

                          <div className="w-full flex flex-col items-center justify-center relative">
                            {question.questionImg && (
                              <>
                                <strong className="absolute top-0 left-0">
                                  Hình ảnh:{" "}
                                </strong>
                                <div className="mt-4 max-width-[200px] relative">
                                  {imageLoadingStates[index] && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-[8px] border border-[#d5d5d5] min-h-[200px]">
                                      <div className="text-center">
                                        <Spin size="large" />
                                        <p className="mt-2 text-gray-500 text-sm">
                                          Đang tải hình ảnh...
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  {imageErrorStates[index] && (
                                    <div className="flex items-center justify-center bg-gray-100 rounded-[8px] border border-[#d5d5d5] min-h-[200px] p-4">
                                      <div className="text-center text-gray-500">
                                        <p className="text-sm">
                                          Không thể tải hình ảnh
                                        </p>
                                        <p className="text-xs mt-1">
                                          Vui lòng kiểm tra kết nối mạng
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                  <Tooltip
                                    title="Nhấn để xem hình ảnh lớn hơn"
                                    placement="top"
                                  >
                                    <img
                                      src={question.questionImg}
                                      alt="Question image"
                                      className={`w-[220px] h-auto rounded-[8px] border !border-[#d5d5d5] transition-opacity duration-300 ${
                                        imageLoadingStates[index] ||
                                        imageErrorStates[index]
                                          ? "opacity-0 absolute"
                                          : "opacity-100 image-loaded"
                                      } ${
                                        !imageErrorStates[index]
                                          ? "cursor-pointer hover:opacity-80"
                                          : ""
                                      }`}
                                      onLoad={() => handleImageLoad(index)}
                                      onError={() => handleImageError(index)}
                                      onClick={() =>
                                        handleImageClick(question.questionImg)
                                      }
                                      style={{
                                        display:
                                          imageLoadingStates[index] ||
                                          imageErrorStates[index]
                                            ? "none"
                                            : "block",
                                      }}
                                    />
                                  </Tooltip>
                                  {!imageErrorStates[index] &&
                                    !imageLoadingStates[index] && (
                                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded opacity-0 hover:opacity-100 transition-opacity">
                                        <EyeOutlined className="text-sm" />
                                      </div>
                                    )}
                                </div>
                              </>
                            )}
                          </div>
                          <div className="text-[18px] text-black mb-6 leading-relaxed table-responsive">
                            <MathContent content={question.questionContent || ""} />
                          </div>

                          {userSelectedAnswers.length > 0 && (
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-[8px]">
                              <p className="text-[16px] font-semibold text-blue-800">
                                Lựa chọn của bạn:{" "}
                                {userSelectedAnswers
                                  .map((selectedAnswer: any, idx: number) =>
                                    String.fromCharCode(
                                      65 +
                                        question.answers.indexOf(selectedAnswer)
                                    )
                                  )
                                  .join(", ")}
                              </p>
                            </div>
                          )}

                          {userSelectedAnswers.length === 0 && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[8px]">
                              <p className="text-[16px] font-semibold text-red-800">
                                ⚠️ Bạn chưa trả lời câu hỏi này - Tính là sai
                              </p>
                            </div>
                          )}

                          {!hasCorrectAnswerInfo && userSelectedAnswers.length > 0 && (
                            <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-[8px]">
                              <p className="text-[16px] font-semibold text-orange-800">
                                ⚠️ Không có thông tin đáp án đúng - Tính là sai
                              </p>
                            </div>
                          )}

                          {!isCorrect && correctAnswers.length > 0 && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-[8px]">
                              <p className="text-[16px] font-semibold text-green-800">
                                Đáp án đúng:{" "}
                                {correctAnswers
                                  .map((correctAnswer: any, idx: number) =>
                                    String.fromCharCode(
                                      65 +
                                        question.answers.indexOf(correctAnswer)
                                    )
                                  )
                                  .join(", ")}
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
                  Số câu hỏi :<span>{submissionDetails.questions.length}</span>
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

        <Modal
          title="Xem hình ảnh câu hỏi"
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={null}
          width="auto"
          centered
          className="image-preview-modal"
          styles={{
            body: { padding: 0, textAlign: "center" },
          }}
        >
          {previewImageUrl && (
            <img
              src={previewImageUrl}
              alt="Question image preview"
              className="max-w-full max-h-[80vh] object-contain"
              style={{ maxWidth: "90vw" }}
            />
          )}
        </Modal>
      </div>
    </>
  );
};

export default SubmitSuccess;

