import {
  CameraOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Button, Spin, message, Progress, Modal } from "antd";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImageToImgBB } from "../../../../utils/ImageUpload";
import * as faceapi from "face-api.js";
import { getUserById } from "../../../userProfile/services/index";
import { getUserIdFromToken } from "../../../Room/utils/auth";
import { ContinuousFaceMonitor } from './ContinuousFaceMonitor';

interface FaceVerificationStepProps {
  onStart: (faceImageUrl: string, faceSimilarity: number, descriptor?: Float32Array) => void;
  onCancel: () => void;
}

export interface FaceVerificationResult {
  isVerified: boolean;
  distance: number;
  similarity: number; // Phần trăm giống nhau
  capturedImageUrl: string;
  referenceImageUrl: string;
  timestamp: string;
}

export function FaceVerificationStep({
  onStart,
  onCancel,
}: FaceVerificationStepProps) {
  const navigate = useNavigate();
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [isWebcamLoading, setIsWebcamLoading] = useState(true);
  const [showSuccessCircle, setShowSuccessCircle] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [verificationResult, setVerificationResult] =
    useState<FaceVerificationResult | null>(null);
  const [showNoFaceModal, setShowNoFaceModal] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [isExamBlocked, setIsExamBlocked] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const referenceDescriptorRef = useRef<Float32Array | null>(null);
  const referenceImageUrlRef = useRef<string | null>(null);

  // ✅ Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setVerificationProgress(10);
        console.log("🔄 Loading face-api.js models...");

        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);

        setVerificationProgress(40);
        console.log("✅ Models loaded successfully");
        setIsLoadingModels(false);
      } catch (error) {
        console.error("❌ Error loading models:", error);
        message.error("Không thể tải models. Vui lòng thử lại.");
        setWebcamError("Không thể tải models xác thực khuôn mặt.");
      }
    };

    loadModels();
  }, []);
  const exitVerify = () => {};

  useEffect(() => {
    const loadReferenceFace = async () => {
      if (isLoadingModels) return;

      try {
        setVerificationProgress(50);
        const userId = getUserIdFromToken();
        if (!userId) {
          throw new Error("Không tìm thấy thông tin người dùng");
        }

        console.log("🔄 Fetching user data for userId:", userId);
        const userData = await getUserById(userId);
        const faceUrl = userData.face;

        if (!faceUrl) {
          console.log("❌ User has no face image in system");
          setShowNoFaceModal(true);
          setIsLoadingModels(false);
          return;
        }

        referenceImageUrlRef.current = faceUrl;
        console.log("🔄 Loading reference face from:", faceUrl);

        setVerificationProgress(70);

        // Load và phát hiện khuôn mặt từ ảnh tham chiếu
        const img = await faceapi.fetchImage(faceUrl);
        const detection = await faceapi
          .detectSingleFace(img, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection) {
          throw new Error(
            "Không phát hiện được khuôn mặt trong ảnh tham chiếu"
          );
        }

        referenceDescriptorRef.current = detection.descriptor;
        setVerificationProgress(100);
        console.log("✅ Reference face loaded successfully");

        // Khởi động webcam sau khi load xong reference face
        setTimeout(() => {
          startWebcam();
        }, 500);
      } catch (error) {
        console.error("❌ Error loading reference face:", error);
        message.error(
          error instanceof Error
            ? error.message
            : "Không thể tải ảnh tham chiếu"
        );
        setWebcamError("Không thể tải ảnh khuôn mặt tham chiếu từ hệ thống.");
      }
    };

    loadReferenceFace();
  }, [isLoadingModels]);

  const startWebcam = async () => {
    try {
      setIsWebcamLoading(true);
      setWebcamError(null);

      console.log("🔄 Starting webcam...");

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

        // ✅ Thêm event listener để đợi video sẵn sàng
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
            console.log("✅ Webcam started and playing");
            setIsWebcamLoading(false);
          } catch (playError) {
            console.error("❌ Error playing video:", playError);
            setWebcamError("Không thể phát video từ camera.");
            setIsWebcamLoading(false);
          }
        };

        // ✅ Fallback: Nếu video đã có metadata rồi
        if (videoRef.current.readyState >= 2) {
          await videoRef.current.play();
          console.log("✅ Webcam started and playing (fallback)");
          setIsWebcamLoading(false);
        }
      }
    } catch (error) {
      console.error("❌ Error accessing webcam:", error);
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
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // ✅ Capture và verify khuôn mặt
  const captureAndVerifyImage = async (): Promise<{
    imageFile: File;
    verificationResult: FaceVerificationResult;
  }> => {
    return new Promise(async (resolve, reject) => {
      if (!videoRef.current) {
        reject(new Error("Video not available"));
        return;
      }

      if (!referenceDescriptorRef.current || !referenceImageUrlRef.current) {
        reject(new Error("Reference face not loaded"));
        return;
      }

      try {
        const video = videoRef.current;

        // ✅ Phát hiện khuôn mặt trong video
        console.log("🔄 Detecting face in video...");
        const detection = await faceapi
          .detectSingleFace(video, new faceapi.SsdMobilenetv1Options())
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detection) {
          reject(
            new Error(
              "Không phát hiện được khuôn mặt. Vui lòng đảm bảo khuôn mặt của bạn trong khung hình."
            )
          );
          return;
        }

        console.log("✅ Face detected in video");

        // ✅ So sánh với ảnh tham chiếu
        const distance = faceapi.euclideanDistance(
          referenceDescriptorRef.current,
          detection.descriptor
        );

        // Threshold: 0.6 (càng nhỏ càng giống)
        const threshold = 0.6;
        const isVerified = distance < threshold;
        const similarity = Math.max(0, (1 - distance) * 100); // Convert to percentage

        console.log("📊 Verification result:", {
          distance,
          similarity: similarity.toFixed(2) + "%",
          isVerified,
          threshold,
        });

        if (!isVerified) {
          reject(
            new Error(
              `Xác thực không thành công. Độ tương đồng: ${similarity.toFixed(
                1
              )}% (yêu cầu >= ${((1 - threshold) * 100).toFixed(0)}%)`
            )
          );
          return;
        }

        // ✅ Capture ảnh từ video
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Cannot get canvas context"));
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // ✅ Vẽ khung xanh quanh khuôn mặt
        const box = detection.detection.box;
        ctx.strokeStyle = "green";
        ctx.lineWidth = 3;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.fillStyle = "green";
        ctx.font = "20px Arial";
        ctx.fillText(`Verified (${similarity.toFixed(1)}%)`, box.x, box.y - 10);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to capture image"));
              return;
            }

            const file = new File(
              [blob],
              `face-verification-${Date.now()}.jpg`,
              {
                type: "image/jpeg",
              }
            );

            const verificationResult: FaceVerificationResult = {
              isVerified: true,
              distance,
              similarity,
              capturedImageUrl: "", // Sẽ update sau khi upload
              referenceImageUrl: referenceImageUrlRef.current!,
              timestamp: new Date().toISOString(),
            };

            resolve({ imageFile: file, verificationResult });
          },
          "image/jpeg",
          0.95
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  // ✅ Xử lý khi nhấn nút chụp ảnh
  const handleCapturePhoto = async () => {
    if (isLoadingModels || !referenceDescriptorRef.current) {
      message.error("Hệ thống chưa sẵn sàng. Vui lòng đợi...");
      return;
    }

    try {
      setIsVerifying(true);
      setIsUploadingImage(true);
      message.loading({ content: "Đang xác thực khuôn mặt...", key: "verify" });

      // ✅ Capture và verify
      const { imageFile, verificationResult } = await captureAndVerifyImage();
      console.log("✅ Face verified successfully:", verificationResult);

      message.loading({ content: "Đang tải ảnh lên...", key: "verify" });

      // ✅ Upload lên ImgBB
      const imageUrl = await uploadImageToImgBB(imageFile);
      console.log("✅ Image uploaded to ImgBB:", imageUrl);

      // ✅ Update verification result với URL
      const finalResult: FaceVerificationResult = {
        ...verificationResult,
        capturedImageUrl: imageUrl,
      };

      message.success({
        content: `Xác thực thành công! Độ tương đồng: ${verificationResult.similarity.toFixed(
          1
        )}%`,
        key: "verify",
        duration: 3,
      });

      setCapturedImageUrl(imageUrl);
      setVerificationResult(finalResult);
      setShowSuccessCircle(true);

      // Dừng camera sau khi xác thực thành công
      setTimeout(() => {
        stopWebcam();
      }, 500);
    } catch (error) {
      console.error("❌ Error in verification:", error);
      message.error({
        content: error instanceof Error ? error.message : "Xác thực thất bại",
        key: "verify",
        duration: 5,
      });
    } finally {
      setIsVerifying(false);
      setIsUploadingImage(false);
    }
  };

  // ✅ Xử lý khi nhấn nút tiếp tục
  const handleContinue = () => {
    if (!capturedImageUrl || !verificationResult) {
      message.error("Chưa có dữ liệu xác thực. Vui lòng thử lại.");
      return;
    }

    console.log("✅ Starting exam with continuous monitoring");

    // Bắt đầu giám sát
    setExamStarted(true);

    console.log("✅ Continuing with verification result:", verificationResult);
    onStart(capturedImageUrl, verificationResult.similarity, referenceDescriptorRef.current || undefined);
  };

  // Thêm handler cho blocking
  const handleExamBlock = () => {
    setIsExamBlocked(true);
    message.error({
      content: "Bài thi đã bị khóa do vi phạm quy định giám sát!",
      duration: 0,
    });

    // TODO: Gọi API để log violation và tự động nộp bài
    // autoSubmitExam();
  };

  const handleCancel = () => {
    stopWebcam();
    setCapturedImageUrl(null);
    setShowSuccessCircle(false);
    setVerificationResult(null);
    onCancel();
  };

  const handleRetry = () => {
    setCapturedImageUrl(null);
    setShowSuccessCircle(false);
    setVerificationResult(null);
    setIsUploadingImage(false);
    setIsVerifying(false);
    startWebcam();
  };

  const handleGoToProfile = () => {
    navigate("/user-profile");
    onCancel();
  };

  const handleCloseNoFaceModal = () => {
    setShowNoFaceModal(false);
    onCancel();
  };

  // ✅ Hiển thị loading khi đang tải models
  if (isLoadingModels) {
    return (
      <div className="fixed inset-0 !bg-[rgba(83,83,83,0.62)] flex items-center justify-center z-50">
        <div className="!bg-white rounded-[18px] w-[500px] p-12">
          <h2 className="text-center text-[28px] font-bold text-black mb-8">
            Đang khởi tạo hệ thống xác thực
          </h2>
          <div className="flex flex-col items-center gap-4">
            <Spin size="large" />
            <Progress
              percent={verificationProgress}
              status="active"
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
            />
            <p className="text-gray-600 text-center">
              Đang tải mô hình nhận diện khuôn mặt...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 !bg-[rgba(83,83,83,0.62)] flex items-center justify-center z-50">
      <div className="!bg-white rounded-[18px] w-[997px] relative p-12">
        <button
          onClick={handleCancel}
          className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <CloseOutlined className="!text-red-500 text-2xl" />
        </button>

        <h2 className="text-center text-[36px] font-bold text-black mt-8">
          {showSuccessCircle ? "Xác minh thành công" : "Xác thực khuôn mặt"}
        </h2>

        <div className="mx-auto mt-16 w-full h-[580px] !bg-[#33363f] rounded-[11px] flex items-center justify-center relative overflow-hidden">
          {/* Loading state */}
          {isWebcamLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
              <Spin size="large" />
              <p className="text-white text-lg">Đang khởi động camera...</p>
            </div>
          )}

          {/* Error state */}
          {webcamError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4 z-10">
              <CameraOutlined className="mb-4 text-red-400 text-6xl" />
              <p className="text-center text-lg mb-4">{webcamError}</p>
              <Button
                onClick={handleRetry}
                className="!bg-blue-500 hover:!bg-blue-600 !text-white"
                size="large"
              >
                Thử lại
              </Button>
            </div>
          )}

          {/* Video stream */}
          {!showSuccessCircle && (
            <video
              ref={videoRef}
              autoPlay // ✅ Thêm autoPlay
              playsInline // ✅ Thêm playsInline (quan trọng cho mobile)
              muted // ✅ Thêm muted
              width="640" // ✅ Thêm width/height cố định
              height="480"
              className={`w-full h-full object-cover transition-all duration-300 ${
                isUploadingImage || isVerifying ? "blur-sm" : ""
              }`}
              style={{ display: "block" }} // ✅ Thêm display block
            />
          )}

          {/* Canvas để vẽ face detection (nếu cần) */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ display: "none" }}
          />

          {/* Uploading/Verifying overlay */}
          {(isUploadingImage || isVerifying) && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-[11px] flex flex-col items-center justify-center gap-4 z-10">
              <LoadingOutlined className="text-6xl text-blue-400 animate-spin" />
              <p className="text-white text-xl font-semibold">
                {isVerifying
                  ? "Đang xác thực khuôn mặt..."
                  : "Đang tải ảnh lên..."}
              </p>
            </div>
          )}

          {/* Success overlay */}
          {showSuccessCircle && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 gap-4 z-10">
              <div
                style={{
                  animation: `scaleInLarge 0.8s ease-out`,
                }}
              >
                <CheckCircleOutlined className="text-9xl !text-green-400 drop-shadow-lg" />
              </div>
              {verificationResult && (
                <div className="bg-white/90 rounded-lg p-4 text-center">
                  <p className="text-lg font-semibold text-green-600">
                    Độ tương đồng: {verificationResult.similarity.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Camera ready indicator */}
          {!webcamError &&
            !showSuccessCircle &&
            !isUploadingImage &&
            !isWebcamLoading &&
            !isVerifying && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 !bg-[rgba(240,240,240,0.22)] rounded-[12px] p-3 flex flex-col items-center justify-center backdrop-blur-sm z-10">
                <CameraOutlined className="text-xl !text-white" />
                <span className="text-white text-sm mt-1">Sẵn sàng</span>
              </div>
            )}

          {examStarted && referenceDescriptorRef.current && (
            <ContinuousFaceMonitor
              referenceDescriptor={referenceDescriptorRef.current}
              onBlock={handleExamBlock}
              enabled={!isExamBlocked}
            />
          )}
        </div>

        <div className="flex justify-center gap-4 mt-12">
          <Button
            onClick={handleCancel}
            disabled={isUploadingImage || showSuccessCircle || isVerifying}
            className="!bg-[#ff2e00] hover:!bg-[#e02900] !text-white rounded-[12px] h-[50px] !px-12 text-[20px]"
          >
            Hủy
          </Button>

          {!isWebcamLoading &&
            !webcamError &&
            !capturedImageUrl &&
            !showSuccessCircle && (
              <Button
                onClick={handleCapturePhoto}
                loading={isUploadingImage || isVerifying}
                disabled={isUploadingImage || isVerifying || isLoadingModels}
                className="!bg-[#6392e9] hover:!bg-[#5282d8] !text-white rounded-[12px] h-[50px] !px-12 text-[20px]"
                icon={
                  !isUploadingImage && !isVerifying ? (
                    <CameraOutlined />
                  ) : undefined
                }
              >
                {isVerifying
                  ? "Đang xác thực..."
                  : isUploadingImage
                  ? "Đang xử lý..."
                  : "Chụp ảnh & Xác thực"}
              </Button>
            )}

          {capturedImageUrl && showSuccessCircle && verificationResult && (
            <Button
              onClick={handleContinue}
              className="!bg-[#6392e9] hover:!bg-[#5282d8] !text-white rounded-[12px] h-[50px] !px-12 text-[20px]"
            >
              Tiếp tục làm bài
            </Button>
          )}
        </div>
      </div>

      <style>{`
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

      {/* Modal cảnh báo không có ảnh khuôn mặt */}
      <Modal
        open={showNoFaceModal}
        onCancel={handleCloseNoFaceModal}
        footer={null}
        centered
        width={500}
        closable={false}
        maskClosable={false}
      >
        <div className="text-center py-8">
          <ExclamationCircleOutlined className="text-6xl text-orange-500 mb-6" />
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Chưa có ảnh khuôn mặt
          </h3>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            Bạn chưa có ảnh khuôn mặt trong hệ thống. Vui lòng cập nhật ảnh
            khuôn mặt trong hồ sơ cá nhân để có thể tham gia bài thi với xác
            thực khuôn mặt.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleCloseNoFaceModal}
              className="!bg-gray-500 hover:!bg-gray-600 !text-white rounded-lg h-12 !px-8"
            >
              Hủy
            </Button>
            <Button
              onClick={handleGoToProfile}
              className="!bg-blue-500 hover:!bg-blue-600 !text-white rounded-lg h-12 !px-8"
              icon={<UserOutlined />}
            >
              Cập nhật ảnh khuôn mặt
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
