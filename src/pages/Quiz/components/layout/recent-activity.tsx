import { Card, Row, Col } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const barData = [
  { name: "Mon", value: 85 },
  { name: "Tue", value: 80 },
  { name: "Wed", value: 90 },
  { name: "Thu", value: 85 },
  { name: "Fri", value: 75 },
];

const lineData = [
  { name: "1", value: 40 },
  { name: "2", value: 60 },
  { name: "3", value: 50 },
  { name: "4", value: 70 },
  { name: "5", value: 85 },
  { name: "6", value: 75 },
  { name: "7", value: 80 },
];

export default function RecentActivity() {
  return (
    <>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Hoạt động gần đây :
      </h2>

      <div className="px-4">
        <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <div className="bg-[#FFFFFF]  p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">
             Đánh giá điểm theo môn
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#5B6FFF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>

        <Col xs={24} lg={12}>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Quiz Activity
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#5B6FFF"
                  strokeWidth={2}
                  dot={{ fill: "#5B6FFF" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
      </div>
    </>
  );
}
