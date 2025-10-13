// src/pages/RoomManagement/RoomManagementPage.tsx
import React, { useState } from "react";
import { Layout, Typography, Space, Spin } from "antd";

// Import các components con từ thư mục components
import MyRoomCTA from "../components/room-management/MyRoomCTA";
import RoomCard from "../components/room-management/RoomCard";
import RightSidebar from "../components/room-management/RightSidebar";
import RoomPagination from "../components/room-management/RoomPagination";
import CreateRoomModal from "../components/CreateRoomModal";
import { Room } from "../types";

// Import custom hook
import { useRoomManagement } from "../hooks/roomManagementHook";

const { Title, Text } = Typography;
const { Content } = Layout;

export default function RoomManagementPage() {
  // ♻️ MODIFIED: Quản lý trạng thái modal một cách chi tiết hơn
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const { user, myRoom, discoverRooms, loading, error, refetch } =
    useRoomManagement();

  // ✨ NEW: Hàm để mở modal ở chế độ TẠO MỚI
  const showCreateModal = () => {
    setModalMode("create");
    setEditingRoom(null);
    setIsModalVisible(true);
  };

  // ✨ NEW: Hàm để mở modal ở chế độ CẬP NHẬT
  const showUpdateModal = (room: Room) => {
    setModalMode("update");
    setEditingRoom(room);
    setIsModalVisible(true);
  };

  // ✨ NEW: Hàm đóng modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    setEditingRoom(null);
  };

  // ✨ NEW: Hàm callback sau khi tạo/cập nhật thành công
  const handleModalSuccess = () => {
    handleModalClose();
    refetch(); // Tải lại dữ liệu
  };

  if (loading) {
    return <Spin fullscreen tip="Đang tải dữ liệu phòng học..." />;
  }

  if (error) {
    return (
      <div style={{ padding: 50, textAlign: "center" }}>
        <Title level={3} type="danger">
          {error}
        </Title>
      </div>
    );
  }

  const ownerFullName = `${user?.person?.lastName || ""} ${
    user?.person?.firstName || ""
  }`.trim();

  return (
    <Layout style={{ background: "#f5f5f5", minHeight: "100vh", padding: 32 }}>
      <Content>
        <Title level={2} style={{ marginBottom: 32 }}>
          Quản lí phòng học cá nhân
        </Title>
        <Layout style={{ background: "transparent" }}>
          <Content>
            <Space direction="vertical" style={{ width: "100%" }} size={32}>
              <div>
                <Title level={4}>Phòng của tôi</Title>
                {myRoom ? (
                  <RoomCard
                    room={myRoom}
                    ownerName={ownerFullName}
                    isOwner={true}
                    onRoomDeleted={refetch}
                    onUpdate={() => showUpdateModal(myRoom)} // ♻️ MODIFIED
                  />
                ) : (
                  <MyRoomCTA onCreateRoom={showCreateModal} /> // ♻️ MODIFIED
                )}
              </div>
              <div>
                <Title level={4}>Khám phá thêm</Title>
                <Space direction="vertical" style={{ width: "100%" }}>
                  {discoverRooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                  ))}
                </Space>
                <RoomPagination />
              </div>
            </Space>
          </Content>
          <RightSidebar user={user} room={myRoom} />
        </Layout>
      </Content>
      <CreateRoomModal
        isVisible={isModalVisible}
        mode={modalMode}
        initialData={editingRoom}
        onClose={handleModalClose}
        onRoomCreated={handleModalSuccess}
      />
    </Layout>
  );
}
