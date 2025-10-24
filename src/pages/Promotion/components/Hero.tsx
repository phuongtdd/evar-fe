"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "antd"
import { ArrowRightOutlined } from "@ant-design/icons"
import SectionContainer from "./SectionContainer"

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <SectionContainer className="pt-20 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            <div className="inline-block mb-4 px-4 py-2 bg-blue-100/60 rounded-full">
              <span className="text-sm font-medium text-blue-700">✨ Nền tảng giáo dục AI</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
              Học nhóm trực tuyến
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Quiz & AI thông minh
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-lg">
              Lớp học ảo, giám sát thông minh, tạo quiz từ OCR AI. Tất cả những gì bạn cần cho giáo dục hiện đại.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                type="primary"
                size="large"
                className="h-12 px-8 text-base font-semibold rounded-lg bg-blue-600 hover:bg-blue-700"
                icon={<ArrowRightOutlined />}
                iconPosition="end"
              >
                Bắt đầu ngay
              </Button>
              <Button
                size="large"
                className="h-12 px-8 text-base font-semibold rounded-lg border-2 border-slate-300 hover:border-blue-600 hover:text-blue-600"
              >
                Khám phá thêm
              </Button>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8">
              <div className="group">
                <div className="text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                  Tài liệu
                </div>
                <div className="text-3xl font-bold text-slate-900 mt-1">+1000</div>
              </div>
              <div className="group">
                <div className="text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                  Quiz
                </div>
                <div className="text-3xl font-bold text-slate-900 mt-1">+9999</div>
              </div>
            </div>
          </div>

          <div className="relative h-96 md:h-[450px]">
            <div
              className={`absolute top-8 right-0 w-80 md:w-96 bg-white rounded-2xl shadow-xl p-6 border border-slate-100 transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0 rotate-0" : "opacity-0 translate-y-8 -rotate-3"
              }`}
              style={{
                animation: isVisible ? "float 3s ease-in-out infinite" : "none",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-sm font-semibold text-slate-700">Live classroom</span>
              </div>
              <div className="h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl" />
            </div>

            <div
              className={`absolute bottom-8 left-0 w-80 md:w-96 bg-white rounded-2xl shadow-xl p-6 border border-slate-100 transition-all duration-1000 delay-300 ${
                isVisible ? "opacity-100 translate-y-0 rotate-0" : "opacity-0 translate-y-8 rotate-3"
              }`}
              style={{
                animation: isVisible ? "float 3s ease-in-out infinite 0.5s" : "none",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-indigo-600" />
                <span className="text-sm font-semibold text-slate-700">AI scanned Quiz</span>
              </div>
              <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl" />
            </div>
          </div>
        </div>
      </SectionContainer>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  )
}

export default Hero
