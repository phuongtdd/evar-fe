import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WEBSOCKET_URL } from '../../constants';

/**
 * Hook này quản lý kết nối WebSocket để lắng nghe thông báo bị kick.
 * @param userId ID của người dùng hiện tại.
 */
export const useKickRoomSocket = (userId: string | null) => {
  const [kickMessage, setKickMessage] = useState<string | null>(null);
    const token = localStorage.getItem('token');

  if(!token){
    console.error("Websocket: No authen Token found. Disconnect.")
    return { kickMessage: null };
  }

  useEffect(() => {
    if (!userId) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'), // URL backend của bạn
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        console.log(`KickSocket: Đã kết nối! Đang lắng nghe trên kênh của user ${userId}`);
        
        // Lắng nghe trên topic cá nhân
        // BE của bạn đang gửi tới: /topic/room-member/{memberId}/deleted
        client.subscribe(`/topic/room-member/${userId}/deleted`, (message) => {
          console.log('Đã nhận thông báo kick:', message.body);
          setKickMessage(message.body || "Bạn đã bị chủ phòng yêu cầu rời khỏi phòng.");
        });
      },
      onStompError: (frame) => {
        console.error('Lỗi KickSocket:', frame.headers['message']);
      },
    });

    client.activate();

    // Dọn dẹp khi component unmount
    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [userId]); // Chạy lại effect nếu userId thay đổi

  return { kickMessage };
};
