import React from "react";
import SectionContainer from "./SectionContainer";
import GpsFixedIcon from "../../../assets/icons/ic_gps.svg";
import UserAddDuotoneIcon from "../../../assets/icons/ic_user_add_duotone.svg";
import HappyIcon from "../../../assets/icons/ic_happy.svg";

const CoreGoals: React.FC = () => {
  const goals = [
    { icon: GpsFixedIcon, title: "Đổi mới", desc: "Không ngừng mở rộng giới hạn với AI và công nghệ" },
    { icon: UserAddDuotoneIcon, title: "Khả năng tiếp cận", desc: "Mang giáo dục chất lượng đến với mọi người" },
    { icon: HappyIcon, title: "Xuất sắc", desc: "Cung cấp những công cụ và hỗ trợ chất lượng cao nhất" },
  ];
  return (
    <SectionContainer className="py-12">
      <h3 className="text-center text-2xl md:text-3xl font-semibold mb-8">Mục tiêu cốt lõi</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((g) => (
          <div key={g.title} className="rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
            <img src={g.icon} alt="icon" className="mx-auto mb-4 h-10 w-10 rounded-full" />
            <div className="text-lg font-semibold">{g.title}</div>
            <p className="text-gray-600 mt-2 text-sm">{g.desc}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default CoreGoals;


