// src/pages/RoomManagement/components/RoomCard.tsx

import React, { useState } from "react";
import { Card, Button, Avatar, Typography, Space, Popconfirm, App } from "antd";
import {
  UserOutlined,
  DeleteOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Room } from "../../types"; // Điều chỉnh đường dẫn nếu cần
import { deleteRoom } from "../../services/roomService"; // **Import service xóa phòng**

const { Title, Text } = Typography;

interface RoomCardProps {
  room: Room;
  ownerName?: string;
  isOwner?: boolean;
  onRoomDeleted?: () => void;
  onUpdate?: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  ownerName,
  isOwner = false,
  onRoomDeleted,
  onUpdate,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { message: messageApi } = App.useApp();

  // Điều hướng tới trang chi tiết phòng học
  const handleJoinRoom = () => {
    if (room.roomLink) {
      window.location.href = room.roomLink;
    } else {
      messageApi.error("Liên kết phòng học không hợp lệ.");
    }
  };

  // Xử lý sự kiện xóa phòng
  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteRoom(room.id);
      if (response.code === 1000) {
        messageApi.success("Xóa phòng học thành công!");
        // Gọi callback để component cha có thể tải lại danh sách phòng
        if (onRoomDeleted) {
          onRoomDeleted();
        }
      } else {
        messageApi.error(response.message || "Có lỗi xảy ra khi xóa phòng.");
      }
    } catch (error) {
      console.error("Lỗi khi xóa phòng:", error);
      messageApi.error("Không thể kết nối tới máy chủ để xóa phòng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card bordered style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space>
          <Text
            strong
            style={{
              background: "#e6f7ff",
              color: "#1890ff",
              padding: "2px 12px",
              borderRadius: 16,
            }}
          >
            {room.subject?.subjectName || "Chung"}
          </Text>
          <Title level={5} style={{ margin: 0 }}>
            {room.roomName}
          </Title>
        </Space>
        <Space size="large">
          <Text>
            Tạo lúc: {new Date(room.createdAt).toLocaleString("vi-VN")}
          </Text>
          {(ownerName || room.ownerName) && (
            <Text>
              Người tạo: <Text strong>{ownerName || room.ownerName}</Text>
            </Text>
          )}
        </Space>
        <Space style={{ justifyContent: "space-between", width: "100%" }}>
          <Space>
            <Avatar icon={<UserOutlined />} size="small" />
            <Text strong>
              {room.members?.length || 0}/{room.capacity}
            </Text>
          </Space>
          {/* **Nhóm các nút hành động lại** */}
          <Space>
            {isOwner && (
              <Popconfirm
                title="Xóa phòng học?"
                description="Bạn có chắc chắn muốn xóa phòng này không? Hành động này không thể hoàn tác."
                onConfirm={handleDelete}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ loading: loading, danger: true }}
              >
                <Button danger icon={<DeleteOutlined />}>
                  Xóa phòng
                </Button>
              </Popconfirm>
            )}

            {isOwner && (
              <Button
                type="primary"
                icon={<RocketOutlined />}
                onClick={onUpdate}
              >
                Cập nhật
              </Button>
            )}

            <Button type="primary" onClick={handleJoinRoom}>
              Tham gia
            </Button>
          </Space>
        </Space>
      </Space>
    </Card>
  );
};

export default RoomCard;
