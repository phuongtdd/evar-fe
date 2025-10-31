import React, { useEffect, useMemo, useState } from "react";
import { Card, Button, Calendar, Spin } from "antd";
import { useNavigate } from "react-router-dom";

import Banner from "./components/Banner";
import RoomSection from "./components/RoomSection";
import QuizList from "./components/QuizList";
import { dashboardService } from "./services/dashboardService";
import { fetchUserSubmissions, SubmissionResponse } from "../Quiz/services/submissionService";
import { getUserIdFromToken } from "../Room/utils/auth";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const userId = getUserIdFromToken();
        const [{ exams: examList }, userSubs] = await Promise.all([
          dashboardService.getAllExams(0, 12),
          userId ? fetchUserSubmissions(userId) : Promise.resolve([] as SubmissionResponse[]),
        ]);
        setExams(examList);
        setSubmissions(userSubs);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const recentActivity = useMemo(() => {
    const createdExams = exams
      .slice(0, 5)
      .map(e => ({
        type: "exam" as const,
        title: e.title,
        meta: e.subject ?? "",
        time: e.date,
      }));
    const userSubs = (submissions || []).slice(0, 5).map(s => ({
      type: "submission" as const,
      title: s.examName,
      meta: `${s.totalScore}%`,
      time: s.submittedAt ? new Date(s.submittedAt).toLocaleString("vi-VN") : "",
    }));
    return [...userSubs, ...createdExams].slice(0, 6);
  }, [exams, submissions]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 md:p-8">
        <Banner />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Bắt đầu nhanh</h3>
                  <p className="text-sm text-gray-500">Thao tác phổ biến được truy cập nhanh</p>
                </div>
                <div className="flex gap-3">
                  <Button type="primary" className="!bg-[#4CAF50] !rounded-lg" onClick={() => navigate("/quiz")}>
                    Luyện đề
                  </Button>
                  <Button className="!rounded-lg" onClick={() => navigate("/createExam-AI")}>Tạo đề thi AI</Button>
                  <Button className="!rounded-lg" onClick={() => navigate("/room")}>Phòng học</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <QuickAction title="Luyện đề gần đây" desc="Tiếp tục bài đang làm" onClick={() => navigate("/quiz")} />
                <QuickAction title="Tạo đề nhanh" desc="Nhập PDF/Ảnh" onClick={() => navigate("/createExam-AI")} />
                <QuickAction title="Tham gia phòng" desc="Học cùng nhóm" onClick={() => navigate("/room")} />
              </div>
            </Card>

            <RoomSection />
            <QuizList />
          </div>

          <div className="space-y-6">
            <Card className="rounded-2xl border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Lịch</h3>
              <Calendar fullscreen={false} />
            </Card>

            <Card className="rounded-2xl border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">Hoạt động gần đây</h3>
                {loading && <Spin size="small" />}
              </div>
              {recentActivity.length === 0 ? (
                <div className="text-gray-500">Chưa có hoạt động nào</div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentActivity.map((item, idx) => (
                    <li key={idx} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.type === "submission" ? "Bài làm" : "Đề thi"} • {item.meta}</div>
                      </div>
                      <div className="text-xs text-gray-500">{item.time}</div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="rounded-2xl border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Gợi ý tiếp theo</h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                <li>Ôn lại đề thi có điểm thấp để cải thiện</li>
                <li>Tham gia phòng học Toán lúc 20:00</li>
                <li>Tạo đề mới từ tài liệu PDF của bạn</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

function QuickAction({ title, desc, onClick }: { title: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-4 border border-gray-200">
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <div className="text-xs text-gray-600">{desc}</div>
    </button>
  );
}
