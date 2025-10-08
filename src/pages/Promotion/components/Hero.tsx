import React from "react";
import SectionContainer from "./SectionContainer";

const Hero: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-[#2F5DB6] text-white">
      <SectionContainer className="pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Học nhóm trực tuyến
              <br />
              Quiz & AI thông minh
            </h1>
            <p className="mt-4 text-white/90">
              Lớp học ảo, giám sát thông minh, tạo quiz từ OCR AI. Tất cả những gì bạn
              cần cho giáo dục hiện đại.
            </p>
            <div className="mt-6 flex gap-3">
              <button className="px-4 py-2 rounded-md bg-white text-[#2F5DB6] font-medium hover:opacity-90">
                Bắt đầu ngay
              </button>
              <button className="px-4 py-2 rounded-md border border-white text-white hover:bg-white/10">
                Khám phá thêm
              </button>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-6 text-sm">
              <div>
                <div className="opacity-80">Tài liệu</div>
                <div className="text-lg font-semibold">+1000</div>
              </div>
              <div>
                <div className="opacity-80">Quiz</div>
                <div className="text-lg font-semibold">+9999</div>
              </div>
            </div>
          </div>
          <div className="relative h-[260px] md:h-[320px]">
            <div className="absolute top-2 right-6 rotate-[-10deg] w-72 md:w-80 bg-white/95 rounded-xl shadow-xl p-4">
              <div className="text-[#2F5DB6] font-medium">Live classroom</div>
              <div className="mt-3 h-24 bg-gray-100 rounded" />
            </div>
            <div className="absolute bottom-0 left-4 rotate-[10deg] w-72 md:w-80 bg-white/95 rounded-xl shadow-xl p-4">
              <div className="text-[#2F5DB6] font-medium">AI scanned Quiz</div>
              <div className="mt-3 h-24 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default Hero;


