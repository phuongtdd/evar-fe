import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "../pages/Common/MainLayout";
import Dashboard from "../pages/Dashboard";
import Promotion from "../pages/Promotion";
import Room from "../pages/Room";
import NotFound from "../pages/404";
import RoomUI from "../pages/Room/components/RoomUI";

import Chatmodule from "../pages/RealTimeChat";
import AuthPage from "../pages/authen";
import UserProfile from "../pages/userProfile";
import CreateQuiz from "../pages/createQuiz-AI";
import QuizCreated from "../pages/createQuiz-AI/components/layout/QuizCreated";
import { message } from "antd";
import SavedQuizSuccess from "../pages/createQuiz-AI/components/layout/SavedQuizSuccess";
import CreateExamManual from "../pages/createExam-Manual";
import TakeQuizExam from "../pages/takeQuiz-Exam";
import QuizDashboardLayout from "../pages/Quiz";
import SubmitSuccess from "../pages/takeQuiz-Exam/components/layout/SubmitSuccess";
import SubjectModule from "../pages/Subject";

interface NotifyMessageProps {
  showMessage: (type: "success" | "error" | "warning", content: string) => void;
}

const AppRoutes: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const showMessage: NotifyMessageProps["showMessage"] = (type, content) => {
    const localizedContent = {
      success: `Thành công ! ${content}`,
      error: `Lỗi ! ${content}`,
      warning: `Cảnh báo ! ${content}`,
    }[type];
    messageApi.open({ type, content: localizedContent });
  };
  return (
    <>
      {contextHolder}
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

          <Route path="/quiz">
            <Route index element={<QuizDashboardLayout />} />

            <Route path="create">
              <Route path="create-manual" element={<CreateExamManual />} />
              <Route path="create-AI" element={<CreateQuiz />} />
            </Route>

            <Route path="takeQuiz">
              <Route path="practice" element={<>in develop</>} />
              <Route path="exam/:examId" element={<TakeQuizExam />} />
              <Route path="exam" element={<TakeQuizExam />} />
              <Route path="submit-success" element={<SubmitSuccess />} />
            </Route>
          </Route>
          {/* <Route path="/test" element={<QuizExamStep />} /> */}
          <Route path="/chat" element={<Chatmodule />} />
          <Route path="/account" element={<UserProfile />} />

          <Route path="/createQuiz-AI" element={<CreateQuiz />}>
            <Route index element={<div />} />
            <Route path="result" element={<QuizCreated />} />
          </Route>
          <Route
            path="/createQuiz-AI/savedSuccess"
            element={<SavedQuizSuccess showMessage={showMessage} />}
          />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/promotion" element={<Promotion />} />
        <Route path="/subject" element={<SubjectModule />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
