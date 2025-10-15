declare global {
  interface Window {
    ZegoUIKitPrebuilt: any;
  }
}

export interface Subject {
  id: string;
  name: string;
}

export interface CreateRoomPayload {
  ownerId: string;
  roomName: string;
  description: string;
  capacity: number;
  subjectId: string;
}

export interface JoinRoomPayload {
  memberId: string;
  roomId: string;
}

export interface UpdateRoomPayload {
  id: string;
  ownerId: string;
  roomName: string;
  description: string;
  capacity: number;
  subjectId: string;
}

export interface RoomResponse {
  message: string;
  code: number;
  id: string;
  roomName: string;
  description: string;
  capacity: number;
  roomLink: string;
  ownerId: string;
  createdBy: String;
  updatedBy: String;
  createdAt: string;
  updatedAt: string;
  members: any[];
  subject: Subject;
}

export interface CreateRoomResponse {
  message: string;
  code: number;
  id: string;
  roomName: string;
}

export interface Subject {
  id: string;
  subjectName: string;
}

export interface CreateRoomModalProps {
  isVisible: boolean;
  onClose: () => void;
  onRoomCreated?: (roomData: any) => void;
}

export interface Person {
  firstName: string;
  lastName: string;
  email: string;
}

export interface User {
  id: string;
  username: string;
  person: Person;
}

export interface Room {
  id: string;
  subject: { subjectName: string };
  roomName: string;
  createdAt: string;
  ownerId: string;
  members: any[]; 
  capacity: number;
  description?: string;
  roomLink?: string;
  ownerName: string;
}


export interface ZegoUser {
  userID: string;
  userName: string;
}