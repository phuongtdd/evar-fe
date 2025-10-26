import {
  CameraOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Button, Spin, message } from "antd";
import { useState, useEffect, useRef } from "react";
import { uploadImageToImgBB } from "../../../../utils/ImageUpload";

interface FaceVerificationStepProps {
  onStart: (faceImageUrl: string) => void;
  onCancel: () => void;
}

export function FaceVerificationStep({
  onStart,
  onCancel,
}: FaceVerificationStepProps) {
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [isWebcamLoading, setIsWebcamLoading] = useState(true);
  const [showSuccessCircle, setShowSuccessCircle] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    startWebcam();
    return () => {
      stopWebcam();
    };
  }, []);

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

      // ✅ Giống code cũ - set false ngay lập tức
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

  // ✅ Hàm chụp ảnh từ video
  const captureImage = (): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current) {
        reject(new Error("Video not available"));
        return;
      }

      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Cannot get canvas context"));
        return;
      }

      // Vẽ frame hiện tại lên canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Chuyển canvas thành blob rồi thành file
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
          resolve(file);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  // ✅ Xử lý khi nhấn nút chụp ảnh
  const handleCapturePhoto = async () => {
    try {
      setIsUploadingImage(true);
      message.loading({ content: "Đang chụp ảnh...", key: "capture" });

      // Capture ảnh từ video
      const imageFile = await captureImage();
      console.log("✅ Image captured:", imageFile);

      message.loading({ content: "Đang tải ảnh lên...", key: "capture" });

      // Upload lên ImgBB
      const imageUrl = await uploadImageToImgBB(imageFile);
      console.log("✅ Image uploaded to ImgBB:", imageUrl);

      message.success({
        content: "Chụp ảnh thành công!",
        key: "capture",
        duration: 2,
      });

      setCapturedImageUrl(imageUrl);
      setShowSuccessCircle(true);

      // Dừng camera sau khi chụp thành công
      setTimeout(() => {
        stopWebcam();
      }, 500);
    } catch (error) {
      console.error("❌ Error capturing/uploading image:", error);
      message.error({
        content: "Không thể chụp ảnh. Vui lòng thử lại.",
        key: "capture",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // ✅ Xử lý khi nhấn nút tiếp tục
  const handleContinue = () => {
    if (!capturedImageUrl) {
      message.error("Không tìm thấy ảnh xác thực. Vui lòng thử lại.");
      return;
    }

    console.log("✅ Continuing with image URL:", capturedImageUrl);
    onStart(capturedImageUrl);
  };

  const handleCancel = () => {
    stopWebcam();
    setCapturedImageUrl(null);
    setShowSuccessCircle(false);
    onCancel();
  };

  const handleRetry = () => {
    setCapturedImageUrl(null);
    setShowSuccessCircle(false);
    setIsUploadingImage(false);
    startWebcam();
  };

  return (
    <div className="fixed inset-0 !bg-[rgba(83,83,83,0.62)] flex items-center justify-center z-50">
      <div className="!bg-white rounded-[18px] w-[997px] relative p-12">
        <button
          onClick={handleCancel}
          className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <CloseOutlined className="!text-red-500" />
        </button>

        <h2 className="text-center text-[36px] font-bold text-black mt-8">
          {showSuccessCircle
            ? "Xác minh thành công"
            : "Xác thực người làm bài thi"}
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
                isUploadingImage ? "blur-sm" : ""
              }`}
            />
          )}

          {/* ✅ Overlay khi đang upload */}
          {isUploadingImage && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-[11px] flex flex-col items-center justify-center gap-4">
              <LoadingOutlined className="text-6xl text-blue-400 animate-spin" />
              <p className="text-white text-xl font-semibold">
                Đang tải ảnh lên...
              </p>
            </div>
          )}

          {/* ✅ Success overlay */}
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

          {/* ✅ Camera icon */}
          {!webcamError && !showSuccessCircle && !isUploadingImage && !isWebcamLoading && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 !bg-[rgba(240,240,240,0.22)] rounded-[12px] p-3 flex flex-col items-center justify-center backdrop-blur-sm">
              <CameraOutlined className="text-xl !text-[rgb(255,255,255)]" />
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-12">
          <Button
            onClick={handleCancel}
            disabled={isUploadingImage || showSuccessCircle}
            className="!bg-[#ff2e00] !hover:bg-[#e02900] text-white rounded-[12px] h-[50px] !px-12 text-[20px]"
          >
            Hủy
          </Button>

          {/* ✅ Nút chụp ảnh - hiện khi camera sẵn sàng và chưa chụp */}
          {!isWebcamLoading && !webcamError && !capturedImageUrl && !showSuccessCircle && (
            <Button
              onClick={handleCapturePhoto}
              loading={isUploadingImage}
              disabled={isUploadingImage}
              className="!bg-[#6392e9] hover:!bg-[#5282d8] !text-white rounded-[12px] h-[50px] !px-12 text-[20px]"
              icon={!isUploadingImage ? <CameraOutlined /> : undefined}
            >
              {isUploadingImage ? "Đang xử lý..." : "Chụp ảnh"}
            </Button>
          )}

          {/* ✅ Nút tiếp tục - hiện khi đã chụp thành công */}
          {capturedImageUrl && showSuccessCircle && (
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
    </div>
  );
}