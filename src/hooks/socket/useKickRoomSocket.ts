import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WEBSOCKET_URL } from "../../constants";

export const useKickRoomSocket = (userId: string | null) => {
  const [kickMessage, setKickMessage] = useState<string | null>(null);
  const [countDown, setCountDown] = useState(10);
  const token = localStorage.getItem("token");

  // Đếm ngược mỗi khi có tin nhắn kick
  useEffect(() => {
    if (!kickMessage) return;
    let timeLeft = 10;
    setCountDown(timeLeft);

    const interval = setInterval(() => {
      timeLeft -= 1;
      setCountDown(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [kickMessage]);

  if (!token) {
    console.error("Websocket: No authen Token found. Disconnect.");
    return { kickMessage: null, countDown: 0 };
  }

  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log(`KickSocket: Đã kết nối tới user ${userId}`);

        client.subscribe(`/topic/room-member/${userId}/deleted`, (message) => {
          console.log("Đã nhận thông báo kick:", message.body);
          setKickMessage("Bạn đã bị chủ phòng yêu cầu rời khỏi phòng.");
        });
      },
      onStompError: (frame) => {
        console.error("Lỗi KickSocket:", frame.headers["message"]);
      },
    });

    client.activate();

    return () => {
      if (client.active) client.deactivate();
    };
  }, [userId]);

  return { kickMessage, countDown };
};
