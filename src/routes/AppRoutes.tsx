import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "../pages/Common/MainLayout";
import Dashboard from "../pages/Dashboard";
import Promotion from "../pages/Promotion";
import Room from "../pages/Room";
import NotFound from "../pages/404";
import Login from "../pages/authen/login/login";
import Register from "../pages/authen/register/Register";
import RoomUI from "../pages/Room/components/RoomUI";
import QuizzManagement from "../pages/QuizzManagement";
import CustomQuizManual from "../pages/CustomQuizzes";



const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
        <Route path="room" element={<Room />} />
        <Route path="/study-room" element={<RoomUI />} />
        <Route path="/create-quiz" element={<QuizzManagement />} />
        <Route path="/create-quiz/custom-quizz" element={<CustomQuizManual />} />
      </Route>
      <Route path="/promotion" element={<Promotion />} />
    </Routes>
  );
};

export default AppRoutes;
