import React, { useEffect } from "react";
import { Card, Button, Input, Select, Badge, Calendar, Tag } from "antd";

import Banner from "./components/Banner";
import RoomSection from "./components/RoomSection";
import QuizList from "./components/QuizList";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <Banner />
        <RoomSection />
        <QuizList />
      </div>
    </div>
  );
};

export default Dashboard;
