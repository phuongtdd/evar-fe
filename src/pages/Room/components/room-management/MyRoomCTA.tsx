// src/pages/RoomManagement/components/MyRoomCTA.tsx
import React from 'react';
import { Card, Button, Typography, Space } from 'antd';
import { RocketOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface MyRoomCTAProps {
    onCreateRoom: () => void;
}

const MyRoomCTA: React.FC<MyRoomCTAProps> = ({ onCreateRoom }) => {
    return (
        <Card 
          bordered 
          className="rounded-2xl"
          style={{ 
            marginBottom: 24, 
            background: 'linear-gradient(135deg, #f0faff 0%, #e6f7ff 100%)',
            border: '2px solid #91d5ff',
            boxShadow: '0 4px 12px rgba(24, 144, 255, 0.15)'
          }}
        >
            <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                <div>
                    <Text type="danger" strong style={{ fontSize: '16px' }}>Bạn chưa tạo phòng học nào !</Text>
                    <Title level={3} style={{ margin: '8px 0', color: '#1890ff' }}>Tạo ra không gian học tập độc đáo</Title>
                    <Text style={{ display: 'block', marginBottom: 16, fontSize: '15px', color: '#595959' }}>cùng bạn bè ~!</Text>
                    <Button 
                      type="primary" 
                      icon={<RocketOutlined />} 
                      onClick={onCreateRoom}
                      size="large"
                      className="rounded-lg"
                      style={{
                        background: '#1890ff',
                        borderColor: '#1890ff',
                        height: '40px',
                        fontSize: '16px',
                        fontWeight: 600
                      }}
                    >
                        Bắt đầu thôi
                    </Button>
                </div>
                <div style={{ fontSize: 64 }}>🚀</div>
            </Space>
        </Card>
    );
};

export default MyRoomCTA;