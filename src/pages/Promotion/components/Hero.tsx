"use client";

import type React from "react";
import { GL } from "./gl/index";
import { Button } from "antd";

const Hero: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden mb-12">
      <GL />

      <div className="text-center relative h-full w-full flex flex-col items-center justify-center gap-4">
        <span className="text-8xl sm:text-6xl md:text-7xl font-sentient text-white leading-tight">
          Mở khóa <br />
          <i className="font-light text-[#FCD34D]">hành trình tri thức</i>
        </span>

        <p className="font-poppins !text-[18px] sm:text-base text-white/80 text-balance mt-8 max-w-[800px] mx-auto">
          Học thông minh hơn cùng{" "}
          <span className="text-white font-medium">Evar</span> — nền tảng
          E-Learning tích hợp AI, nơi mỗi bài học trở thành một bước tiến trong
          hành trình phát triển bản thân.
        </p>

        <Button
          className="!bg-amber-300 !text-black !border-amber-300 !hover:bg-amber-500 !px-8 !py-5 !text-[18px] !font-bold mt-3" 
        >
          Khám phá ngay
        </Button>
      </div>
    </div>
  );
};

export default Hero;
