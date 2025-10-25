import type React from "react";
import SectionContainer from "./SectionContainer";
import { CheckOutlined } from "@ant-design/icons";

const CoreGoals: React.FC = () => {

  const goals = [
    {
      title: "Đổi mới",
      desc: "Không ngừng mở rộng giới hạn với AI và công nghệ tiên tiến",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Khả năng tiếp cận",
      desc: "Mang giáo dục chất lượng đến với mọi người trên toàn thế giới",
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Xuất sắc",
      desc: "Cung cấp những công cụ và hỗ trợ chất lượng cao nhất",
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <SectionContainer className="py-20">
      <div className="text-center mb-16">
        <h3 className="text-4xl md:text-5xl font-bold text-slate-900 text-balance">
          Mục tiêu cốt lõi
        </h3>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Những giá trị cơ bản hướng dẫn mọi quyết định của chúng tôi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {goals.map((goal, index) => (
          <div
            key={goal.title}
            className="group transition-all duration-700 opacity-100 translate-y-0"
          >
            <div className="relative h-full rounded-2xl border-2 border-slate-200 bg-white p-8 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${goal.color} rounded-t-2xl transition-all duration-300 group-hover:h-2`}
              />

              <div
                className={`absolute inset-0 bg-gradient-to-br ${goal.color} opacity-0 group-hover:opacity-3 transition-opacity duration-100 pointer-events-none`}
              />

              <p className="text-slate-600 leading-relaxed mb-4 transition-colors duration-300 group-hover:text-slate-700">
                {goal.desc}
              </p>

              <div
                className="flex items-center gap-2 text-sm text-slate-700 pt-4 border-t border-slate-100 transition-all duration-100 group-hover:border-slate-200 ease-in"
              >
                <CheckOutlined
                  className={`text-base bg-gradient-to-r ${goal.color} bg-clip-text text-transparent transition-transform duration-300 group-hover:scale-125`}
                />
                <span>Ưu tiên hàng đầu</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
};

export default CoreGoals;
