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
      <Layout>
        <Header className="bg-white shadow-sm border-b border-gray-200 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            
            <Title level={4} className="!mb-0 text-gray-800">Admin Dashboard</Title>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge count={5} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined />} 
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              />
            </Badge>
            
         
              <div className="flex flex-row items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                <Avatar 
                  size="small" 
                  icon={<UserOutlined />} 
                  className="bg-gradient-to-r from-blue-500 to-purple-600"
                />
                <div className="flex flex-col ml-2">
                  <span className="text-sm font-medium text-gray-700">Admin User</span>
                  <span className="text-xs text-gray-500">admin@evar.com</span>
                </div>
              </div>
        
          </div>
        </Header>
        
        <Content className="!px-12 !py-5 h-screen">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
