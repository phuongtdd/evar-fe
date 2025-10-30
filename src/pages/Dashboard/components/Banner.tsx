import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Book3d from "../../../assets/icons/dashboard/Book3D.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { dashboardService, DashboardStats } from "../services/dashboardService";

const Banner = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalExams: 0,
    totalQuestions: 0,
    totalStudyTime: 0,
    averageScore: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardStats = await dashboardService.getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
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
            <span>Thời gian đã học: {formatStudyTime(stats.totalStudyTime)}</span>
            <span>Quiz đã tạo: {stats.totalExams}</span>
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
              className="!bg-blue-400 text-white !border-none"
              onClick={() => navigate("/createExam-AI")}
            >
              Tạo Đề Thi với AI
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
