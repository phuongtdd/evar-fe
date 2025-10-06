import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Calendar, Input, Select, Tag } from "antd";
import { mockQuizzes } from "../mock/mockData";
import dayjs from "dayjs";

const QuizList = () => {
  const { Search } = Input;
  const { Option } = Select;
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Danh sách các quiz
              </h2>
              <p className="text-sm text-gray-500">
                Danh sách các Quiz trận bổ thông
              </p>
            </div>
            <Button type="link" className="text-blue-500">
              Xem tất cả »
            </Button>
          </div>

          <div className="flex gap-4 mb-4">
            <Search
              placeholder="Tìm kiếm dễn bài quiz..."
              prefix={<SearchOutlined />}
              className="flex-1"
            />
            <Button
              icon={<SearchOutlined />}
              type="primary"
              className="bg-blue-500"
            />
            <Select defaultValue="math" style={{ width: 120 }}>
              <Option value="math">Toán học</Option>
              <Option value="physics">Vật lý</Option>
              <Option value="chemistry">Hóa học</Option>
            </Select>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            {mockQuizzes.map((quiz, index) => (
              <div
                key={quiz.id}
                className={`p-4 flex items-center justify-between ${
                  index !== mockQuizzes.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag color="green">{quiz.level}</Tag>
                    <span className="text-xs text-gray-500">
                      {quiz.questions} câu hỏi
                    </span>
                    <span className="text-xs text-gray-500">
                      🔥 {Math.floor(Math.random() * 100)}
                    </span>
                  </div>
                  <h4 className="font-medium text-gray-800">{quiz.title}</h4>
                  <p className="text-xs text-gray-500">Ngày tạo: {quiz.date}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    className="text-orange-500 border-orange-300"
                  />
                  <Button
                    icon={<EditOutlined />}
                    size="small"
                    className="text-blue-500 border-blue-300"
                  />
                  <Button type="primary" size="small" className="bg-green-500">
                    Học
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <Calendar fullscreen={false} defaultValue={dayjs()} />
            <div className="mt-4 space-y-2">
              <Button type="primary" block className="bg-blue-500">
                Số quỹ hiện tại: <strong>60</strong>
              </Button>
              <Button type="primary" block className="bg-green-500">
                Tạo Quiz 🎯
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizList;
