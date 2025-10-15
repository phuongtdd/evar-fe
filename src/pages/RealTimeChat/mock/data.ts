import { ChatItem, ChatMessage } from "../types";

export const chatList: ChatItem[] = [
    {
      id: 1,
      name: "Nguyen Van A",
      message: "bai nay giai sao vay ?",
      time: "lp trước",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    },
    {
      id: 2,
      name: "Nguyen Van A",
      message: "bai nay giai sao vay ?",
      time: "lp trước",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2",
    },
    {
      id: 3,
      name: "Nguyen Van A",
      message: "bai nay giai sao vay ?",
      time: "lp trước",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    },
    {
      id: 4,
      name: "Nguyen Van A",
      message: "bai nay giai sao vay ?",
      time: "lp trước",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4",
    },
    {
      id: 5,
      name: "Nguyen Van A",
      message: "bai nay giai sao vay ?",
      time: "lp trước",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
    },
  ];

export const chatMessagesByChatId: Record<number, ChatMessage[]> = {
  1: [
    {
      id: 1,
      type: "received",
      content:
        "bai nay giai sao vay ? xin cach giai voi huhu, kho qua hehe hu hu",
      time: "20:20",
    },
    {
      id: 2,
      type: "received",
      attachment: { name: "de thi thpt quoc gia 2018", size: "2.4mb" },
      time: "20:20",
    },
    { id: 3, type: "sent", content: "OK, de minh xem.", time: "20:21" },
  ],
  2: [
    { id: 1, type: "received", content: "Chao ban!", time: "10:00" },
    { id: 2, type: "sent", content: "Chao ban nhe.", time: "10:02" },
  ],
  3: [
    { id: 1, type: "received", content: "Hoc luc nao?", time: "12:00" },
  ],
  4: [
    { id: 1, type: "sent", content: "Toi nay onl nha", time: "18:00" },
  ],
  5: [
    { id: 1, type: "received", content: "Da nhan bai.", time: "08:15" },
  ],
};