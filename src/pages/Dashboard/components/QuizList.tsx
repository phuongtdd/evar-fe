import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Calendar, Input, Select, Tag, Spin } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { dashboardService, ExamSummary } from "../services/dashboardService";

const QuizList = () => {
  const { Search } = Input;
  const { Option } = Select;
  const navigate = useNavigate();

  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getAllExams(0, 50);
        setExams(response.exams);
      } catch (error) {
        console.error('Error fetching exams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || exam.subject?.toLowerCase().includes(selectedSubject.toLowerCase());
    return matchesSearch && matchesSubject;
  });

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
              placeholder="Tìm kiếm đền bài quiz..."
              prefix={<SearchOutlined />}
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
              icon={<SearchOutlined />}
              type="primary"
              className="bg-blue-500"
            />
            <Select
              value={selectedSubject}
              onChange={setSelectedSubject}
              style={{ width: 120 }}
            >
              <Option value="all">Tất cả</Option>
              <Option value="toán">Toán học</Option>
              <Option value="vật lý">Vật lý</Option>
              <Option value="hóa học">Hóa học</Option>
            </Select>
          </div>

          <div className="bg-white rounded-xl border border-gray-200">
            {loading ? (
              <div className="p-8 text-center">
                <Spin size="large" />
                <p className="mt-2 text-gray-500">Đang tải danh sách đề thi...</p>
              </div>
            ) : filteredExams.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">Chưa có đề thi nào được tạo.</p>
                <Button
                  type="primary"
                  className="mt-4"
                  onClick={() => navigate('/quiz')}
                >
                  Tạo đề thi đầu tiên
                </Button>
              </div>
            ) : (
              filteredExams.map((exam, index) => (
                <div
                  key={exam.id}
                  className={`p-4 flex items-center justify-between ${
                    index !== filteredExams.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Tag color={exam.level === 'Easy' ? 'green' : exam.level === 'Medium' ? 'orange' : 'red'}>
                        {exam.level}
                      </Tag>
                      <span className="text-xs text-gray-500">
                        {exam.questions} câu hỏi
                      </span>
                      <span className="text-xs text-gray-500">
                        🔥 {Math.floor(Math.random() * 100)}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-800">{exam.title}</h4>
                    <p className="text-xs text-gray-500">Ngày tạo: {exam.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="primary"
                      size="small"
                      className="!bg-green-500 !px-3"
                      onClick={() => navigate(`/quiz/takeQuiz/exam/${exam.id}`)}
                    >
                      Làm
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div >
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <Calendar fullscreen={false} defaultValue={dayjs()} />
            <div className="mt-4 space-y-2 flex flex-col gap-3">
              <Button type="primary" block className="bg-blue-500">
                Số quỹ hiện tại: <strong>60</strong>
              </Button>
              <Button type="primary" block className="!bg-green-500">
                Tạo Quiz 🎯
              </Button>
              <Button
                type="primary"
                block
                className="!bg-purple-500"
                onClick={() => navigate(`/quiz/takeQuiz/exam/${filteredExams[0]?.id || '1'}`)}
              >
                Test Exam (Real Data) 📝
              </Button>
              <Button 
                type="primary" 
                block 
                className="!bg-orange-500"
                onClick={() => navigate('/quiz/takeQuiz/submit-success')}
              >
                Test Submit Success ✅
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizList;
