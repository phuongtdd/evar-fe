import { CameraOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import UserIcon from "../../../../assets/icons/User_cicrle.svg";
import { useState, useEffect, useRef } from "react";

interface FaceVerificationStepProps {
  onStart: () => void;
  onCancel: () => void;
}

export function FaceVerificationStep({
  onStart,
  onCancel,
}: FaceVerificationStepProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [isWebcamLoading, setIsWebcamLoading] = useState(true);
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
          facingMode: 'user'
        },
        audio: false
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsWebcamLoading(false);
    } catch (error) {
      console.error('Error accessing webcam:', error);
      setWebcamError('Không thể truy cập webcam. Vui lòng kiểm tra quyền truy cập camera.');
      setIsWebcamLoading(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleStart = () => {
    setIsProcessing(true);
    stopWebcam(); 
    setTimeout(() => {
      onStart();
    }, 1500);
  };

  const handleCancel = () => {
    stopWebcam();
    onCancel();
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
          Vui lòng kích hoạt webcam
        </h2>

        <div className="mx-auto mt-16 w-full h-[390px] !bg-[#33363f] rounded-[11px] flex items-center justify-center relative overflow-hidden">
          {isWebcamLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spin size="large" />
            </div>
          )}
          
          {webcamError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
              <CameraOutlined size={80} className="mb-4 text-red-400" />
              <p className="text-center text-lg">{webcamError}</p>
              <Button 
                onClick={startWebcam}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
              >
                Thử lại
              </Button>
            </div>
          )}
          
          {!isWebcamLoading && !webcamError && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
          
          {!webcamError && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 !bg-[rgba(240,240,240,0.22)] rounded-[12px] p-3 flex flex-col items-center justify-center">
              <CameraOutlined size={140} className="!text-[rgb(255,255,255)]" />
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-12">
          <Button
            onClick={handleCancel}
            disabled={isProcessing}
            className="!bg-[#ff2e00] !hover:bg-[#e02900] text-white rounded-[12px] h-[50px] !px-6 text-[20px]"
          >
            Dừng
          </Button>
          <Button
            onClick={handleStart}
            loading={isProcessing}
            // disabled={webcamError || isWebcamLoading}
            className="!bg-[#6392e9] !hover:bg-[#5282d8] text-white rounded-[12px] h-[50px] !px-6 text-[20px]"
          >
            {isProcessing ? 'Đang xử lý...' : 'Bắt đầu'}
          </Button>
        </div>
      </div>
    </div>
  );
}
