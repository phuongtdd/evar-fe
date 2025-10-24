import React, { useEffect, useState } from "react";
import Logo from "../../assets/icons/logo/EVar_logo.png";

const LandingHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight; 
      
      if (scrollY > heroHeight * 0.8) { 
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-3 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="EVar" className="w-7 h-7" />
          <span className={`font-semibold transition-colors duration-300 ${
            isScrolled ? 'text-blue-600' : 'text-white'
          }`}>
            EVar
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {["Features", "About", "Pricing", "Contact", "Blog"].map((item, index) => (
            <a
              key={index}
              href="#"
              className={`!no-underline transition-all duration-300 ${
                isScrolled 
                  ? '!text-slate-700 !hover:text-blue-600' 
                  : '!text-white/90 !hover:text-blue-200'
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className={`h-8 px-4 rounded-full text-sm transition-all duration-300 ${
            isScrolled
              ? 'border border-blue-600 text-blue-600 hover:bg-blue-50'
              : 'border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm'
          }`}>
            Đăng nhập
          </button>
          <button className={`h-8 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
            isScrolled
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
          }`}>
            Đăng ký
          </button>
        </div>
      </div>

      <div className={`absolute inset-0 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200'
          : 'backdrop-blur-md bg-white/10 shadow-lg'
      }`}
        style={{ 
          backdropFilter: 'blur(12px)',
          zIndex: -1
        }}
      />
    </header>
  );
};

export default LandingHeader;