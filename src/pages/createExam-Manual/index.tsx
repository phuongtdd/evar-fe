import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuizDetailsPanel from "./components/ui/QuizDetailsPanel";
import { Button, Space, message, Modal, Form, Input, TimePicker, Select, Spin } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import QuestionCard from "./components/ui/QuestionCard";
import { Question, CreateExamRequest } from "./types";
import InputQuestionCard from "./components/ui/InputQuestionCard";
import { createExamService } from "./services/examService";
import { subjectService } from "../Subject/services/subjectService";
import type { Subject } from "../Subject/types";
import dayjs from 'dayjs';
import { getUsernameFromToken } from "../../pages/Room/utils/auth";

const CreateExamManual = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [form] = Form.useForm();

  const [quizInfo, setQuizInfo] = useState(location.state?.quizInfo);

  useEffect(() => {
    console.log('Location state:', location.state);
    console.log('QuizInfo received:', quizInfo);
    if (!quizInfo) {
      message.warning("Vui lòng nhập thông tin bài quiz trước");
      navigate("/admin/manage-exam");
    }
  }, [quizInfo, navigate]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true);
        const { subjects: fetchedSubjects } = await subjectService.getAllSubjects();
        setSubjects(fetchedSubjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        message.error('Không thể tải danh sách môn học');
      } finally {
        setSubjectsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleEditQuizInfo = () => {
    setIsEditModalVisible(true);
    const currentUser = getUsernameFromToken() || "Admin";
    form.setFieldsValue({
      title: quizInfo?.title,
      subjectId: quizInfo?.subjectId,
      description: currentUser,
      grade: quizInfo?.grade,
      time: quizInfo?.time ? dayjs(quizInfo.time, 'HH:mm:ss') : dayjs('02:00:00', 'HH:mm:ss')
    });
  };

  const handleEditModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        const selectedSubject = subjects.find(s => s.id === values.subjectId);
        const updatedValues = {
          ...quizInfo,
          title: values.title,
          subject: selectedSubject?.subject_name || quizInfo?.subject,
          subjectId: values.subjectId,
          grade: values.grade,
          time: values.time ? values.time.format('HH:mm:ss') : quizInfo?.time
        };
        setQuizInfo(updatedValues);
        setIsEditModalVisible(false);
        message.success("Cập nhật thông tin bài quiz thành công!");
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    form.resetFields();
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleCreateExam = async () => {
    if (!quizInfo) {
      message.error("Thiếu thông tin bài quiz");
      return;
    }

    if (questions.length === 0) {
      message.error("Vui lòng thêm ít nhất một câu hỏi");
      return;
    }

    setIsCreating(true);
    try {
      // Convert time from "HH:mm:ss" format to minutes
      const convertTimeToMinutes = (timeString: string): number => {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + (seconds > 0 ? 1 : 0); // Round up if there are seconds
        return Math.max(totalMinutes, 1); // Ensure minimum 1 minute
      };

      const examData: CreateExamRequest = {
        examName: quizInfo.title,
        examType: 1,
        subjectId: quizInfo.subjectId || "1f7e5f03-d326-488c-b471-ea4cbce3f651",
        description: quizInfo.description,
        numOfQuestions: questions.length,
        duration: quizInfo.time ? convertTimeToMinutes(quizInfo.time) : 120, // Default 2 hours (120 minutes) if no time specified
        questions: questions.map(q => ({
          questionImg: q.questionImg,
          content: q.content,
          questionType: q.questionType,
          hardLevel: q.hardLevel,
          quesScore: q.quesScore || 1.0, 
          answers: q.answers.map(a => ({
            isCorrect: a.isCorrect,
            content: a.content
          }))
        }))
      };

      const result = await createExamService.createExam(examData);
      message.success("Tạo đề thi thành công!");
      console.log("Exam created:", result);
      setTimeout(() => {
        navigate("/admin/manage-exam");
      }, 1500);
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo đề thi");
      console.error("Error creating exam:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div className="px-5 py-4">
        <div className="mb-8 flex flex-col">
          <h2 className="text-2xl font-bold text-gray-900">
            Tạo Quiz thủ công
          </h2>

          <div className="flex flex-row justify-between item-center">
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              className="bg-blue-500 hover:bg-blue-600 h-9"
              onClick={() => navigate("/admin/manage-exam")}
            >
              Về trong quản lí
            </Button>
            <Space size="middle">
              <Button
                danger
                className="h-9 px-6 font-medium"
                onClick={handleCreateExam}
                loading={isCreating}
                icon={<SaveOutlined />}
              >
                Lưu Đề Thi
              </Button>
              <Button
                type="primary"
                className="!bg-red-500 !hover:bg-blue-600 h-9 px-6 font-medium"
              >
              Xóa toàn bộ
              </Button>
            </Space>
          </div>
        </div>

        <div className="flex gap-8 mb-8">
          <div className="w-[30%]">
            <QuizDetailsPanel
              quizInfo={quizInfo}
              questionCount={questions.length}
              onEdit={handleEditQuizInfo}
            />
          </div>
          <div className="w-[70%]">
            <InputQuestionCard onAddQuestion={(question) => setQuestions([...questions, question])} />
          </div>
        </div>
        <div>
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onDelete={() => handleDeleteQuestion(question.id!)}
            />
          ))}
        </div>
      </div>

      <Modal
        title={<h2 style={{ fontWeight: 'bold', fontSize: '1.5rem', margin: 0 }}>Chỉnh sửa thông tin bài quiz</h2>}
        open={isEditModalVisible}
        onCancel={handleEditModalCancel}
        width={600}
        destroyOnClose
        footer={[
          <Button key="cancel" onClick={handleEditModalCancel} style={{ border: '1px solid #d9d9d9', color: '#595959', borderRadius: '6px', fontWeight: 500 }}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleEditModalOk}
            style={{ backgroundColor: '#6969ff', borderColor: '#6969ff', color: 'white', borderRadius: '6px', fontWeight: 500 }}
          >
            Lưu thay đổi
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          name="edit_quiz_form"
          style={{ padding: '10px 0' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '64% 1fr', gap: '24px', marginBottom: '16px' }}>
            <Form.Item
              name="title"
              label={<span style={{fontWeight: '500'}}>Tên bài quiz</span>}
              rules={[
                { required: true, message: "Nhập tên bài Quiz" },
              ]}
              style={{ margin: 0 }}
            >
              <Input placeholder="Nhập tên bài Quiz..." style={{ borderRadius: '4px' }} />
            </Form.Item>

            <Form.Item
              name="subjectId"
              label={<span style={{fontWeight: '500'}}>Môn học</span>}
              rules={[
                { required: true, message: "Chọn môn học" },
              ]}
              style={{ margin: 0 }}
            >
              <Select
                placeholder="Chọn môn học"
                loading={subjectsLoading}
                options={subjects.map(subject => ({
                  value: subject.id,
                  label: subject.subject_name
                }))}
                notFoundContent={subjectsLoading ? <Spin size="small" /> : "Không có môn học nào"}
                style={{ borderRadius: '4px' }}
              />
            </Form.Item>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '64% 1fr', gap: '24px', marginBottom: '16px' }}>
            <Form.Item
              name="description"
              label={<span style={{fontWeight: '500'}}>Người tạo</span>}
              rules={[
                { required: true, message: "Người tạo" },
              ]}
              style={{ margin: 0 }}
            >
              <Input placeholder="Admin" style={{ borderRadius: '4px' }} disabled />
            </Form.Item>

            <Form.Item
              name="grade"
              label={<span style={{fontWeight: '500'}}>Lớp</span>}
              rules={[
                { required: true, message: "Chọn lớp" },
              ]}
              style={{ margin: 0 }}
            >
              <Select
                placeholder="Chọn lớp"
                options={[
                  { value: "10", label: "Lớp 10" },
                  { value: "11", label: "Lớp 11" },
                  { value: "12", label: "Lớp 12" },
                ]}
                style={{ borderRadius: '4px' }}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="time"
            label={<span style={{fontWeight: '500'}}>Thời gian làm bài</span>}
            rules={[
              { required: true, message: "Chọn thời gian làm bài" },
            ]}
            style={{ margin: 0 }}
          >
            <TimePicker
              format="HH:mm:ss"
              placeholder="02:00:00"
              style={{ width: '100%', borderRadius: '4px' }}
              showNow={false}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateExamManual;
