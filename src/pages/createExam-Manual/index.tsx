import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import QuizDetailsPanel from "./components/ui/QuizDetailsPanel";
import { Button, Card, Space, message, Modal, Form, Input, TimePicker } from "antd";
import { ArrowLeftOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import QuestionCard from "./components/ui/QuestionCard";
import { Question, CreateExamRequest } from "./types";
import InputQuestionCard from "./components/ui/InputQuestionCard";
import { createExamService } from "./services/examService";
import DropdownSelect from "../Quiz/components/ui/DropdownSelect";
import { subjects, grades } from "../Quiz/mock/mockData";
import dayjs from 'dayjs';
import { getUsernameFromToken } from "../../pages/Room/utils/auth";

const CreateExamManual = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();


  const [quizInfo, setQuizInfo] = useState(location.state?.quizInfo);

  useEffect(() => {
    if (!quizInfo) {
      message.warning("Vui lòng nhập thông tin bài quiz trước");
      navigate("/quiz");
    }
  }, [quizInfo, navigate]);

  const handleEditQuizInfo = () => {
    setIsEditModalVisible(true);
    const currentUser = getUsernameFromToken() || "Admin";
    form.setFieldsValue({
      ...quizInfo,
      description: currentUser,
      time: quizInfo?.time ? dayjs(quizInfo.time, 'HH:mm:ss') : dayjs('02:00:00', 'HH:mm:ss')
    });
  };

  const handleEditModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        const updatedValues = {
          ...values,
          time: values.time ? values.time.format('HH:mm:ss') : '02:00:00'
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
      const examData: CreateExamRequest = {
        examName: quizInfo.title,
        examType: 1,
        subjectId: "1f7e5f03-d326-488c-b471-ea4cbce3f651",
        description: quizInfo.description,
        numOfQuestions: questions.length,
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
        navigate("/quiz");
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
              name="subject"
              label={<span style={{fontWeight: '500'}}>Môn học</span>}
              rules={[
                { required: true, message: "Chọn môn học" },
              ]}
              style={{ margin: 0 }}
            >
              <DropdownSelect data={subjects} placeholder="Toán" />
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
              <DropdownSelect data={grades} placeholder="12" />
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
