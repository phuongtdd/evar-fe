import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "../pages/Common/MainLayout";
import Dashboard from "../pages/Dashboard";
import Promotion from "../pages/Promotion";
import Room from "../pages/Room";
import NotFound from "../pages/404";
import RoomUI from "../pages/Room/components/RoomUI";
import QuizzManagement from "../pages/QuizzManagement";
import CustomQuizManual from "../pages/CustomQuizzes";

import Chatmodule from "../pages/RealTimeChat";
import AuthPage from "../pages/authen";
import UserProfile from "../pages/userProfile";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />}>
        <Route path="login" element={<AuthPage />} />
        <Route path="register" element={<AuthPage />} />
      </Route>

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="room" element={<Room />} />
        <Route path="/study-room" element={<RoomUI />} />
        <Route path="/create-quiz" element={<QuizzManagement />} />
        <Route
          path="/create-quiz/custom-quizz"
          element={<CustomQuizManual />}
        />
        <Route path="/chat" element={<Chatmodule />} />
        <Route path="/account" element={<UserProfile />} />
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path="/promotion" element={<Promotion />} />
    </Routes>
  );
};

export default AppRoutes;
