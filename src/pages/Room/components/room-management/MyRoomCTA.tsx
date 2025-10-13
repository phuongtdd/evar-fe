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
        <Card bordered style={{ marginBottom: 24, background: '#f0faff' }}>
            <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                <div>
                    <Text type="danger" strong>Bạn chưa tạo phòng học nào !</Text>
                    <Title level={3} style={{ margin: '8px 0' }}>Tạo ra không gian học tập độc đáo</Title>
                    <Text style={{ display: 'block', marginBottom: 16 }}>cùng bạn bè ~!</Text>
                    <Button type="primary" icon={<RocketOutlined />} onClick={onCreateRoom}>
                        Bắt đầu thôi
                    </Button>
                </div>
                <div style={{ fontSize: 48 }}>🚀</div>
            </Space>
        </Card>
    );
};

export default MyRoomCTA;