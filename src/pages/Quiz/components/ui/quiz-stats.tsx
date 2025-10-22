import { Button, Card, Divider, Tag } from "antd";
import { useEffect, useState } from "react";
import { fetchExams, ExamResponse } from "../../services/examService";
import { FilterOutlined } from "@ant-design/icons";

interface StatItem {
  label: string;
  count: number;
}

export default function QuizStats() {
  const [totalExams, setTotalExams] = useState(0);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const response = await fetchExams(0, 1000);
        const exams = response.data;

        setTotalExams(exams.length);

        const subjectCounts: { [key: string]: number } = {};
        exams.forEach((exam: ExamResponse) => {
          const subject = exam.subjectName || "Unknown";
          subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
        });

        const statsArray: StatItem[] = Object.entries(subjectCounts).map(
          ([label, count]) => ({
            label,
            count,
          })
        );

        setStats(statsArray);
      } catch (error) {
        console.error("Failed to fetch exam stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-3">
        <h4 className="text-[18px] !font-extrabold">Số Exam trên hệ thống</h4>
        <Card className="shadow-sm">
          <div>
            <span>Tổng số Exam đã có trên hệ thống </span>
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-gray-900">
                {totalExams}
              </div>
              <div className="text-sm text-gray-600">bài</div>
            </div>
          </div>
          <Divider className="!w-[60%]" />

          <div className="flex flex-row w-full item-center justify-between mb-3">
            <div className="text-md font-semibold text-black-700 ">
              Chi tiết
            </div>
            <Button className="!bg-blue-400/33 !hover:bg-blue-500" icon={<FilterOutlined className="!text-[#6392E9] !hover:text-[#6392E9]" />} />
          </div>
          <div className="space-y-2">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex items-center justify-between bg-[#6392E9] px-3 py-2 rounded-[12px]">
                <div className="text-white font-bold">{stat.label}</div>
                <span className="text-sm text-white font-bold">{stat.count} bài</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
