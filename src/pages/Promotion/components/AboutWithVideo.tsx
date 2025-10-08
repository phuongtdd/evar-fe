import React from "react";
import SectionContainer from "./SectionContainer";

const AboutWithVideo: React.FC = () => {
  return (
    <div className="bg-white">
      <SectionContainer className="py-16">
        <div className="relative rounded-2xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_40%),_radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.15),transparent_40%)]" />
          <div className="relative p-4 sm:p-8">
            <div className="mx-auto max-w-3xl">
              <div className="aspect-video bg-black/5 rounded-xl overflow-hidden">
                <video
                  className="w-full h-full object-cover pointer-events-none"
                  src={"/assets/videos/videoplayback.webm"}
                  playsInline
                  muted
                  loop
                  autoPlay
                  controlsList="nodownload nofullscreen noplaybackrate"
                  disablePictureInPicture
                />
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      <SectionContainer className="pb-4">
        <h3 className="text-center text-2xl font-semibold mb-2">Về chúng tôi</h3>
        <p className="text-center text-gray-600 max-w-3xl mx-auto">
          Chúng tôi mang sứ mệnh đưa giáo dục chất lượng đến với mọi người thông qua công nghệ đổi mới.
        </p>
      </SectionContainer>

      <SectionContainer className="py-10">
        <h4 className="text-xl font-semibold mb-3">Sứ mệnh của chúng tôi</h4>
        <p className="text-gray-700 max-w-4xl">
          Chúng tôi tin rằng giáo dục là nền tảng của sự tiến bộ. Nền tảng của chúng tôi kết hợp công nghệ AI tiên tiến
          với thiết kế trực quan để tạo ra trải nghiệm học tập hấp dẫn, hiệu quả và dễ tiếp cận cho học sinh và giáo viên trên toàn thế giới.
          Chúng tôi cam kết xóa bỏ rào cản đối với giáo dục chất lượng và trao quyền cho giáo viên bằng các công cụ giúp tiết kiệm thời gian và nâng cao kết quả học tập.
        </p>
      </SectionContainer>
    </div>
  );
};

export default AboutWithVideo;


