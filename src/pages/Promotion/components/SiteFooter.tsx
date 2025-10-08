import React from "react";
import SectionContainer from "./SectionContainer";

const SiteFooter: React.FC = () => {
  return (
    <footer className="bg-[#2F5DB6] text-white">
      <SectionContainer className="py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="text-xl font-semibold mb-3">Evar</div>
            <p className="text-white/80 text-sm">
              Empowering education through innovative technology.
              Virtual classrooms, AI tutoring, and collaborative learning.
            </p>
            <p className="text-white/80 text-sm mt-3">Support us: @placeholderEmail.com</p>
          </div>
          <div>
            <div className="font-semibold mb-3">Feature</div>
            <ul className="space-y-2 text-white/85 text-sm">
              <li>AI OCR Quiz</li>
              <li>Anti-cheat</li>
              <li>Real-time class</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-3">Support</div>
            <ul className="space-y-2 text-white/85 text-sm">
              <li>Help center</li>
              <li>Documentation</li>
              <li>Contact us</li>
            </ul>
          </div>
        </div>
      </SectionContainer>
    </footer>
  );
};

export default SiteFooter;


