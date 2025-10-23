import React, { useEffect } from "react";
import { Card, Button, Input, Select, Badge, Calendar, Tag } from "antd";

import Banner from "./components/Banner";
import RoomSection from "./components/RoomSection";
import QuizList from "./components/QuizList";
import { decodeJwt } from "../../utils/de-codeJWT";

const Dashboard: React.FC = () => {
  const showData = () => {
    console.log("dashboard");
    const token = localStorage.getItem("token");

    let payload = "";
    if (token != null) {
      payload = decodeJwt(token);
    }
    console.log(token);
    console.log("payload: ", JSON.stringify(payload, null, 2));

  };

  useEffect(() => {
    showData();
  }, []);

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
