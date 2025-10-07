import React from "react";
import Logo from "../../assets/icons/logo/EVar_logo.png";

const LandingHeader: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="EVar" className="w-7 h-7" />
          <span className="font-semibold">EVar</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a className="hover:text-[#2F5DB6]" href="#">Feature</a>
          <a className="hover:text-[#2F5DB6]" href="#">Feature</a>
          <a className="hover:text-[#2F5DB6]" href="#">Feature</a>
          <a className="hover:text-[#2F5DB6]" href="#">Feature</a>
          <a className="hover:text-[#2F5DB6]" href="#">Feature</a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="h-8 px-4 rounded-full border border-[#2F5DB6] text-[#2F5DB6] text-sm hover:bg-blue-50">
            Đăng nhập
          </button>
          <button className="h-8 px-4 rounded-full bg-[#6FA1FF] text-white text-sm hover:opacity-90">
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingHeader;


