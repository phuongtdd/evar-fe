import React, { useState, useRef, useEffect } from "react";
import { AspectRatio } from "react-bootstrap-icons";

const AboutWithVideo: React.FC = () => {
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [showSecondVideo, setShowSecondVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle user interaction to enable autoplay
  const handleUserInteraction = () => {
    setHasUserInteracted(true);
    setShowSecondVideo(true);
  };

  // Add click listener to enable autoplay
  useEffect(() => {
    const handleClick = () => handleUserInteraction();
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Handle video load errors
  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <section className="relative bg-[#f4f4f4] py-20 px-4 lg:py-16 md:py-12 sm:py-8 mb-[120px]">
      {/* Background virtual office environment */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-blue-50/30 to-transparent"></div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-50/30 to-transparent"></div>
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      <div>
        <div className="relative w-full aspect-[16/9] bg-transparent overflow-hidden">
          <div className="flex flex-col items-center justify-center mx-auto w-full absolute top-7">
            <h2 className="mb-6 !text-5xl font-bold leading-tight text-black lg:text-4xl md:text-3xl sm:text-2xl">
              Hữu ích và luôn sẵn sàng
            </h2>

            <p className="mx-auto mb-16 max-w-2xl text-lg leading-relaxed text-gray-700 lg:text-base md:text-sm text-center">
              Tạo không gian phòng học ảo tùy chỉnh cho bất kỳ ai hoặc sự kiện
              nào với chất lượng âm thanh và hình ảnh tốt.
            </p>
          </div>
          <iframe
            src="https://player.cloudinary.com/embed/?cloud_name=dxt8ylemj&public_id=1023_z75tj3&profile=hihihi"
            width="640"
            height="360"
            style={{ height: "auto", width: "100%", aspectRatio: "16/9" }}
            allow="autoplay; fullscreen; encrypted-media;"
            allowFullScreen
          />

          <div className="absolute inset-0 bg-transparent z-20 pointer-events-auto" />

          <div className="absolute left-0 top-0 h-full w-[200px] bg-[#f4f4f4] z-10" />
          <div className="absolute right-0 top-0 h-full w-[200px] bg-[#f4f4f4] z-10" />
        </div>
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mx-auto  !mb-12 max-w-3xl text-center text-lg leading-relaxed text-gray-700 lg:text-base md:text-sm ">
            Việc cộng tác với các nhóm làm việc từ xa trở nên dễ dàng trong môi
            trường văn phòng ảo của bạn. Tận hưởng giao tiếp thời gian thực ngay
            tại không gian làm việc của bạn mà không cần thêm bất kỳ rắc rối nào
            về phần mềm.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1v-2zm8-4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1v-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Tùy chỉnh không gian làm việc
              </h3>
              <p className="text-gray-600">
                Tạo văn phòng và phòng họp của riêng bạn để phù hợp với nhu cầu
                của đội ngũ.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Cuộc gọi âm thanh và video
              </h3>
              <p className="text-gray-600">
                Hợp tác hiệu quả và liền mạch với chất lượng hội nghị trực tuyến
                cao cấp.
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 11-2 0 1 1 0 012 0zM12 7a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Mời khách
              </h3>
              <p className="text-gray-600">
                Gặp gỡ khách mà không cần phải rời khỏi không gian làm việc của
                bạn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutWithVideo;
