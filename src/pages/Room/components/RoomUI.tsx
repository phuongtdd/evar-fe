// src/pages/Room/components/RoomUI.tsx
"use client";

import type React from "react";
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import { Spin, Modal, Button } from "antd";
import { useRoomLogic } from "../hooks/useRoomLogic";
import ParticipantList from "./ParticipantList";

const RoomUI: React.FC = () => {
  const {
    rootRef,
    isLoading,
    error,
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    participants,
    isOwner,
    handleKickUser,
    roomDetails,
    isRoomDeleted,
    kickMessage,
  } = useRoomLogic();

  const handleRedirect = () => {
    window.location.href = "/room";
  };

  return (
    // ✨ BƯỚC 3: THAY ĐỔI LAYOUT CHÍNH THÀNH `flex-row`
    <div className="flex flex-row h-[calc(100vh-112px)]">
      {/*Chủ room đóng room*/}
      <Modal
        title="Thông báo"
        open={isRoomDeleted}
        closable={false}
        footer={[
          <Button key="ok" type="primary" onClick={handleRedirect}>
            OK
          </Button>,
        ]}
      >
        <p>Chủ phòng đã kết thúc cuộc họp. Bạn sẽ được chuyển hướng.</p>
      </Modal>

      {/*Room member bị kick*/}
      <Modal
        title="Thông báo"
        open={!!kickMessage} // Hiển thị Modal khi có tin nhắn kick
        closable={false} // Không cho phép đóng bằng nút X
        maskClosable={false} // Không cho phép đóng khi bấm ra ngoài
        footer={[
          <Button key="ok" type="primary" onClick={handleRedirect}>
            Đã hiểu
          </Button>,
        ]}
      >
        <p>{kickMessage}</p>
      </Modal>

      {/* Khu vực video chính */}
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 dark:bg-gray-200 backdrop-blur-sm z-10">
            <div className="text-center">
              <Spin size="large" />
              <p className="mt-4 text-lg font-semibold text-blue-600 dark:text-blue-500">
                Đang vào phòng...
              </p>
              <p className="text-black-400">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
            <div className="text-center">
              <p className="text-lg font-semibold text-danger">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}
        <div className="absolute top-2 right-2 z-20">
          {!isFullscreen ? (
            <button
              onClick={enterFullscreen}
              className="p-2 rounded-bl-md bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label="Enter fullscreen"
            >
              <FullscreenOutlined style={{ fontSize: "1.25rem" }} />
            </button>
          ) : (
            <button
              onClick={exitFullscreen}
              className="p-2 rounded-bl-md bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label="Exit fullscreen"
            >
              <FullscreenExitOutlined style={{ fontSize: "1.25rem" }} />
            </button>
          )}
        </div>
        <div
          id="root"
          ref={rootRef}
          className="w-full h-full rounded-lg shadow-lg overflow-hidden"
        ></div>
      </div>
      {/*Sidebar danh sach nguoi tham gia */}
      <div className="w-80 ml-4">
        {roomDetails && (
          <ParticipantList
            participants={participants}
            isOwner={isOwner}
            ownerId={roomDetails.ownerId}
            onKickUser={handleKickUser}
          />
        )}
      </div>
    </div>
  );
};

export default RoomUI;
