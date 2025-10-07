import React from "react";
import SectionContainer from "./SectionContainer";

const CTA: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600/90 to-indigo-600/80 py-16">
      <SectionContainer>
        <div className="text-center text-white">
          <h3 className="text-2xl md:text-3xl font-semibold">Sẵn sàng để biến đổi trải nghiệm học tập của bạn?</h3>
          <p className="mt-2 opacity-90">Bắt đầu miễn phí hoặc nâng cấp để mở khoá toàn bộ tính năng.</p>
          <div className="mt-6">
            <button className="px-4 py-2 rounded-md bg-white text-blue-600 font-medium hover:opacity-90">Bắt đầu ngay</button>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default CTA;


