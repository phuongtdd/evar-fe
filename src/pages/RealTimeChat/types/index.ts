export interface ChatItem {
  id: number;
  name: string;
  message: string;
  time: string;
  avatar: string;
}

export interface ChatMessage {
  id: number;
  type: "received" | "sent";
  content?: string;
  attachment?: {
    name: string;
    size: string;
  };
  time: string;
}

export interface FileShare {
  id: number;
  name: string;
}

export const sharedFiles = [
  { id: 1, name: "File 1" },
  { id: 2, name: "File 2" },
  { id: 3, name: "File 3" },
  { id: 4, name: "File 4" },
  { id: 5, name: "File 5" },
];
