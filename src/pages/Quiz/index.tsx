import { useEffect, useState } from "react";
import ExploreSection from "./components/layout/explore-section";
import HistorySection from "./components/layout/history-section";
import QuizList from "./components/layout/quiz-list";
import RecentActivity from "./components/layout/recent-activity";
import QuizInfoModal from "./components/ui/QuizInfoModal";
import SelectCreateMethodModal from "../Common/SelectCreateMethodModal";
import { useNavigate } from "react-router-dom";
import { Form } from "antd";
import { QuizInfo } from "./types";

const QuizDashboardLayout = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<QuizInfo>();
  
  const [isQuizInfoModalVisible, setIsQuizInfoModalVisible] = useState<boolean>(false);
  const [isSelectMethodModalVisible, setIsSelectMethodModalVisible] = useState<boolean>(false);
  const [quizInfo, setQuizInfo] = useState<QuizInfo | null>(null);

  const [quizData, setQuizData] = useState({
    name: "Đề thi thpt quốc gia môn Toán",
    subject: "Toán",
    questionCount: 50,
    creator: "Admin",
    duration: "00:90:00",
    grade: 12,
  });

  const handleCreateQuizClick = () => {
    setIsQuizInfoModalVisible(true);
  };

  const handleQuizInfoModalOk = (values: QuizInfo) => {
    setQuizInfo(values);
    setIsQuizInfoModalVisible(false);
    setIsSelectMethodModalVisible(true);
  };

  const handleQuizInfoModalCancel = () => {
    setIsQuizInfoModalVisible(false);
  };

  const handleSelectManualMode = () => {
    setIsSelectMethodModalVisible(false);
    navigate("/quiz/create/create-manual", { state: { quizInfo } });
  };

  const handleSelectAIMode = () => {
    setIsSelectMethodModalVisible(false);
    navigate("/quiz/create/create-AI");
  };

  const handleSelectMethodCancel = () => {
    setIsSelectMethodModalVisible(false);
  };

  return (
    <>
      <div className="p-6 flex flex-col gap-4">
        <RecentActivity />
        <QuizList onCreateQuizClick={handleCreateQuizClick} />
        <HistorySection />
        <ExploreSection />
      </div>
      <QuizInfoModal
        visible={isQuizInfoModalVisible}
        onOk={handleQuizInfoModalOk}
        onCancel={handleQuizInfoModalCancel}
        setVisible={setIsQuizInfoModalVisible}
      />
      <SelectCreateMethodModal
        open={isSelectMethodModalVisible}
        onManual={handleSelectManualMode}
        onAI={handleSelectAIMode}
        onCancel={handleSelectMethodCancel}
      />
    </>
  );
};

export default QuizDashboardLayout;
