import {
  CameraOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Button, Spin } from "antd";
import { useState, useEffect, useRef } from "react";

interface FaceVerificationStepProps {
  onStart: () => void;
  onCancel: () => void;
}

export function FaceVerificationStep({
  onStart,
  onCancel,
}: FaceVerificationStepProps) {
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [isWebcamLoading, setIsWebcamLoading] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isWaitingAfterCountdown, setIsWaitingAfterCountdown] =
    useState(false);
  const [isCountdownComplete, setIsCountdownComplete] = useState(false);
  const [showSuccessCircle, setShowSuccessCircle] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const waitingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startWebcam();
    return () => {
      stopWebcam();
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
      if (waitingTimeoutRef.current) {
        clearTimeout(waitingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isWebcamLoading && !webcamError && !countdown && !isCountdownComplete) {
      const timer = setTimeout(() => {
        startCountdown();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isWebcamLoading, webcamError]);

  const startWebcam = async () => {
    try {
      setIsWebcamLoading(true);
      setWebcamError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsWebcamLoading(false);
    } catch (error) {
      console.error("Error accessing webcam:", error);
      setWebcamError(
        "Không thể truy cập webcam. Vui lòng kiểm tra quyền truy cập camera."
      );
      setIsWebcamLoading(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCountdown = () => {
    setCountdown(1);
    let count = 1;

    countdownIntervalRef.current = setInterval(() => {
      count++;
      if (count <= 3) {
        setCountdown(count);
      } else {
        if (countdownIntervalRef.current) {
          clearInterval(countdownIntervalRef.current);
          countdownIntervalRef.current = null;
        }
        setCountdown(null);
        setIsWaitingAfterCountdown(true);

        waitingTimeoutRef.current = setTimeout(() => {
          setIsWaitingAfterCountdown(false);
          setIsCountdownComplete(true);
        }, 3000);
      }
    }, 1000);
  };

  const handleContinue = () => {
    stopWebcam();
    setShowSuccessCircle(true);

    setTimeout(() => {
      onStart();
    }, 1500);
  };

  const handleCancel = () => {
    stopWebcam();
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (waitingTimeoutRef.current) {
      clearTimeout(waitingTimeoutRef.current);
    }
    setCountdown(null);
    setShowSuccessCircle(false);
    setIsCountdownComplete(false);
    setIsWaitingAfterCountdown(false);
    onCancel();
  };

  const handleRetry = () => {
    setCountdown(null);
    setIsCountdownComplete(false);
    setShowSuccessCircle(false);
    setIsWaitingAfterCountdown(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (waitingTimeoutRef.current) {
      clearTimeout(waitingTimeoutRef.current);
    }
    startWebcam();
  };

  return (
    <div className="fixed inset-0 !bg-[rgba(83,83,83,0.62)] flex items-center justify-center z-50">
      <div className="!bg-white rounded-[18px] w-[997px] relative p-12">
        <button
          onClick={handleCancel}
          className="absolute top-8 right-8 p-2 !hover:bg-gray-100 rounded-lg transition-colors"
        >
          <CloseOutlined className="!text-red-500" />
        </button>

        <h2 className="text-center text-[36px] font-bold text-black mt-8">
          {showSuccessCircle
            ? "Xác minh thành công"
            : "Vui lòng kích hoạt webcam"}
        </h2>

        <div className="mx-auto mt-16 w-full h-[580px] !bg-[#33363f] rounded-[11px] flex items-center justify-center relative overflow-hidden">
          {isWebcamLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spin size="large" />
            </div>
          )}

          {webcamError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
              <CameraOutlined className="mb-4 text-red-400 text-6xl" />
              <p className="text-center text-lg">{webcamError}</p>
              <Button
                onClick={handleRetry}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
              >
                Thử lại
              </Button>
            </div>
          )}

          {!isWebcamLoading && !webcamError && !showSuccessCircle && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transition-all duration-300 ${
                countdown !== null || isWaitingAfterCountdown ? "blur-sm" : ""
              }`}
            />
          )}

          {(countdown !== null || isWaitingAfterCountdown) && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-[11px]" />
          )}

          {countdown !== null && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                style={{
                  animation: `scaleIn 0.6s ease-out`,
                }}
              >
                <div className="text-white text-9xl font-bold drop-shadow-lg animate-pulse">
                  {countdown}
                </div>
              </div>
            </div>
          )}

          {isWaitingAfterCountdown && !countdown && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <LoadingOutlined className="text-6xl text-blue-400 animate-spin" />
              <p className="text-white text-xl font-semibold">
                Đang xử lý...
              </p>
            </div>
          )}

          {showSuccessCircle && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <div
                style={{
                  animation: `scaleInLarge 0.8s ease-out`,
                }}
              >
                <CheckCircleOutlined className="text-9xl !text-green-400 drop-shadow-lg" />
              </div>
            </div>
          )}

          {!webcamError && !showSuccessCircle && !countdown && !isWaitingAfterCountdown && (
            <div className="absolute bottom-8 right-0 -translate-x-1/2 !bg-[rgba(240,240,240,0.22)] rounded-[12px] p-3 flex flex-col items-center justify-center backdrop-blur-sm">
              <CameraOutlined className="text-xl !text-[rgb(255,255,255)]" />
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-12">
          <Button
            onClick={handleCancel}
            disabled={showSuccessCircle}
            className="!bg-[#ff2e00] !hover:bg-[#e02900] text-white rounded-[12px] h-[50px] !px-12 text-[20px]"
          >
            Dừng
          </Button>

          {isCountdownComplete && !showSuccessCircle && (
            <Button
              onClick={handleContinue}
              className="!bg-[#6392e9] !hover:bg-[#5282d8] text-white rounded-[12px] h-[50px] !px-12 text-[20px]"
            >
              Tiếp tục
            </Button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          0% {
            transform: scale(0) rotateZ(-5deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotateZ(0deg);
          }
          100% {
            transform: scale(1) rotateZ(0deg);
            opacity: 1;
          }
        }

        @keyframes scaleInLarge {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}