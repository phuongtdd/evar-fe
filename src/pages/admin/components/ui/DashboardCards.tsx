import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Typography, Button, Space, Avatar, Spin, Alert } from 'antd';
import { StatCardProps, NavigationCardProps, RecentActivity, DashboardData } from '../../types';
import {
  BookOutlined,
  FileTextOutlined,
  TeamOutlined,
  TrophyOutlined,
  QuestionCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';

const { Title, Text } = Typography;


const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend, trendText }) => (
  <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <Text className="text-gray-500 text-sm">{title}</Text>
        <div className="text-2xl font-bold text-gray-800 mt-1">{value.toLocaleString()}</div>
        {trend && (
          <div className={`text-xs mt-1 ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}% {trendText}
          </div>
        )}
      </div>
      <Avatar 
        size={48} 
        icon={icon} 
        className={`${color} shadow-lg`}
      />
    </div>
  </Card>
);


const NavigationCard: React.FC<NavigationCardProps> = ({
  title,
  description,
  icon,
  color,
  bgGradient,
  stats,
  onNavigate
}) => (
  <Card 
    className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg group cursor-pointer"
    onClick={onNavigate}
  >
    <div className={`${bgGradient} rounded-lg p-6 text-white relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        {icon}
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Avatar size={48} icon={icon} className="bg-white bg-opacity-20" />
          <ArrowRightOutlined className="text-white text-lg group-hover:translate-x-1 transition-transform" />
        </div>
        <Title level={3} className="!text-white !mb-2">{title}</Title>
        <Text className="text-white text-opacity-90">{description}</Text>
      </div>
    </div>
    
    <div className="p-6">
      <Row gutter={16} className="mb-4">
        <Col span={8}>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800">{stats.total}</div>
            <div className="text-xs text-gray-500">Tổng số</div>
          </div>
        </Col>
        <Col span={8}>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{stats.active}</div>
            <div className="text-xs text-gray-500">Đang hoạt động</div>
          </div>
        </Col>
        <Col span={8}>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-500">{stats.pending}</div>
            <div className="text-xs text-gray-500">Chờ duyệt</div>
          </div>
        </Col>
      </Row>
      
      <Button 
        type="primary" 
        block 
        className="h-10 font-medium"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate();
        }}
      >
        <ArrowRightOutlined className="mr-2" />
        Đi tới Quản lý {title.replace('Quản lý ', '')}
      </Button>
    </div>
  </Card>
);

const DashboardCards: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await dashboardService.getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu dashboard:', err);
        setError('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Lỗi tải Dashboard"
        description={error}
        type="error"
        showIcon
        className="mb-6"
      />
    );
  }

  if (!dashboardData) {
    return (
      <Alert
        message="Không có dữ liệu"
        description="Không thể tải dữ liệu dashboard"
        type="warning"
        showIcon
        className="mb-6"
      />
    );
  }

  const { stats } = dashboardData;

  const statsCards = [
    {
      title: 'Tổng số môn học',
      value: stats.totalSubjects,
      icon: <BookOutlined />,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      trend: 12,
      trendText: 'so với tháng trước'
    },
    {
      title: 'Bài thi đang hoạt động',
      value: stats.totalExams,
      icon: <FileTextOutlined />,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      trend: 8,
      trendText: 'so với tháng trước'
    },
    {
      title: 'Tổng số người dùng',
      value: stats.totalUsers,
      icon: <TeamOutlined />,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      trend: 23,
      trendText: 'so với tháng trước'
    },
    {
      title: 'Bài kiểm tra hoàn thành',
      value: stats.completedQuizzes,
      icon: <TrophyOutlined />,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      trend: 15,
      trendText: 'so với tháng trước'
    }
  ];

  const navigationCards = [
    {
      title: 'Quản lý Môn học',
      description: 'Tạo, chỉnh sửa và tổ chức các môn học và danh mục giáo dục',
      icon: <BookOutlined className="text-6xl" />,
      color: 'from-blue-500 to-blue-600',
      bgGradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
      stats: { 
        total: stats.totalSubjects, 
        active: stats.activeSubjects, 
        pending: stats.pendingSubjects 
      },
      onNavigate: () => navigate('/admin/manage-subject')
    },
    {
      title: 'Quản lý Bài thi',
      description: 'Thiết kế, lên lịch và giám sát các phiên thi',
      icon: <FileTextOutlined className="text-6xl" />,
      color: 'from-green-500 to-green-600',
      bgGradient: 'bg-gradient-to-br from-green-500 to-green-600',
      stats: { 
        total: stats.totalExams, 
        active: stats.activeExams, 
        pending: stats.pendingExams 
      },
      onNavigate: () => navigate('/admin/manage-exam')
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <Title level={2} className="!mb-6 text-gray-800">Tổng quan</Title>
        <Row gutter={[24, 24]}>
          {statsCards.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <StatCard {...stat} />
            </Col>
          ))}
        </Row>
      </div>

      <div>
        <div className="flex flex-col justify-between mb-6">
          <Title level={2} className="!mb-0 text-gray-800">Chức năng hệ thống</Title>
          <Text className="text-gray-500">Tổng quan và chi tiết các thành phần trong nền tảng Evar</Text>
        </div>
        <Row gutter={[24, 24]} justify="center">
          {navigationCards.map((card, index) => (
            <Col xs={24} lg={12} xl={10} key={index}>
              <NavigationCard {...card} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default DashboardCards;