"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "antd"
import { ArrowRightOutlined } from "@ant-design/icons"
import SectionContainer from "./SectionContainer"
import { useInViewAnimation } from "./animationUtils"

const CTA: React.FC = () => {
  const { ref, isInView } = useInViewAnimation()
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (isInView) {
      setShowContent(true)
    }
  }, [isInView])

  return (
    <div className="relative overflow-hidden py-20" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
          style={{
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
          style={{
            animation: "float 6s ease-in-out infinite 1s",
          }}
        />
      </div>

      <SectionContainer className="relative z-10">
        <div
          className={`text-center text-white transition-all duration-1000 ${
            showContent ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance leading-tight">
            <span
              style={{
                animation: showContent ? "slideUp 0.8s ease-out" : "none",
              }}
              className="inline-block"
            >
              Sẵn sàng để biến đổi
            </span>
            <br />
            <span
              style={{
                animation: showContent ? "slideUp 0.8s ease-out 0.2s both" : "none",
              }}
              className="inline-block bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent"
            >
              trải nghiệm học tập?
            </span>
          </h3>

          <p
            className="mt-4 text-lg text-white/90 max-w-2xl mx-auto"
            style={{
              animation: showContent ? "slideUp 0.8s ease-out 0.4s both" : "none",
            }}
          >
            Bắt đầu miễn phí hoặc nâng cấp để mở khoá toàn bộ tính năng và công cụ mạnh mẽ.
          </p>

          <div
            className="mt-10 flex flex-wrap justify-center gap-4"
            style={{
              animation: showContent ? "slideUp 0.8s ease-out 0.6s both" : "none",
            }}
          >
            <Button
              type="primary"
              size="large"
              className="h-12 px-8 text-base font-semibold rounded-lg bg-white text-blue-600 hover:bg-slate-100 transition-all duration-300 hover:shadow-xl hover:scale-105"
              icon={<ArrowRightOutlined />}
              iconPosition="end"
            >
              Bắt đầu ngay
            </Button>
            <Button
              size="large"
              className="h-12 px-8 text-base font-semibold rounded-lg border-2 border-white text-white hover:bg-white/10 transition-all duration-300 hover:shadow-xl"
            >
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </SectionContainer>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}

export default CTA
