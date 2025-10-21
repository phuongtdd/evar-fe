import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Calendar, Input, Select, Tag, Spin } from "antd";
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
      <div className="flex flex-row gap-6">
        <div className="flex-1">
          <div className="flex place-items-end justify-between mb-2">
            <div>
              <h4 className="text-[18px] !font-extrabold">
                Danh sách các quiz
              </h4>
              <p className="text-sm text-gray-500">
                Danh sách các bài luyện tập trên hệ thống
              </p>
            </div>
            <Button type="link" className="text-blue-500">
              Xem tất cả »
            </Button>
          </div>

          <div className="flex gap-4 mb-4">
            <Search
              placeholder="Tìm kiếm"
              onSearch={onSearch}
              value={searchTerm}
              enterButton
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
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
                <p className="mt-2 text-gray-500">
                  Đang tải danh sách đề thi...
                </p>
              </div>
            ) : filteredExams.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">Chưa có đề thi nào được tạo.</p>
                <Button
                  type="primary"
                  className="mt-4"
                  onClick={() => navigate("/quiz")}
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
                  <div className="flex-1 flex flex-col gap-2">
                    <div>
                      <div className="flex flex-row w-full justify-between items-center gap-4 mb-1">
                        <span>
                          Độ Khó:{" "}
                          <Tag
                            color={
                              exam.level === "Easy"
                                ? "green"
                                : exam.level === "Medium"
                                ? "orange"
                                : "red"
                            }
                            style={{ marginLeft: "12px" }}
                          >
                            {exam.level}
                          </Tag>
                        </span>
                        <span className="text-[14px] text-gray-500">
                          🔥
                          {exam.questions} câu hỏi
                        </span>
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-800">{exam.title}</h4>
                    <span className="text-[14px] text-gray-500">
                      Ngày tạo:{" "}
                      <span className="text-blue-500 font-bold">
                        {exam.date}
                      </span>
                    </span>

                    <div className="flex flex-row items-center justify-between ">
                      <span className="text-[14px] text-gray-500">
                        Môn học:{" "}
                        <span className="text-blue-500 font-bold">
                          {exam.subject}
                        </span>
                      </span>
                      <Button
                        type="primary"
                        size="small"
                        className="!bg-[#4CAF50] !px-6 !py-4 !rounded-[8px]"
                        onClick={() =>
                          navigate(`/quiz/takeQuiz/exam/${exam.id}`)
                        }
                      >
                        Làm
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-[26%] my-[140px]">
          <div className="bg-white rounded-xl border border-gray-200 p-2">
            <Calendar fullscreen={false} defaultValue={dayjs()} />
          </div>
          <div className="mt-4 space-y-2 flex flex-col gap-3">
            <div className="bg-[#6392E9] rounded-[12px] !py-6 w-full !px-9 flex flex-row item-center justify-between text-white">
              <span className="font-bold">Tổng bài làm:</span>
              <strong className="font-bold">60</strong>
            </div>
            <Button
              type="primary"
              block
              className="!bg-[#4CAF50] !w-[50%] !rounded-[12px] !py-6 w-full !px-9 flex flex-row item-center justify-between text-white !font-bold text-[18px]"
            >
              Tạo Đề thi
              <img src={boxFill} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizList;
