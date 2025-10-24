import React, { useState } from "react";
import LandingHeader from "../Common/LandingHeader";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CTA from "./components/CTA";
import AboutWithVideo from "./components/AboutWithVideo";
import CoreGoals from "./components/CoreGoals";
import SiteFooter from "./components/SiteFooter";
import AboutUs from "./components/AboutUs";


const Promotion: React.FC = () => {
  return (
    <div className=" bg-gray-50">
      <LandingHeader />
      <Hero />
      <Features />
      <CTA />
      <AboutWithVideo />
      <AboutUs />
      <CoreGoals />
      <SiteFooter />
    </div>
  );
};

export default Promotion;
