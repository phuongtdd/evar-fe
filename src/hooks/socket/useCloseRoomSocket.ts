import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WEBSOCKET_URL } from "../../constants";

export const useRoomSocket = (roomId: string | null) => {
  const [isRoomDeleted, setIsRoomDeleted] = useState(false);
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Websocket: No authen Token found. Disconnect.");
    return { isRoomDeleted: false };
  }

  useEffect(() => {
    if (!roomId) return;

    // Tạo STOMP client
    const client = new Client({
      // Dùng SockJS để kết nối
      webSocketFactory: () => new SockJS(WEBSOCKET_URL), // Thay bằng URL backend của bạn
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log("Connected to WebSocket!");
        // Subscribe vào topic cụ thể của phòng
        client.subscribe(`/topic/rooms/${roomId}/deleted`, (message) => {
          console.log("Received message:", message.body);
          setIsRoomDeleted(true);
        });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
        console.error("Additional details: " + frame.body);
      },
    });

    // Kích hoạt kết nối
    client.activate();

    // Dọn dẹp: ngắt kết nối khi component bị unmount
    return () => {
      client.deactivate();
    };
  }, [roomId]);

  return { isRoomDeleted };
};
