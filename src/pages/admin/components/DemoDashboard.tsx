import React from 'react';
import { Card, Row, Col, Typography, Button, Space, Tag, Progress } from 'antd';
import { 
  BookOutlined, 
  FileTextOutlined, 
  TeamOutlined, 
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const DemoDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-lg">
        <div className="text-center py-8">
          <Title level={1} className="!text-gray-800 !mb-4">
            Welcome to EVar Admin Dashboard
          </Title>
          <Text className="text-lg text-gray-600 mb-6 block">
            Manage your educational platform with ease and efficiency
          </Text>
          <Space size="large">
            <Button type="primary" size="large" className="h-12 px-8">
              Get Started
            </Button>
            <Button size="large" className="h-12 px-8">
              View Documentation
            </Button>
          </Space>
        </div>
      </Card>

      {/* Quick Stats */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <BookOutlined className="text-4xl text-blue-500 mb-4" />
            <Title level={2} className="!text-gray-800 !mb-2">24</Title>
            <Text className="text-gray-500">Active Subjects</Text>
            <div className="mt-2">
              <Tag color="green">+12% this month</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <FileTextOutlined className="text-4xl text-green-500 mb-4" />
            <Title level={2} className="!text-gray-800 !mb-2">156</Title>
            <Text className="text-gray-500">Total Exams</Text>
            <div className="mt-2">
              <Tag color="blue">+8% this month</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <TeamOutlined className="text-4xl text-purple-500 mb-4" />
            <Title level={2} className="!text-gray-800 !mb-2">2,847</Title>
            <Text className="text-gray-500">Registered Users</Text>
            <div className="mt-2">
              <Tag color="purple">+23% this month</Tag>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <TrophyOutlined className="text-4xl text-orange-500 mb-4" />
            <Title level={2} className="!text-gray-800 !mb-2">1,243</Title>
            <Text className="text-gray-500">Completed Quizzes</Text>
            <div className="mt-2">
              <Tag color="orange">+15% this month</Tag>
            </div>
          </Card>
        </Col>
      </Row>

      {/* System Status */}
      <Card title="System Status" className="shadow-md border-0">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircleOutlined className="text-green-500 text-lg" />
                  <Text className="font-medium">Server Status</Text>
                </div>
                <Tag color="green">Online</Tag>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircleOutlined className="text-green-500 text-lg" />
                  <Text className="font-medium">Database</Text>
                </div>
                <Tag color="green">Connected</Tag>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ExclamationCircleOutlined className="text-yellow-500 text-lg" />
                  <Text className="font-medium">Storage</Text>
                </div>
                <Tag color="orange">75% Used</Tag>
              </div>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div>
              <Text className="font-medium mb-2 block">Storage Usage</Text>
              <Progress 
                percent={75} 
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                className="mb-2"
              />
              <Text className="text-sm text-gray-500">7.5 GB of 10 GB used</Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Recent Activity Preview */}
      <Card title="Recent Activity" className="shadow-md border-0">
        <div className="space-y-3">
          {[
            { icon: <FileTextOutlined className="text-blue-500" />, text: "New exam 'Advanced Mathematics' created", time: "2 hours ago" },
            { icon: <BookOutlined className="text-green-500" />, text: "Subject 'Physics' updated with new content", time: "4 hours ago" },
            { icon: <TeamOutlined className="text-purple-500" />, text: "25 new users registered today", time: "6 hours ago" },
            { icon: <TrophyOutlined className="text-orange-500" />, text: "Quiz 'Chemistry Basics' completed by 150 students", time: "8 hours ago" }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              {activity.icon}
              <div className="flex-1">
                <Text className="font-medium">{activity.text}</Text>
              </div>
              <Text className="text-gray-400 text-sm">{activity.time}</Text>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DemoDashboard;
