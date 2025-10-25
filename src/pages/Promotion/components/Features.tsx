"use client"

import type React from "react"
import { useState } from "react"
import SectionContainer from "./SectionContainer"
import { useStaggerAnimation, useInViewAnimation } from "./animationUtils";
import {
  PlayCircleOutlined,
  CloudServerOutlined,
  EyeInvisibleOutlined,
  TeamOutlined,
  FieldTimeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons"

const Features: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const { ref, isInView } = useInViewAnimation()
  const visibleItems = useStaggerAnimation(5, isInView ? 100 : 0)

  const features = [
    {
      icon: PlayCircleOutlined,
      title: "Phòng học ảo",
      desc: "Học trực tiếp qua video HD, chia sẻ màn hình, bảng trắng trong nền tảng an toàn và hiệu quả.",
      items: ["HD video", "Ghi hình", "Trò chuyện trong phòng học", "Chấm giảng tiện"],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      icon: CloudServerOutlined,
      title: "Bộ chuyển đổi Quiz AI OCR",
      desc: "Tải tệp ảnh hoặc PDF, hệ thống sẽ tạo quiz tự động nhờ OCR kết hợp AI.",
      items: ["Tự động hóa", "Chính xác cao", "Hỗ trợ đa định dạng"],
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
    },
    {
      icon: EyeInvisibleOutlined,
      title: "Giám sát thông minh",
      desc: "Phát hiện bất thường bằng AI để đảm bảo tính minh bạch khi kiểm tra.",
      items: ["Phát hiện gian lận", "Báo cáo chi tiết", "Bảo mật cao"],
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
    },
    {
      icon: TeamOutlined,
      title: "Nhóm học tập",
      desc: "Tổ chức nhóm học linh hoạt, điểm bày tỏ, lưu vết và phân quyền cho thành viên.",
      items: ["Quản lý nhóm", "Phân quyền", "Theo dõi tiến độ"],
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
    },
    {
      icon: FieldTimeOutlined,
      title: "Thời gian thực",
      desc: "Tương tác thời gian thực giúp lớp học sôi động và hiệu quả.",
      items: ["Cập nhật tức thì", "Đồng bộ hóa", "Phản hồi nhanh"],
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50",
      borderColor: "border-rose-200",
    },
  ]

  return (
    <SectionContainer className="py-20" ref={ref}>
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 text-balance">Tính năng nổi bật</h2>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Khám phá những công cụ mạnh mẽ được thiết kế để nâng cao trải nghiệm học tập
        </p>
      </div>

      {/* Layout như trong hình: 2-3 pattern */}
      <div className="space-y-6">
        {/* Hàng đầu: 2 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.slice(0, 2).map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={`group relative transition-all duration-700 ${
                  visibleItems[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`h-full rounded-2xl border-2 ${feature.borderColor} ${feature.bgColor} p-8 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    hoveredIndex === index
                      ? "shadow-2xl -translate-y-2 border-opacity-100"
                      : "shadow-lg border-opacity-50"
                  }`}
                >
                  {/* Animated background on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
                  />

                  {/* Animated icon container */}
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 transition-all duration-300 ${
                      hoveredIndex === index ? "scale-110 shadow-lg" : "scale-100"
                    }`}
                    style={{
                      animation: hoveredIndex === index ? "bounce 0.6s ease-in-out" : "none",
                    }}
                  >
                    <Icon className="text-2xl text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">{feature.desc}</p>

                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-slate-700 transition-all duration-300"
                        style={{
                          animation: hoveredIndex === index ? `slideIn 0.3s ease-out ${itemIndex * 0.1}s both` : "none",
                        }}
                      >
                        <CheckCircleOutlined
                          className={`text-base bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* Hàng thứ hai: 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.slice(2, 5).map((feature, index) => {
            const actualIndex = index + 2 // Vì đây là cards từ index 2-4
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className={`group relative transition-all duration-700 ${
                  visibleItems[actualIndex] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                onMouseEnter={() => setHoveredIndex(actualIndex)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`h-full rounded-2xl border-2 ${feature.borderColor} ${feature.bgColor} p-8 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                    hoveredIndex === actualIndex
                      ? "shadow-2xl -translate-y-2 border-opacity-100"
                      : "shadow-lg border-opacity-50"
                  }`}
                >
                  {/* Animated background on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
                  />

                  {/* Animated icon container */}
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4 transition-all duration-300 ${
                      hoveredIndex === actualIndex ? "scale-110 shadow-lg" : "scale-100"
                    }`}
                    style={{
                      animation: hoveredIndex === actualIndex ? "bounce 0.6s ease-in-out" : "none",
                    }}
                  >
                    <Icon className="text-2xl text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 leading-relaxed">{feature.desc}</p>

                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-sm text-slate-700 transition-all duration-300"
                        style={{
                          animation: hoveredIndex === actualIndex ? `slideIn 0.3s ease-out ${itemIndex * 0.1}s both` : "none",
                        }}
                      >
                        <CheckCircleOutlined
                          className={`text-base bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </SectionContainer>
  )
}

export default Features