import type React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Card, Row, Col, Statistic, Progress } from "antd"
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons"
import type { Subject } from "../../types"

interface SubjectChartProps {
  subjects: Subject[]
}

export const SubjectChart: React.FC<SubjectChartProps> = ({ subjects }) => {
  // 1. Dữ liệu cho Biểu đồ Thanh: Tên môn học và Cấp lớp (Grade Level)
  const chartData = subjects
    .map((s) => ({
      name: s.subject_name, // Tên môn học
      gradeLevel: s.grade, // Cấp lớp (ví dụ: 10, 11, 12)
    }))
    .sort((a, b) => b.gradeLevel - a.gradeLevel)

  // 2. Tính toán Phân phối theo Cấp lớp
  const gradeLevels = Array.from(new Set(subjects.map(s => s.grade))).sort((a, b) => a - b);
  
  const gradeDistribution = gradeLevels.map(level => ({
      name: `Khối ${level}`, // Ví dụ: Khối 10, Khối 11
      value: subjects.filter((s) => s.grade === level).length,
  }));

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#a855f7", "#ec4899"]; 

  // 3. Thống kê (Dựa trên Cấp lớp)
  const totalSubjects = subjects.length;
  const minLevel = subjects.length > 0 ? Math.min(...subjects.map((s) => s.grade)) : 0;
  const maxLevel = subjects.length > 0 ? Math.max(...subjects.map((s) => s.grade)) : 0;
  
  const topLevelCount = subjects.filter((s) => s.grade === maxLevel).length;
  const trendUp = topLevelCount > totalSubjects * 0.3; 

  return (
    <div className="space-y-8">
      {/* Thẻ Thống kê (Statistics Cards) */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-md hover:shadow-lg transition-shadow rounded-xl">
            <Statistic
              title={<span className="text-slate-600 font-semibold">Tổng số Môn học</span>}
              value={totalSubjects}
              valueStyle={{ color: "#3b82f6", fontSize: "32px", fontWeight: "bold" }}
            />
            <div className="text-blue-600 text-sm font-medium mt-2">Các Khóa học Đã theo dõi</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-md hover:shadow-lg transition-shadow rounded-xl">
            <Statistic
              title={<span className="text-slate-600 font-semibold">Khối Cao nhất</span>}
              value={maxLevel}
              suffix=" (Khối)"
              prefix={<ArrowUpOutlined className="text-green-600" />}
              valueStyle={{ color: "#10b981", fontSize: "32px", fontWeight: "bold" }}
            />
            <div className="text-green-600 text-sm font-medium mt-2">Cấp học Cao nhất</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-md hover:shadow-lg transition-shadow rounded-xl">
            <Statistic
              title={<span className="text-slate-600 font-semibold">Khối Thấp nhất</span>}
              value={minLevel}
              suffix=" (Khối)"
              prefix={<ArrowDownOutlined className="text-orange-600" />}
              valueStyle={{ color: "#f97316", fontSize: "32px", fontWeight: "bold" }}
            />
            <div className="text-orange-600 text-sm font-medium mt-2">Cấp học Thấp nhất</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-md hover:shadow-lg transition-shadow rounded-xl">
            <Statistic
              title={<span className="text-slate-600 font-semibold">Môn học Khối Cao nhất</span>}
              value={topLevelCount}
              valueStyle={{ color: "#a855f7", fontSize: "32px", fontWeight: "bold" }}
            />
            <div className="text-purple-600 text-sm font-medium mt-2">Số lượng Môn học</div>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card
            title={<span className="font-bold text-slate-900">Tên Môn học và Khối lớp Tương ứng</span>}
            className="shadow-md border-0 rounded-xl"
          >
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
                <defs>
                  <linearGradient id="colorGrade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                {/* XAxis: Tên môn học */}
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                {/* YAxis: Cấp lớp (Grade Level) */}
                <YAxis tick={{ fontSize: 12 }} domain={[minLevel - 1, maxLevel + 1]} /> 
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value: number, name: string, props) => [`Khối: ${value}`, props.payload.name]}
                  cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                />
                <Bar dataKey="gradeLevel" fill="url(#colorGrade)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={<span className="font-bold text-slate-900">Phân bổ theo Khối lớp</span>}
            className="shadow-md border-0 rounded-xl"
          >
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  // Giữ nguyên nhãn đầy đủ: Ví dụ: Khối 10: 5
                  label={({ name, value }) => `${name}: ${value}`} 
                  outerRadius={120} 
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>


      {/* Area Chart */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={<span className="font-bold text-slate-900">Xu hướng Môn học theo Khối lớp</span>}
            className="shadow-md border-0 rounded-xl"
          >
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 100 }}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                {/* XAxis: Tên môn học */}
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} /> 
                {/* YAxis: Cấp lớp (Grade Level) */}
                <YAxis tick={{ fontSize: 12 }} domain={[minLevel - 1, maxLevel + 1]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  }}
                  formatter={(value: number, name: string, props) => [`Khối: ${value}`, props.payload.name]}
                  cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="gradeLevel" // Sử dụng gradeLevel
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorArea)"
                  dot={{ fill: "#3b82f6", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  )
}