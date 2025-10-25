"use client";

import { useState, ReactNode, useEffect } from "react";
import { Button as AntButton, Button, Form, message } from "antd";
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  CloseOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuizContext } from "./context/QuizContext";
import QuizInfor from "./components/ui/QuizInfor";
import { QuizInfo, CreateQuizRequest, typeQuiz } from "./types";
import QuizInfoModal from "./components/ui/QuizInfoModal";
import { sampleQuestions } from "./mock/mockData";
import UploadDragger from "./components/ui/UploadDragger";
import BackButton from "../Common/BackButton";
import { createQuizAIService } from "./services/quizService";
import { subjectService } from "../Subject/services/subjectService";
import { Subject } from "./types";

interface LayoutProps {
  children?: ReactNode;
}

export default function CreateQuizLayout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const {
    fileUploaded,
    setFileUploaded,
    uploadedFile,
    setUploadedFile,
    setResults,
    quizInfo,
    setQuizInfo,
    isQuizInfoModalVisible,
    setIsQuizInfoModalVisible,
    results,
  } = useQuizContext();

  const [isCreating, setIsCreating] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [quizData, setQuizData] = useState<typeQuiz>({
    name: "",
    subject: "",
    questionCount: 0,
    creator: "",
    duration: "02:00:00",
    grade: "",
  });

  useEffect(() => {
    if (!quizInfo) {
      setIsQuizInfoModalVisible(true);
    }
  }, [quizInfo, setIsQuizInfoModalVisible]);

  // Fetch subjects when component mounts
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { subjects: fetchedSubjects } = await subjectService.getAllSubjects();
        setSubjects(fetchedSubjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);

  const handleStartProcess = () => {
    setFileUploaded(true);
    setUploadedFile({
      name: "Mock Quiz Data",
      size: "Generated",
    });
    setResults(sampleQuestions);
    navigate("/createQuiz-AI/result");
  };

  const handleRemoveFile = () => {
    setFileUploaded(false);
    setUploadedFile({ name: "", size: "" });
    setResults([]);
  };

  const handleEditQuizInfo = (updatedQuiz: any) => {
    setQuizData(updatedQuiz);
    // Update quizInfo if needed, but since QuizInfor is for display, maybe not necessary
  };

  const handleCreateQuiz = async () => {
    if (!quizInfo) {
      message.error("Vui lòng nhập thông tin quiz");
      return;
    }

    if (results.length === 0) {
      message.error("Vui lòng tạo ít nhất một câu hỏi");
      return;
    }

    setIsCreating(true);
    try {
      const quizData: CreateQuizRequest = {
        examName: quizInfo.examName,
        examType: quizInfo.examType || 2,
        subjectId: parseInt(quizInfo.subjectId),
        description: quizInfo.description,
        numOfQuestions: results.length,
        questions: results.map((q) => ({
          questionImg: q.questionImg,
          content: q.content,
          questionType: q.questionType,
          hardLevel: q.hardLevel,
          quesScore: q.quesScore || 1.0,
          answers: q.answers.map((a) => ({
            isCorrect: a.isCorrect,
            content: a.content,
          })),
        })),
      };

      const result = await createQuizAIService.createQuiz(quizData);
      message.success("Tạo quiz thành công!");
      console.log("Quiz created:", result);
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo quiz");
      console.error("Error creating quiz:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleModalOk = (values: QuizInfo) => {
    setQuizInfo(values);
    const selectedSubject = subjects.find((s) => s.id === values.subjectId);
    setQuizData({
      name: values.examName || "",
      subject: selectedSubject?.subject_name || values.subjectId || "",
      questionCount: 0,
      creator: values.description || "",
      duration: values.time || "02:00:00",
      grade: values.grade || "",
    });
    // The modal will set its own visibility to false; ensure our local view switches as well
    setVisible(false);
  };

  const handleModalCancel = () => {
    message.error("Không thể tạo Quiz");
   window.history.back()
  };

  const [visible, setVisible] = useState<boolean>(true);

  return (
    <>
      {visible ? (
        <>
          <QuizInfoModal
            visible={visible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            setVisible={setVisible}
            initialValues={quizInfo || undefined}
          />
        </>
      ) : (
        <>
          <div className="flex h-screen bg-gray-50 ">
            <div className="flex-1 flex flex-col">
              <main className="flex-1 overflow-auto p-8  [scrollbar-color:transparent_transparent] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb:hover]:bg-transparent">
                <div className="w-full">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Tạo Quiz với AI OCR
                  </h1>
                  <BackButton url={"/dashboard"} />
                  <p className="text-gray-600 mb-8 mt-5">
                    Sử dụng AI để tăng tốc quá trình tạo Quiz từ file pdf, ảnh
                    png...
                  </p>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <QuizInfor quiz={quizData} onEdit={handleEditQuizInfo} />
                    <UploadDragger
                      onProcess={handleStartProcess}
                      onRemove={handleRemoveFile}
                    />
                  </div>

                  {fileUploaded && results.length > 0 && (
                    <div className="mb-6">
                      <Button
                        type="primary"
                        size="large"
                        icon={<SaveOutlined />}
                        onClick={handleCreateQuiz}
                        loading={isCreating}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Lưu Quiz
                      </Button>
                    </div>
                  )}

                  <Outlet />
                  {children}
                </div>
              </main>
            </div>
          </div>
        </>
      )}
    </>
  );
}
