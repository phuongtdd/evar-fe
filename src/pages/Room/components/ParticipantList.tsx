// src/pages/Room/components/ParticipantList.tsx
import React from "react";
import { List, Avatar, Button, Popconfirm, Typography } from "antd";
import { UserOutlined, CrownOutlined, LogoutOutlined } from "@ant-design/icons";
import { ZegoUser } from "../types";

const { Text } = Typography;

interface ParticipantListProps {
  participants: ZegoUser[];
  isOwner: boolean;
  ownerId: string;
  onKickUser: (userIdToKick: string) => void;
}

const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  isOwner,
  ownerId,
  onKickUser,
}) => {
  return (
    <div style={{ padding: "16px", background: "#fff", borderRadius: "8px" }}>
      <Text
        strong
        style={{ fontSize: "18px", marginBottom: "12px", display: "block" }}
      >
        Người tham gia ({participants.length})
      </Text>
      <List
        itemLayout="horizontal"
        dataSource={participants}
        renderItem={(user) => {
          // 👇 Tách username và fullName từ chuỗi gộp
          const [userName, fullName] = user.userName.split("|");

          return (
            <List.Item
              actions={[
                isOwner && user.userID !== ownerId ? (
                  <Popconfirm
                    title={`Xóa ${userName}?`}
                    description="Người này sẽ bị xóa khỏi phòng. Bạn chắc chứ?"
                    onConfirm={() => onKickUser(user.userID)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <Button
                      type="primary"
                      danger
                      icon={<LogoutOutlined />}
                      size="small"
                    >
                      Xóa
                    </Button>
                  </Popconfirm>
                ) : null,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={
                  <span>
                    {userName}{" "}
                    {user.userID === ownerId && (
                      <CrownOutlined
                        style={{ color: "#faad14" }}
                        title="Chủ phòng"
                      />
                    )}
                  </span>
                }
                description={`Fullname: ${fullName || "Không rõ"}`}
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default ParticipantList;
