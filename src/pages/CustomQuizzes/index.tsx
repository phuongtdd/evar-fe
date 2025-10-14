import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Thêm dòng này
import { Button, Card, Input, Table, Tag, Upload, message } from "antd";
import { ArrowLeftOutlined, SaveOutlined, DeleteOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import SaveConfirmModal from "./components/SaveConfirmModal";

const quizInfo = {
  title: "Đề thi quốc gia môn Toán",
  subject: "Toán",
  numQuestions: 50,
  creator: "Admin",
  date: "20/12/2024",
  grade: "12",
};

const defaultQuestion = {
  content: "Cho hàm số \( y = f(x) \) liên tục, nhận giá trị dương trên đoạn \( [a; b] \). Xét hình phẳng \( H \) giới hạn bởi đồ thị hàm số \( y = f(x) \), trục hoành và hai đường thẳng \( x = a, x = b \). Khối tròn xoay được tạo thành khi quay hình phẳng \( H \) quanh trục \( Ox \) có thể tích là:",
  options: [
    "A. \( V = \pi\int_{a}^{b} f(x)^2 dx \)",
    "B. \( V = \pi\int_{a}^{b} f(x) dx \)",
    "C. \( V = \pi\int_{a}^{b} f(x)^2 dx \)",
    "D. \( V = \pi\int_{a}^{b} f(x) dx \)",
  ],
  image: "",
};

export default function CustomQuizManual() {
  const [questions, setQuestions] = useState([
    { ...defaultQuestion },
    { ...defaultQuestion, image: "/images/math.png" },
    { ...defaultQuestion, image: "/images/math.png" },
  ]);
  const [newQuestion, setNewQuestion] = useState({ ...defaultQuestion, image: "" });
  const [showSaveModal, setShowSaveModal] = useState(false);

  const navigate = useNavigate(); // Thêm dòng này

  // Xử lý upload ảnh (demo)
  const handleUpload = (file: any, idx?: number) => {
    message.success("Đã upload ảnh (demo)");
    if (typeof idx === "number") {
      const updated = [...questions];
      updated[idx].image = "/images/math.png";
      setQuestions(updated);
    } else {
      setNewQuestion({ ...newQuestion, image: "/images/math.png" });
    }
    return false;
  };

  // Xử lý thêm câu hỏi
  const handleAddQuestion = () => {
    setQuestions([...questions, { ...newQuestion }]);
    setNewQuestion({ ...defaultQuestion, image: "" });
  };

  // Xử lý xóa câu hỏi
  const handleDeleteQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  return (
    <div className="bg-[#f7f8fa] min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            icon={<ArrowLeftOutlined />}
            className="font-semibold"
            onClick={() => navigate("/create-quiz")}
          >
            Về trang quản lí
          </Button>
          <span className="text-xl font-bold ml-4">Tạo Quiz thủ công</span>
        </div>
        <div className="flex gap-3">
          <Button type="primary" danger>
            Đóng tạo
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            className="bg-blue-500 font-semibold"
            onClick={() => setShowSaveModal(true)}
          >
            Lưu bài quiz
          </Button>
        </div>
      </div>

      <div className="flex gap-6 mb-8">
        <Card className="w-80">
          <div className="font-semibold mb-2">Tên Quiz:</div>
          <div className="mb-2">{quizInfo.title}</div>
          <div className="font-semibold mb-2">Môn học:</div>
          <div className="mb-2">{quizInfo.subject}</div>
          <div className="font-semibold mb-2">Số câu hỏi:</div>
          <div className="mb-2">{quizInfo.numQuestions}</div>
          <div className="font-semibold mb-2">Người tạo:</div>
          <div className="mb-2">{quizInfo.creator}</div>
          <div className="font-semibold mb-2">Ngày tạo:</div>
          <div className="mb-2">{quizInfo.date}</div>
          <div className="font-semibold mb-2">Lớp:</div>
          <div className="mb-2">{quizInfo.grade}</div>
          <Button type="primary" className="bg-blue-500 mt-4 w-full">Xem</Button>
        </Card>

        <div className="flex-1">
          {/* Thêm câu hỏi mới */}
          <Card className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Câu hỏi số: <Tag color="blue">1</Tag></span>
              <span className="font-semibold">Nội dung</span>
            </div>
            <div className="mb-2">
              <Input.TextArea
                rows={3}
                value={newQuestion.content}
                onChange={e => setNewQuestion({ ...newQuestion, content: e.target.value })}
              />
            </div>
            <Table
              dataSource={newQuestion.options.map((opt, i) => ({
                key: i,
                option: String.fromCharCode(65 + i),
                text: opt,
              }))}
              columns={[
                { title: "", dataIndex: "option", key: "option", width: 40 },
                { title: "", dataIndex: "text", key: "text" },
                {
                  title: "Hình ảnh",
                  key: "image",
                  render: () => (
                    <Upload
                      showUploadList={false}
                      beforeUpload={file => handleUpload(file)}
                    >
                      {newQuestion.image ? (
                        <img src={newQuestion.image} alt="img" className="w-16 h-16 object-contain" />
                      ) : (
                        <Button icon={<UploadOutlined />}>Nhấn để thêm lên</Button>
                      )}
                    </Upload>
                  ),
                },
              ]}
              pagination={false}
              size="small"
            />
            <div className="flex justify-end mt-4">
              <Button type="primary" icon={<PlusOutlined />} className="bg-blue-500" onClick={handleAddQuestion}>
                Thêm
              </Button>
            </div>
          </Card>

          {/* Danh sách câu hỏi đã thêm */}
          {questions.map((q, idx) => (
            <Card className="mb-6" key={idx}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Câu hỏi số: <Tag color="blue">{idx + 1}</Tag></span>
                <div className="flex gap-2">
                  <Button icon={<SaveOutlined />} className="bg-blue-500" />
                  <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteQuestion(idx)} />
                </div>
              </div>
              <div className="mb-2">{q.content}</div>
              <Table
                dataSource={q.options.map((opt, i) => ({
                  key: i,
                  option: String.fromCharCode(65 + i),
                  text: opt,
                }))}
                columns={[
                  { title: "", dataIndex: "option", key: "option", width: 40 },
                  { title: "", dataIndex: "text", key: "text" },
                  {
                    title: "Hình ảnh",
                    key: "image",
                    render: () => (
                      <Upload
                        showUploadList={false}
                        beforeUpload={file => handleUpload(file, idx)}
                      >
                        {q.image ? (
                          <img src={q.image} alt="img" className="w-16 h-16 object-contain" />
                        ) : (
                          <Button icon={<UploadOutlined />}>Nhấn để thêm lên</Button>
                        )}
                      </Upload>
                    ),
                  },
                ]}
                pagination={false}
                size="small"
              />
            </Card>
          ))}
        </div>
      </div>

      <SaveConfirmModal
        open={showSaveModal}
        onCancel={() => setShowSaveModal(false)}
        onSave={() => {
          setShowSaveModal(false);
          // Xử lý lưu quiz ở đây
        }}
      />
    </div>
  );
}