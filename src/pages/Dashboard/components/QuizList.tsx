import { EditOutlined, SearchOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Button, Input, Select, Tag, Spin, Card, Skeleton, Empty } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { dashboardService, ExamSummary } from "../services/dashboardService";
import boxFill from "../../../assets/icons/dashboard/3d_box_fill.png";
import type { GetProps } from "antd";

type SearchProps = GetProps<typeof Input.Search>;

const QuizList = () => {
  const { Search } = Input;
  const { Option } = Select;
  const navigate = useNavigate();

  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getAllExams(0, 50);
        setExams(response.exams);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSubject =
      selectedSubject === "all" ||
      exam.subject?.toLowerCase().includes(selectedSubject.toLowerCase());
    return matchesSearch && matchesSubject;
  });

  const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
    console.log(info?.source, value);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <h4 className="text-[18px] !font-extrabold">Danh sách các quiz</h4>
            <p className="text-sm text-gray-600">Danh sách các bài luyện tập trên hệ thống</p>
          </div>
          <Button type="link" className="text-blue-500" onClick={() => navigate("/quiz")}>
            Xem tất cả <ArrowRightOutlined />
          </Button>
        </div>

        <div className="flex gap-4">
          <Search
            placeholder="Tìm kiếm"
            onSearch={onSearch}
            value={searchTerm}
            enterButton
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={selectedSubject} onChange={setSelectedSubject} style={{ width: 160 }}>
            <Option value="all">Tất cả</Option>
            <Option value="toán">Toán học</Option>
            <Option value="vật lý">Vật lý</Option>
            <Option value="hóa học">Hóa học</Option>
          </Select>
        </div>

        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="rounded-xl border-gray-200">
                  <Skeleton active paragraph={{ rows: 2 }} />
                </Card>
              ))}
            </div>
          ) : filteredExams.length === 0 ? (
            <Empty description="Chưa có đề thi nào" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExams.map((exam) => {
                const color = exam.level === "Easy" ? "green" : exam.level === "Medium" ? "orange" : "red";
                return (
                  <Card
                    key={exam.id}
                    className="rounded-xl border-gray-200 hover:shadow-sm transition-shadow"
                    title={
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">{exam.title}</span>
                        <Tag color={color}>{exam.level}</Tag>
                      </div>
                    }
                    extra={<span className="text-xs text-gray-600">{exam.date}</span>}
                  >
                    <div className="text-sm text-gray-700 flex items-center justify-between">
                      <div>
                        <div className="mb-1">Môn học: <span className="text-blue-600 font-medium">{exam.subject}</span></div>
                        <div>{exam.questions} câu hỏi</div>
                      </div>
                      <Button
                        type="primary"
                        size="small"
                        className="!bg-[#4CAF50] !rounded-md"
                        onClick={() => navigate(`/quiz/takeQuiz/exam/${exam.id}`)}
                      >
                        Làm
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuizList;
