// src/pages/Room/constants/index.ts
export const APP_ID = Number(import.meta.env.VITE_APP_ID);
export const SERVER_SECRET = import.meta.env.VITE_SERVER_SECRET;

export const API_ENDPOINT = {
    ALL_SUBJECTS: "/subject/all",
    CREATE_ROOM: "/room",
    MY_ROOM: "/room/me",
    USER: "/users",
    DELETE_ROOM: "/room/delete",
    ROOM_KICK: "/room-member/kick",
    ALL_ROOMS: "/room/all",
    UPDATE_ROOM: "/room/update",
    JOIN_ROOM: "/room-member",
    OUT_ROOM: "/room-member/delete",
    GET_ROOM: "/room"
}