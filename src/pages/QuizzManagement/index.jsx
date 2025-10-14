import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Select, Input, Card, Pagination, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SelectCreateMethodModal from "./components/SelectCreateMethodModal";
import CreateQuizModal from "./components/CreateQuizModal";

const quizzes = [
    {
        title: "Ôn tập toán 12 : Đề thi thpt quốc gia năm 2018",
        subject: "Toán",
        numQuestions: 50,
        duration: 120,
        date: "20/12/2024",
    },
    {
        title: "Ôn tập toán 12 : Đề thi thpt quốc gia năm 2018",
        subject: "Toán",
        numQuestions: 50,
        duration: 120,
        date: "20/12/2024",
    },
    {
        title: "Ôn tập toán 12 : Đề thi thpt quốc gia năm 2018",
        subject: "Toán",
        numQuestions: 50,
        duration: 120,
        date: "20/12/2024",
    },
    {
        title: "Ôn tập toán 12 : Đề thi thpt quốc gia năm 2018",
        subject: "Toán",
        numQuestions: 50,
        duration: 120,
        date: "20/12/2024",
    },
    {
        title: "Ôn tập toán 12 : Đề thi thpt quốc gia năm 2018",
        subject: "Toán",
        numQuestions: 50,
        duration: 120,
        date: "20/12/2024",
    },
];

const history = [
    {
        title: "Đề thi quốc gia môn Toán",
        result: "7/10",
        date: "20/11/2022",
        subject: "Toán",
        action: "Chi tiết | Thi lại",
    },
];

const quizColumns = [
    {
        title: "Tên bài thi",
        dataIndex: "title",
        key: "title",
        render: (text) => <span className="font-semibold">{text}</span>,
    },
    {
        title: "Môn",
        dataIndex: "subject",
        key: "subject",
        render: (subject) => <Tag color="blue">{subject}</Tag>,
    },
    {
        title: "Số câu hỏi",
        dataIndex: "numQuestions",
        key: "numQuestions",
    },
    {
        title: "Thời gian làm",
        dataIndex: "duration",
        key: "duration",
        render: (duration) => `${duration} phút`,
    },
    {
        title: "Ngày tạo",
        dataIndex: "date",
        key: "date",
    },
    {
        title: "",
        key: "action",
        render: () => (
            <Button type="primary" className="bg-green-500" size="small">
                Làm →
            </Button>
        ),
    },
];

const historyColumns = [
    {
        title: "Tên bài thi",
        dataIndex: "title",
        key: "title",
    },
    {
        title: "Kết quả",
        dataIndex: "result",
        key: "result",
    },
    {
        title: "Thời gian thi",
        dataIndex: "date",
        key: "date",
    },
    {
        title: "Môn",
        dataIndex: "subject",
        key: "subject",
        render: (subject) => <Tag color="blue">{subject}</Tag>,
    },
    {
        title: "Hành động",
        dataIndex: "action",
        key: "action",
        render: (action) => (
            <span>
                <Button type="link">Chi tiết</Button>
                <Button type="link">Thi lại</Button>
            </span>
        ),
    },
];

const subjects = [
    { label: "Tất cả", value: "all" },
    { label: "Toán", value: "toan" },
    { label: "Lý", value: "ly" },
];

export default function QuizzManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="p-8 bg-[#f7f8fa] min-h-screen">
      <h2 className="font-bold text-xl">Luyện tập</h2>
      <h4 className="font-bold mt-10 mb-6">Hoạt động gần đây :</h4>
      <div className="flex gap-6 mb-8">
        <Card className="flex-1" title="Best Scores by subject">
          {/* Thay bằng biểu đồ thực tế */}
          <div className="h-32 bg-blue-100 rounded-lg mt-3" />
        </Card>
        <Card className="flex-2" title="Quiz Activity">
          {/* Thay bằng biểu đồ thực tế */}
          <div className="h-32 bg-blue-100 rounded-lg mt-3" />
        </Card>
      </div>

      {/* Quizz đã tạo */}
      <h4 className="font-bold mt-10 mb-6">Học từ quiz đã tạo :</h4>
      <div className="flex gap-6 mb-8">
        <Card className="flex-3 w-full">
          <div className="flex items-center gap-3 mb-6">
            <Select
              options={subjects}
              defaultValue="all"
              className="w-32"
            />
            <Input.Search placeholder="Tìm kiếm" className="flex-1" />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="bg-blue-500"
              onClick={() => setShowCreateModal(true)}
            >
              Tạo Quiz
            </Button>
          </div>
          <Table
            dataSource={quizzes}
            columns={quizColumns}
            pagination={false}
            rowKey="title"
            className="mb-4"
          />
          <div className="flex justify-center mt-4">
            <Pagination total={50} pageSize={10} />
          </div>
        </Card>
        <Card className="flex-1">
          <div className="font-semibold">Số Quiz đã tạo</div>
          <div className="text-3xl font-bold text-blue-500 my-4">100 bài</div>
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 10 }).map((_, idx) => (
              <Tag color="blue" className="mb-1" key={idx}>
                Toán
              </Tag>
            ))}
          </div>
        </Card>
      </div>

      {/* Lịch sử làm bài */}
      <h4 className="font-bold mt-10 mb-6">Lịch sử làm bài :</h4>
      <Card className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Input.Search placeholder="Tìm kiếm" className="flex-1" />
        </div>
        <Table
          dataSource={history}
          columns={historyColumns}
          pagination={false}
          rowKey="title"
        />
      </Card>

      {/* Khám phá thêm */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Select
            options={[{ label: "Môn học", value: "all" }]}
            defaultValue="all"
            className="w-32"
          />
          <Input.Search placeholder="Tìm kiếm" className="flex-1" />
        </div>
        <Table
          dataSource={quizzes}
          columns={quizColumns}
          pagination={false}
          rowKey="title"
          className="mb-4"
        />
        <div className="flex justify-center mt-4">
          <Pagination total={50} pageSize={10} />
        </div>
      </Card>

      <CreateQuizModal
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        onNext={(values) => {
          setShowCreateModal(false);
          setShowSelectModal(true);
          // Bạn có thể lưu lại dữ liệu quiz nếu cần
        }}
      />

      <SelectCreateMethodModal
        open={showSelectModal}
        onCancel={() => setShowSelectModal(false)}
        onManual={() => {
          setShowSelectModal(false);
          navigate("/create-quiz/custom-quizz");
        }}
        onAI={() => {
          setShowSelectModal(false);
          // Xử lý tạo với AI OCR tiếp theo
        }}
      />
    </div>
  );
}