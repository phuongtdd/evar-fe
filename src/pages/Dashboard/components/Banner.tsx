import { PlusOutlined } from "@ant-design/icons";
import { Button, Spin } from "antd";
import Book3d from "../../../assets/icons/dashboard/Book3D.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { dashboardService } from "../services/dashboardService";
import { fetchUserSubmissions, SubmissionResponse } from "../../Quiz/services/submissionService";
import { getUserIdFromToken } from "../../Room/utils/auth";

const Banner = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [totalExams, setTotalExams] = useState<number>(0);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [totalStudyTime, setTotalStudyTime] = useState<number>(0);
  const [averageScore, setAverageScore] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const userId = getUserIdFromToken();
        const [{ exams }, submissions] = await Promise.all([
          dashboardService.getAllExams(0, 200),
          userId ? fetchUserSubmissions(userId) : Promise.resolve([] as SubmissionResponse[]),
        ]);
        const questions = exams.reduce((sum, exam) => sum + exam.questions, 0);
        setTotalExams(exams.length);
        setTotalQuestions(questions);
        if (submissions && submissions.length > 0) {
          const totalTime = submissions.reduce((acc, s) => acc + (s.timeTry || 0), 0);
          const avg = submissions.reduce((acc, s) => acc + (s.totalScore || 0), 0) / submissions.length;
          setTotalStudyTime(totalTime);
          setAverageScore(Number.isFinite(avg) ? Math.round(avg) : 0);
        } else {
          setTotalStudyTime(0);
          setAverageScore(0);
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins}p`;
  };

  return (
    <div>
      {" "}
      <div className="bg-[#406AB9] text-white mb-[120px] rounded-2xl border-none p-10 ">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-[20px] opacity-90 mb-2">Thứ 6, 20/12/2025</p>
            <h1 className="text-[48px] font-semibold mb-2">
              Một ngày một bước, tri thức vững chắc.
            </h1>
            <p className="text-[16px] opacity-90 mb-4">
              Sẵn sàng chinh phục cùng nhau chưa, Đạt?
            </p>
          </div>
          <img src={Book3d} alt="book src"></img>
        </div>
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-6 text-[16px]">
            <span>
              Thời gian đã học: {loading ? <Spin size="small" /> : formatStudyTime(totalStudyTime)}
            </span>
            <span>
              Quiz đã tạo: {loading ? <Spin size="small" /> : totalExams}
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              type="default"
              icon={<PlusOutlined />}
              className="bg-white border-none"
              onClick={() => navigate("/room")}
            >
              Tạo phòng
            </Button>
            <Button
              type="default"
              className="!bg-[#3B82F6] text-white !border-none"
              onClick={() => navigate("/createExam-AI")}
            >
              Tạo Đề Thi với AI
            </Button>
            <div className="hidden md:flex items-center gap-4 text-[16px]">
              <span>Điểm TB: {loading ? <Spin size="small" /> : `${averageScore}%`}</span>
              <span>Tổng câu hỏi: {loading ? <Spin size="small" /> : totalQuestions}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
