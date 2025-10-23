import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Button, Spin, Alert, Modal } from "antd";
import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import ExamHeader from "./components/ui/ExamHeader";
import QuestionCard from "./components/ui/QuestionCard";
import QuestionNavigation from "./components/ui/QuestionNavigation";
import ExamTimer from "./components/ui/ExamTimer";
import ExamSubmission from "./components/ui/ExamSubmisionModal";
import { FaceVerificationStep } from "./components/layout/FaceVerify";
import { VerifySuccess } from "./components/layout/VerifySuccess";
import { VerifyFailed } from "./components/layout/VerifyFailed";
import SubmitSuccess from "./components/layout/SubmitSuccess";

import { useExam } from "./hooks/useExam";
import { ExamResults as ExamResultsType } from "./types";
import { EXAM_MESSAGES } from "./constants";
import { examService } from "./services/examService";

const TakeQuizExam: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const initialExamData = location.state?.examData;

  if (!examId) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert
            message="Không tìm thấy bài thi"
            description="Vui lòng truy cập từ danh sách bài thi hoặc kiểm tra lại đường dẫn."
            type="error"
            showIcon
            action={
              <Button size="small" onClick={() => navigate("/dashboard")}>
                Về trang chủ
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  const {
    examState,
    startExam,
    selectAnswer,
    markQuestion,
    goToQuestion,
    submitExam,
    resetExam,
    isLoading,
    error,
  } = useExam(examId, initialExamData);

  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const [faceVerificationStatus, setFaceVerificationStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");
  const [examResults, setExamResults] = useState<ExamResultsType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitSuccess, setShowSubmitSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [isProcessingSubmission, setIsProcessingSubmission] = useState(false);

  const [isStartingFaceVerification, setIsStartingFaceVerification] =
    useState(false);
  const [isTransitioningToExam, setIsTransitioningToExam] = useState(false);
  const [isTransitioningToResults, setIsTransitioningToResults] =
    useState(false);

  const handleFaceVerificationStart = () => {
    setIsStartingFaceVerification(true);
    setTimeout(() => {
      setShowFaceVerification(true);
      setIsStartingFaceVerification(false);
    }, 1000);
  };

  const handleFaceVerificationSuccess = () => {
    setFaceVerificationStatus("success");
    setIsTransitioningToExam(true);
    setTimeout(() => {
      setShowFaceVerification(false);
      setIsTransitioningToExam(false);
      startExam();
    }, 2000);
  };

  const handleFaceVerificationFailed = () => {
    setFaceVerificationStatus("failed");
    setTimeout(() => {
      setShowFaceVerification(false);
      window.history.back();
    }, 3000);
  };

  const handleFaceVerificationCancel = () => {
    setShowFaceVerification(false);
    window.history.back();
  };

  const handleShowSubmissionModal = () => {
    setShowSubmissionModal(true);
  };

  const handleConfirmSubmission = async () => {
    setShowSubmissionModal(false);
    setIsSubmitting(true);
    setIsProcessingSubmission(true);
    try {
      const results = await submitExam();
      const subId = results.submissionId || null;
      setSubmissionId(subId);

      let submissionDetails = null;
      if (subId) {
        try {
          console.log("Fetching submission details for ID:", subId);
          submissionDetails = await examService.getSubmissionDetails(subId);
          console.log("Submission details received:", submissionDetails);
        } catch (detailErr) {
          console.warn("Failed to fetch submission details:", detailErr);
        }
      }

      const resultsWithDetails = { ...results, submissionDetails };
      console.log("Final results with submission details:", resultsWithDetails);
      setExamResults(resultsWithDetails);

      setTimeout(() => {
        setShowSubmitSuccess(true);
        setIsProcessingSubmission(false);
      }, 1000);
    } catch (err) {
      Modal.error({
        title: "Lỗi nộp bài",
        content:
          err instanceof Error ? err.message : EXAM_MESSAGES.SUBMIT_ERROR,
      });
      setIsProcessingSubmission(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmission = () => {
    setShowSubmissionModal(false);
  };

  const handleTimeUp = () => {
    Modal.warning({
      title: "Hết thời gian",
      content: EXAM_MESSAGES.TIME_UP,
      onOk: () => {
        handleConfirmSubmission();
      },
    });
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle retake exam
  const handleRetakeExam = () => {
    resetExam();
    setExamResults(null);
    setFaceVerificationStatus("pending");
    setShowSubmitSuccess(false);
    setShowFaceVerification(true);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleViewResults = async () => {
    // console.log('handleViewResults called');
    console.log("Current examResults:", examResults);
    console.log("Current submissionId:", submissionId);
    setIsTransitioningToResults(true);

    if (examResults?.submissionDetails) {
      console.log(
        "Using existing submission details:",
        examResults.submissionDetails
      );
      setTimeout(() => {
        setShowSubmitSuccess(false);
        setIsTransitioningToResults(false);
      }, 500);
      return;
    }

    if (!submissionId) {
      console.log("No submissionId found");
      Modal.error({
        title: "Lỗi",
        content: "Không tìm thấy ID bài nộp. Vui lòng thử lại.",
      });
      setIsTransitioningToResults(false);
      return;
    }

    try {
      console.log("Fetching submission details for ID:", submissionId);
      const submissionDetails = await examService.getSubmissionDetails(
        submissionId
      );
      console.log("Fetched submission details:", submissionDetails);
      setExamResults((prev) => (prev ? { ...prev, submissionDetails } : null));
      console.log("Updated examResults with submission details");
    } catch (err) {
      console.error("Error fetching submission details:", err);
      Modal.error({
        title: "Lỗi tải chi tiết",
        content:
          err instanceof Error
            ? err.message
            : "Không thể tải chi tiết bài nộp.",
      });
      setIsTransitioningToResults(false);
      return;
    }

    setTimeout(() => {
      setShowSubmitSuccess(false);
      setIsTransitioningToResults(false);
    }, 500);
  };

  const handleBackToDashboardFromSuccess = () => {
    navigate("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-[18px] text-gray-600">Đang tải bài thi...</p>
        </div>
      </div>
    );
  }

  if (isStartingFaceVerification) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-[18px] text-gray-600">
            Đang khởi tạo xác thực khuôn mặt...
          </p>
        </div>
      </div>
    );
  }

  if (isTransitioningToExam) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-[18px] text-gray-600">
            Đang chuẩn bị bài thi...
          </p>
        </div>
      </div>
    );
  }

  if (isTransitioningToResults) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-[18px] text-gray-600">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  if (isProcessingSubmission) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-[18px] text-gray-600">
            Đang xử lý bài nộp...
          </p>
          <p className="mt-2 text-[14px] text-gray-500">
            Vui lòng chờ trong giây lát
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert
            message="Lỗi tải bài thi"
            description={error}
            type="error"
            showIcon
            action={
              <Button size="small" onClick={() => window.location.reload()}>
                Thử lại
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (showSubmitSuccess && examResults) {
    return (
      <SubmitSuccess
        examName={examState.examData?.examName}
        submittedAt={new Date().toLocaleString("vi-VN")}
        onViewResults={handleViewResults}
        onBackToDashboard={handleBackToDashboardFromSuccess}
        submissionDetails={examResults.submissionDetails}
        totalQuestions={
          examState.questions?.length || examResults.totalQuestions
        }
      />
    );
  }

  if (showFaceVerification) {
    if (faceVerificationStatus === "success") {
      return <VerifySuccess />;
    }
    if (faceVerificationStatus === "failed") {
      return <VerifyFailed />;
    }
    return (
      <FaceVerificationStep
        onStart={handleFaceVerificationSuccess}
        onCancel={handleFaceVerificationCancel}
      />
    );
  }

  if (!examState.isExamStarted && examState.examData) {
    return (
      <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-4">
        <div className="bg-white rounded-[12px] border border-[#d5d5d5] p-8 max-w-2xl w-full">
          <div className="text-center">
            <h1 className="text-[32px] font-bold text-black mb-4">
              {examState.examData.examName}
            </h1>

            <div className="bg-[#f8f9ff] rounded-[12px] p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Môn học:</span>
                  <span className="font-semibold">
                    {examState.examData.subjectName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số câu hỏi:</span>
                  <span className="font-semibold">
                    {examState.examData.numOfQuestions}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="font-semibold">90 phút</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loại thi:</span>
                  <span className="font-semibold">Thi chính thức</span>
                </div>
              </div>
            </div>

            <div className="bg-[#fffbe6] border border-[#faad14] rounded-[8px] p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <ExclamationCircleOutlined className="text-[#faad14]" />
                <span className="text-[16px] font-semibold text-[#faad14]">
                  Lưu ý quan trọng:
                </span>
              </div>
              <ul className="text-[14px] text-gray-600 space-y-1 text-left">
                <li>• Bạn sẽ cần xác thực khuôn mặt trước khi bắt đầu thi</li>
                <li>• Thời gian làm bài là 90 phút</li>
                <li>• Không được phép tra cứu tài liệu trong quá trình thi</li>
                <li>• Hệ thống sẽ tự động nộp bài khi hết thời gian</li>
              </ul>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => window.history.back()}
                icon={<ArrowLeftOutlined />}
                className="!bg-gray-500 !hover:bg-gray-600 !text-white rounded-[8px] h-[50px] px-8 text-[18px]"
              >
                Quay lại
              </Button>
              <Button
                onClick={handleFaceVerificationStart}
                loading={isStartingFaceVerification}
                className="!bg-[#6392e9] !hover:bg-[#5282d8] !text-white rounded-[8px] h-[50px] px-8 text-[18px] font-semibold"
              >
                {isStartingFaceVerification
                  ? "Đang khởi tạo..."
                  : "Bắt đầu thi"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    examState.isExamStarted &&
    examState.examData &&
    examState.questions.length > 0
  ) {
    const currentQuestion = examState.questions[examState.currentQuestionIndex];
    const answeredCount = examState.questions.filter(
      (q) => q.isAnswered
    ).length;

    // console.log('Current question state:', {
    //   questionId: currentQuestion.id,
    //   isMarked: currentQuestion.isMarked,
    //   markedQuestions: Array.from(examState.markedQuestions),
    //   allQuestions: examState.questions.map(q => ({ id: q.id, isMarked: q.isMarked }))
    // });

    return (
      <div className="min-h-screen bg-[#f4f4f4]">
        <div className="p-8">
          <ExamHeader
            examName={examState.examData.examName}
            subjectName={examState.examData.subjectName}
            timeLeft={formatTime(examState.timeLeft)}
            totalQuestions={examState.questions.length}
            answeredQuestions={answeredCount}
          />
          <div className="flex gap-6">
            <div className="flex-1">
              <QuestionCard
                question={currentQuestion}
                questionNumber={examState.currentQuestionIndex + 1}
                onAnswerSelect={(answerIndex, isMultiple) =>
                  selectAnswer(currentQuestion.id, answerIndex, isMultiple)
                }
                onMarkQuestion={() => markQuestion(currentQuestion.id)}
                isMarked={currentQuestion.isMarked ?? false}
              />
              <div className="flex justify-between mt-6">
                <Button
                  onClick={() =>
                    goToQuestion(
                      Math.max(0, examState.currentQuestionIndex - 1)
                    )
                  }
                  disabled={examState.currentQuestionIndex === 0}
                  className="!bg-[#6392e9] !hover:bg-[#5282d8] !text-white rounded-[8px] !px-8 h-[43px]"
                >
                  Trước
                </Button>
                <Button
                  onClick={() =>
                    goToQuestion(
                      Math.min(
                        examState.questions.length - 1,
                        examState.currentQuestionIndex + 1
                      )
                    )
                  }
                  disabled={
                    examState.currentQuestionIndex ===
                    examState.questions.length - 1
                  }
                  className="!bg-[#6392e9] !hover:bg-[#5282d8] !text-white rounded-[8px] !px-8 h-[43px]"
                >
                  Sau
                </Button>
              </div>
            </div>

            <div>
              <div className="mb-6 flex flex-col item-center">
                <ExamTimer
                  timeLeft={examState.timeLeft}
                  onTimeUp={handleTimeUp}
                  subjectName={examState.examData.subjectName}
                />
              </div>

              <QuestionNavigation
                questions={examState.questions}
                currentQuestionIndex={examState.currentQuestionIndex}
                onQuestionSelect={goToQuestion}
                onSubmitExam={handleShowSubmissionModal}
              />
            </div>
          </div>

          <ExamSubmission
            onSubmit={handleConfirmSubmission}
            onCancel={handleCancelSubmission}
            isSubmitting={isSubmitting}
            isVisible={showSubmissionModal}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default TakeQuizExam;
