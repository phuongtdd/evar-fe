import React, { useState, useEffect, useCallback, useRef } from "react";
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
import AntiCheatWarningModal from "./components/ui/AntiCheatWarningModal";
import { FaceVerificationStep } from "./components/layout/FaceVerify";
import { VerifySuccess } from "./components/layout/VerifySuccess";
import { VerifyFailed } from "./components/layout/VerifyFailed";
import SubmitSuccess from "./components/layout/SubmitSuccess";
import { ContinuousFaceMonitor } from "./components/layout/ContinuousFaceMonitor";

import { useExam } from "./hooks/useExam";
import { ExamResults as ExamResultsType } from "./types";
import { EXAM_MESSAGES, EXAM_CONFIG } from "./constants";
import { examService } from "./services/examService";

const TakeQuizExam: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const initialExamData = location.state?.examData;

  const [showAutoSubmitModal, setShowAutoSubmitModal] = useState(false);
  const [autoSubmitCountdown, setAutoSubmitCountdown] = useState(3);

  const [referenceDescriptor, setReferenceDescriptor] =
    useState<Float32Array | null>(null);
  const [isExamBlocked, setIsExamBlocked] = useState(false);

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
    incrementCopyPasteAttempts,
    incrementTabSwitches,
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

  const [showAntiCheatModal, setShowAntiCheatModal] = useState(false);
  const [antiCheatType, setAntiCheatType] = useState<
    "copy-paste" | "tab-switch"
  >("copy-paste");
  const hasAutoSubmittedRef = React.useRef(false);

  const handleFaceVerificationStart = () => {
    setIsStartingFaceVerification(true);
    setTimeout(() => {
      setShowFaceVerification(true);
      setIsStartingFaceVerification(false);
    }, 1000);
  };

  const handleFaceVerificationSuccess = (
    faceImageUrl: string,
    faceSimilarity: number,
    descriptor?: Float32Array
  ) => {
    setFaceVerificationStatus("success");
    setIsTransitioningToExam(true);
    if (descriptor) {
      setReferenceDescriptor(descriptor);
    }
    setTimeout(() => {
      setShowFaceVerification(false);
      setIsTransitioningToExam(false);
      hasAutoSubmittedRef.current = false; // Reset khi bắt đầu thi mới
      startExam(faceImageUrl, faceSimilarity);
    }, 2000);
  };

  const handleFaceMonitorBlock = () => {
    setIsExamBlocked(true);
    Modal.error({
      title: "🚫 Bài thi đã bị khóa",
      content:
        "Hệ thống phát hiện nhiều vi phạm về giám sát khuôn mặt. Bài thi sẽ được tự động nộp.",
      okText: "Đã hiểu",
      onOk: () => {
        handleConfirmSubmission();
      },
    });
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

  const handleConfirmSubmission = useCallback(async () => {
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
  }, [submitExam]);

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

  // Handle copy-paste detection
  useEffect(() => {
    // Không detect nếu đang hiển thị modal auto-submit
    if (
      !examState.isExamStarted ||
      examState.isExamCompleted ||
      showAutoSubmitModal
    )
      return;

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      incrementCopyPasteAttempts();
      setAntiCheatType("copy-paste");
      setShowAntiCheatModal(true);
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      incrementCopyPasteAttempts();
      setAntiCheatType("copy-paste");
      setShowAntiCheatModal(true);
    };

    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };
  }, [
    examState.isExamStarted,
    examState.isExamCompleted,
    showAutoSubmitModal,
    incrementCopyPasteAttempts,
  ]);

  // Handle tab switch detection
  useEffect(() => {
    // Không detect nếu đang hiển thị modal auto-submit
    if (
      !examState.isExamStarted ||
      examState.isExamCompleted ||
      showAutoSubmitModal
    )
      return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User switched away from the tab
        return;
      } else {
        // User came back to the tab
        incrementTabSwitches();
        setAntiCheatType("tab-switch");
        setShowAntiCheatModal(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    examState.isExamStarted,
    examState.isExamCompleted,
    showAutoSubmitModal,
    incrementTabSwitches,
  ]);

  // Auto-submit when tab switches reach 3
  useEffect(() => {
    // Chỉ check khi numTabSwitches thay đổi và đạt đúng 3
    if (
      examState.numTabSwitches === 3 &&
      examState.isExamStarted &&
      !examState.isExamCompleted &&
      !hasAutoSubmittedRef.current
    ) {
      hasAutoSubmittedRef.current = true;
      console.log("🚨 TRIGGERING AUTO-SUBMIT - Tab switches reached 3");

      // Đóng modal cảnh báo nếu đang mở
      setShowAntiCheatModal(false);

      // ✅ Hiển thị modal tự động nộp bài
      setTimeout(() => {
        setShowAutoSubmitModal(true);
        setAutoSubmitCountdown(3);
      }, 400);
    }
  }, [
    examState.numTabSwitches,
    examState.isExamStarted,
    examState.isExamCompleted,
  ]);

  const handleConfirmSubmissionRef = useRef(handleConfirmSubmission);

  // Update ref khi function thay đổi
  useEffect(() => {
    handleConfirmSubmissionRef.current = handleConfirmSubmission;
  }, [handleConfirmSubmission]);

  // ✅ Countdown logic - không phụ thuộc vào function
  useEffect(() => {
    if (showAutoSubmitModal && autoSubmitCountdown > 0) {
      const timer = setTimeout(() => {
        setAutoSubmitCountdown(autoSubmitCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (showAutoSubmitModal && autoSubmitCountdown === 0) {
      console.log("⚡ Auto-submitting exam...");
      setShowAutoSubmitModal(false);
      handleConfirmSubmissionRef.current(); // ✅ Dùng ref thay vì dependency
    }
  }, [showAutoSubmitModal, autoSubmitCountdown]);

  const handleCloseAntiCheatModal = () => {
    setShowAntiCheatModal(false);
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
        examResults={examResults}
        examData={examState.examData}
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
                  <span className="font-semibold">
                    {examState.examData.duration
                      ? `${examState.examData.duration} phút`
                      : "90 phút"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loại thi:</span>
                  <span className="font-semibold">
                    {EXAM_CONFIG.EXAM_TYPES[examState.examData.examType] ||
                      "Thi chính thức"}
                  </span>
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
                <li>
                  • Thời gian làm bài là{" "}
                  {examState.examData.duration
                    ? `${examState.examData.duration} phút`
                    : "90 phút"}
                </li>
                <li>• Không được phép tra cứu tài liệu trong quá trình thi</li>
                <li>• Hệ thống sẽ tự động nộp bài khi hết thời gian</li>
                <li className="text-red-600 font-semibold">
                  • Không được copy-paste nội dung hoặc chuyển sang tab/cửa sổ
                  khác
                </li>
                <li className="text-red-600 font-semibold">
                  • Bài thi sẽ tự động nộp sau 3 lần chuyển tab
                </li>
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
        {referenceDescriptor && !isExamBlocked && (
          <ContinuousFaceMonitor
            referenceDescriptor={referenceDescriptor}
            onBlock={handleFaceMonitorBlock}
            enabled={
              !showSubmissionModal && !isSubmitting && !showAutoSubmitModal
            }
          />
        )}
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

          <Modal
            open={showAutoSubmitModal}
            title={
              <div className="flex items-center gap-2">
                <ExclamationCircleOutlined className="text-orange-500 text-[24px]" />
                <span className="text-[18px] font-bold">
                  ⚠️ Tự động nộp bài
                </span>
              </div>
            }
            centered
            closable={false}
            maskClosable={false}
            keyboard={false}
            footer={[
              <Button
                key="submit"
                type="primary"
                onClick={() => {
                  setShowAutoSubmitModal(false);
                  handleConfirmSubmission();
                }}
                className="!bg-[#6392e9] !hover:bg-[#5282d8]"
              >
                Nộp ngay
              </Button>,
            ]}
          >
            <div className="space-y-4">
              <p className="text-[16px] text-gray-700">
                Bạn đã vi phạm quy định chuyển tab{" "}
                <span className="font-bold text-red-600">3 lần</span>.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-[14px] text-red-700 font-semibold text-center">
                  🚨 Bài thi sẽ tự động nộp sau{" "}
                  <span className="text-[24px] font-bold">
                    {autoSubmitCountdown}
                  </span>{" "}
                  giây
                </p>
              </div>
            </div>
          </Modal>

          <AntiCheatWarningModal
            visible={showAntiCheatModal}
            type={antiCheatType}
            count={
              antiCheatType === "copy-paste"
                ? examState.copyPasteAttempts
                : examState.numTabSwitches
            }
            onClose={handleCloseAntiCheatModal}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default TakeQuizExam;
