import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Modal } from "antd";
import {
  ExclamationCircleOutlined,
  WarningOutlined,
  EyeOutlined,
} from "@ant-design/icons";

interface ContinuousFaceMonitorProps {
  referenceDescriptor: Float32Array;
  onBlock: () => void;
  enabled: boolean;
}

type ViolationType = "NO_FACE" | "DIFFERENT_PERSON" | "MULTIPLE_FACES";

interface ViolationLog {
  type: ViolationType;
  timestamp: string;
  similarity?: number;
}

export function ContinuousFaceMonitor({
  referenceDescriptor,
  onBlock,
  enabled,
}: ContinuousFaceMonitorProps) {
  const [isBlocked, setIsBlocked] = useState(false);
  const [currentViolation, setCurrentViolation] =
    useState<ViolationType | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const monitorIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const violationLogsRef = useRef<ViolationLog[]>([]);
  const consecutiveViolationsRef = useRef(0);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const THRESHOLD = 0.6;
  const CHECK_INTERVAL = 3000; // Kiểm tra mỗi 3 giây
  const MAX_CONSECUTIVE_VIOLATIONS = 3;
  const WARNING_DURATION = 10000; // 10 giây để khắc phục

  // Start webcam
  useEffect(() => {
    if (!enabled) {
      console.log("⏸️ Face monitoring paused");
      return;
    }

    const startWebcam = async () => {
      try {
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
          videoRef.current.onloadedmetadata = async () => {
            await videoRef.current?.play();
            console.log("✅ Monitoring webcam started");
          };
        }
      } catch (error) {
        console.error("❌ Error starting monitoring webcam:", error);
      }
    };

    startWebcam();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        console.log("🛑 Monitoring webcam stopped");
      }
    };
  }, [enabled]);

  // Continuous monitoring
  useEffect(() => {
    if (!enabled || !videoRef.current || isBlocked) return;

    const checkFace = async () => {
      if (!videoRef.current || isBlocked) return;

      try {
        const video = videoRef.current;

        const detections = await faceapi
          .detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceDescriptors();

        // Case 1: No face detected
        if (detections.length === 0) {
          handleViolation("NO_FACE");
          return;
        }

        // Case 2: Multiple faces detected
        if (detections.length > 1) {
          handleViolation("MULTIPLE_FACES");
          return;
        }

        // Case 3: Check if it's the same person
        const detection = detections[0];
        const distance = faceapi.euclideanDistance(
          referenceDescriptor,
          detection.descriptor
        );

        const similarity = Math.max(0, (1 - distance) * 100);
        console.log(`📊 Monitoring: similarity=${similarity.toFixed(1)}%`);

        if (distance > THRESHOLD) {
          handleViolation("DIFFERENT_PERSON", similarity);
          return;
        }

        // All good - reset violations
        if (consecutiveViolationsRef.current > 0) {
          console.log("✅ Face verified - resetting violations");
          consecutiveViolationsRef.current = 0;
          setCurrentViolation(null);
          setShowWarning(false);

          if (warningTimeoutRef.current) {
            clearTimeout(warningTimeoutRef.current);
            warningTimeoutRef.current = null;
          }
        }
      } catch (error) {
        console.error("❌ Error in face monitoring:", error);
      }
    };

    monitorIntervalRef.current = setInterval(checkFace, CHECK_INTERVAL);

    return () => {
      if (monitorIntervalRef.current) {
        clearInterval(monitorIntervalRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [enabled, referenceDescriptor, isBlocked]);

  // Countdown effect when warning is shown
  useEffect(() => {
    if (!showWarning) {
      setCountdown(10);
      return;
    }

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [showWarning]);

  const handleViolation = (type: ViolationType, similarity?: number) => {
    const log: ViolationLog = {
      type,
      timestamp: new Date().toISOString(),
      similarity,
    };

    violationLogsRef.current.push(log);
    consecutiveViolationsRef.current++;
    setCurrentViolation(type);

    console.warn(
      `⚠️ Violation: ${type} (consecutive: ${consecutiveViolationsRef.current}/${MAX_CONSECUTIVE_VIOLATIONS})`
    );

    // Show warning on first violation
    if (consecutiveViolationsRef.current === 1) {
      setShowWarning(true);

      // Auto block after WARNING_DURATION if not resolved
      warningTimeoutRef.current = setTimeout(() => {
        if (consecutiveViolationsRef.current > 0) {
          blockExam();
        }
      }, WARNING_DURATION);
    }

    // Immediate block if max violations reached
    if (consecutiveViolationsRef.current >= MAX_CONSECUTIVE_VIOLATIONS) {
      blockExam();
    }
  };

  const blockExam = () => {
    console.error("🚫 Exam blocked due to violations");
    setIsBlocked(true);
    setShowWarning(false);

    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    if (monitorIntervalRef.current) {
      clearInterval(monitorIntervalRef.current);
    }

    // Block all user interactions
    document.body.style.pointerEvents = "none";
    document.body.style.userSelect = "none";

    onBlock();
  };

  const getViolationMessage = (type: ViolationType): string => {
    switch (type) {
      case "NO_FACE":
        return "Không phát hiện khuôn mặt của bạn trong khung hình!";
      case "DIFFERENT_PERSON":
        return "Phát hiện người khác trong khung hình!";
      case "MULTIPLE_FACES":
        return "Phát hiện nhiều người trong khung hình!";
      default:
        return "Phát hiện hành vi bất thường!";
    }
  };

  const getViolationInstruction = (type: ViolationType): string => {
    switch (type) {
      case "NO_FACE":
        return "Vui lòng đảm bảo khuôn mặt của bạn luôn trong khung hình camera.";
      case "DIFFERENT_PERSON":
        return "Chỉ người đã xác thực ban đầu mới được phép làm bài thi.";
      case "MULTIPLE_FACES":
        return "Chỉ được có một người duy nhất trong khung hình.";
      default:
        return "Vui lòng khắc phục ngay.";
    }
  };

  return (
    <>
      {/* Hidden video for monitoring */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: "none" }}
      />

      {/* Warning Modal */}
      <Modal
        open={showWarning && !isBlocked}
        closable={false}
        footer={null}
        centered
        maskClosable={false}
        width={550}
        className="face-warning-modal"
      >
        <div className="text-center py-6">
          <WarningOutlined className="text-7xl text-orange-500 mb-4 animate-pulse" />
          <h3 className="text-3xl font-bold text-gray-800 mb-3">
            ⚠️ Cảnh báo vi phạm!
          </h3>

          {currentViolation && (
            <>
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700 font-semibold text-xl mb-2">
                  {getViolationMessage(currentViolation)}
                </p>
                <p className="text-gray-600 text-base">
                  {getViolationInstruction(currentViolation)}
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <p className="text-orange-700 font-bold text-2xl mb-2">
                  Vi phạm liên tiếp: {consecutiveViolationsRef.current}/
                  {MAX_CONSECUTIVE_VIOLATIONS}
                </p>
                <p className="text-gray-700">
                  Thời gian khắc phục:{" "}
                  <span className="font-bold text-red-600 text-xl">
                    {countdown}s
                  </span>
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  💡 <strong>Lưu ý:</strong> Bài thi sẽ bị khóa tự động nếu bạn
                  không khắc phục vi phạm hoặc vi phạm đủ{" "}
                  {MAX_CONSECUTIVE_VIOLATIONS} lần liên tiếp.
                </p>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Block Modal */}
      <Modal
        open={isBlocked}
        closable={false}
        footer={null}
        centered
        maskClosable={false}
        width={550}
      >
        <div className="text-center py-8">
          <ExclamationCircleOutlined className="text-8xl text-red-500 mb-6" />
          <h3 className="text-3xl font-bold text-red-600 mb-4">
            🚫 Bài thi đã bị khóa!
          </h3>

          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
            <p className="text-gray-800 text-lg mb-3 font-semibold">
              Hệ thống đã phát hiện nhiều vi phạm trong quá trình làm bài:
            </p>
            <ul className="text-left text-gray-700 space-y-2 mb-4">
              <li>
                • Tổng số vi phạm:{" "}
                <strong>{violationLogsRef.current.length}</strong>
              </li>
              <li>
                • Vi phạm liên tiếp:{" "}
                <strong>{consecutiveViolationsRef.current}</strong>
              </li>
              <li>
                • Trạng thái:{" "}
                <strong className="text-red-600">
                  Đã khóa tất cả thao tác
                </strong>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600 text-base">
              📞 Vui lòng liên hệ <strong>giám thị</strong> hoặc{" "}
              <strong>quản trị viên</strong> để được hỗ trợ và giải trình.
            </p>
          </div>
        </div>
      </Modal>

      {/* Monitoring Indicator */}
      {enabled && !isBlocked && (
        <div className="fixed top-4 right-4 z-[9999]">
          <div
            className={`px-4 py-3 rounded-lg shadow-xl flex items-center gap-3 transition-all ${
              showWarning ? "bg-orange-500 animate-pulse" : "bg-green-500"
            }`}
          >
            <EyeOutlined className="text-white text-xl" />
            <div className="text-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-semibold">
                  {showWarning ? "⚠️ CẢNH BÁO" : "Đang giám sát"}
                </span>
              </div>
              {showWarning && (
                <span className="text-xs">
                  Vi phạm: {consecutiveViolationsRef.current}/
                  {MAX_CONSECUTIVE_VIOLATIONS} | {countdown}s
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
