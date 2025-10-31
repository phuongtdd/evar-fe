// src/pages/RoomManagement/components/RightSidebar.tsx
import React from 'react';
import { Layout, Card, Button, Avatar, Typography, Space, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { User, Room } from '../../types'; // Import types

const { Sider } = Layout;
const { Title, Text } = Typography;

interface RightSidebarProps {
    user: User | null;
    room: Room | null;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ user, room }) => {
    const fullName = `${user?.person?.lastName || ''} ${user?.person?.firstName || ''}`.trim();

    return (
        <Sider width={340} style={{ background: 'transparent', marginLeft: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }} size={20}>
                <Card 
                  bordered
                  className="rounded-2xl"
                  style={{
                    border: '2px solid #d1d5db',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                  }}
                >
                    <Title level={4}>Thông tin nhanh</Title>
                    <Space align="center" style={{ width: '100%', marginBottom: 16 }}>
                        <Avatar 
                          size={64} 
                          icon={<UserOutlined />} 
                          style={{ 
                            background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                            color: '#1890ff',
                            border: '2px solid #91d5ff'
                          }} 
                        />
                        <Button 
                          type="default" 
                          className="rounded-lg"
                          style={{ 
                            flex: 1,
                            height: '36px',
                            border: '1px solid #d1d5db'
                          }}
                        >
                          Quản lí tài khoản
                        </Button>
                    </Space>
                    <Divider style={{ margin: '16px 0' }} />
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        <Text><Text strong>Email:</Text> {user?.person?.email || 'Đang tải...'}</Text>
                        <Text><Text strong>Tên:</Text> {fullName || 'Đang tải...'}</Text>
                    </Space>
                </Card>

                <Card 
                  bordered
                  className="rounded-2xl"
                  style={{
                    border: '2px solid #d1d5db',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                  }}
                >
                    <Title level={4}>Phòng học của tôi</Title>
                    <Space direction="vertical" size={8} style={{ width: '100%' }}>
                        <Text><Text strong>Tên phòng:</Text> {room?.roomName || '--'}</Text>
                        <Text><Text strong>Môn học:</Text> {room?.subject?.subjectName || '--'}</Text>
                        <Text><Text strong>Chủ phòng:</Text> {room ? fullName : '--'}</Text>
                        <Text><Text strong>Mô tả:</Text> {room?.description || '--'}</Text>
                        <Text><Text strong>Link phòng:</Text> {room?.roomLink || '--'}</Text>
                        <Text><Text strong>Thành viên:</Text> {room ? `${room.members?.length || 0}/${room.capacity}` : '--'}</Text>
                    </Space>
                </Card>
            </Space>
        </Sider>
    );
};

export default RightSidebar;