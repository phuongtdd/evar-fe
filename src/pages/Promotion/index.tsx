import React, { useState } from "react";
import { FloatButton } from "antd";
import LandingHeader from "../Common/LandingHeader";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CTA from "./components/CTA";
import AboutWithVideo from "./components/AboutWithVideo";
import CoreGoals from "./components/CoreGoals";
import SiteFooter from "./components/SiteFooter";
import AboutUs from "./components/AboutUs";
import { InfoOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from "@ant-design/icons";


const Promotion: React.FC = () => {
  return (
    <div className=" bg-gray-50">
      <LandingHeader />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <CTA />
      <AboutWithVideo />
      <AboutUs />
      <CoreGoals />
      <SiteFooter />
      <FloatButton.Group
        trigger="hover"
        type="primary"
        style={{ right: 24, bottom: 24 }}
        icon={<InfoOutlined />}
      >
        <FloatButton
          tooltip="Lên đầu trang"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          icon={<VerticalAlignTopOutlined /> }
        />
        <FloatButton
          tooltip="Xuống cuối trang"
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
          icon={<VerticalAlignBottomOutlined /> }
        />
      </FloatButton.Group>
    </div>
  );
};

export default Promotion;
