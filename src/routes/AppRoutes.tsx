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
import CreateQuiz from "../pages/createExam-AI";
import QuizCreated from "../pages/createExam-AI/components/layout/QuizCreated";
import { message } from "antd";
import SavedQuizSuccess from "../pages/createExam-AI/components/layout/SavedQuizSuccess";
import CreateExamManual from "../pages/createExam-Manual";
import TakeQuizExam from "../pages/takeQuiz-Exam";
import QuizDashboardLayout from "../pages/Quiz";
import SubmitSuccess from "../pages/takeQuiz-Exam/components/layout/SubmitSuccess";
import SubjectModule from "../pages/Subject";
import CreateQuizManual from "../pages/createQuiz-manual";
import { ExamAdminPanel } from "../pages/ExamManage";
import AdminDashboard from "../pages/admin/index";
import ProtectedRoute from "./ProtectedRoute";
import PomodoroModule from "../pages/porodomo";
import EvarTutor from "../pages/EvarTurtor";
import ChatAI from "../pages/ChatAI";
import LearningResources from "../pages/LearningResources";
import Material from "../pages/Material";
import FlashCard from "../pages/FlashCard";
import About from "../pages/About";
import Help from "../pages/Help";

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
        <Route
          path="/auth"
          element={
            <ProtectedRoute access="public">
              <AuthPage />
            </ProtectedRoute>
          }
        >
          <Route path="login" element={<AuthPage />} />
          <Route path="register" element={<AuthPage />} />
        </Route>

        <Route
          path="/promotion"
          element={
            <ProtectedRoute access="public">
              <Promotion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute access="protected">
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="room" element={<Room />} />
          <Route path="/study-room" element={<RoomUI />} />

          <Route path="/quiz">
            <Route index element={<QuizDashboardLayout />} />

            <Route path="create">
              <Route path="create-manual" element={<CreateQuizManual />} />
              <Route path="create-AI" element={<CreateQuiz />} />
            </Route>

            <Route path="takeQuiz">
              <Route path="practice" element={<>in develop</>} />
              <Route path="exam/:examId" element={<TakeQuizExam />} />
              <Route path="exam" element={<TakeQuizExam />} />
              <Route path="submit-success" element={<SubmitSuccess />} />
            </Route>
          </Route>

          <Route path="/chat" element={<Chatmodule />} />
          <Route path="/chat-ai" element={<ChatAI />} />
          <Route path="/account" element={<UserProfile />} />
          <Route path="/pomodoro" element={<PomodoroModule />} />
          <Route path="/material" element={<Material />} />
          <Route path="/flashcard" element={<FlashCard />} />

          <Route path="/createExam-AI" element={<CreateQuiz />}>
            <Route index element={<div />} />
            <Route path="result" element={<QuizCreated />} />
          </Route>
          <Route
            path="/createExam-AI/savedSuccess"
            element={<SavedQuizSuccess showMessage={showMessage} />}
          />

          <Route path="/evar-turtor" element={<EvarTutor />} />
          <Route path="/learning-resources" element={<LearningResources />} />
          <Route path="/about" element={<About />} />
          <Route path="/help" element={<Help />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute access="admin">
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="manage-subject" element={<SubjectModule />} />
          <Route path="manage-exam" element={<ExamAdminPanel />} />
          <Route path="create-exam" element={<CreateExamManual />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
