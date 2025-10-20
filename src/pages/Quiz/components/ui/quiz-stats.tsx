import { Card, Tag } from "antd"
import { useEffect, useState } from "react"
import { fetchExams, ExamResponse } from "../../services/examService"

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
          const subject = exam.subjectName || 'Unknown';
          subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
        });

        const statsArray: StatItem[] = Object.entries(subjectCounts).map(([label, count]) => ({
          label,
          count
        }));

        setStats(statsArray);
      } catch (error) {
        console.error('Failed to fetch exam stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <Card className="shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Số Exam đã tạo</h3>
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-gray-900">{totalExams}</div>
        <div className="text-sm text-gray-600">bài</div>
      </div>

      <div className="text-sm font-semibold text-gray-700 mb-3">Chi tiết</div>
      <div className="space-y-2">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <Tag color="blue">{stat.label}</Tag>
            <span className="text-sm text-gray-600">{stat.count} bài</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
