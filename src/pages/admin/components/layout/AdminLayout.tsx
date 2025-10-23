import React, { useState } from 'react';
import { Layout, Menu, Card, Row, Col, Avatar, Dropdown, Button, Badge, Typography, Space, Divider } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  BookOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  LogoutOutlined,
  TeamOutlined,
  BarChartOutlined,
  TrophyOutlined,
  QuestionCircleOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <Layout className="min-h-screen bg-gray-50">
        <Content className="!px-6 !py-5 h-screen">
          {children}
        </Content>
    </Layout>
  );
};

export default AdminLayout;
