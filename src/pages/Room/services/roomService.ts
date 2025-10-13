import apiClient from "../../../configs/axiosConfig";
import {
  Room,
  Subject,
  CreateRoomPayload,
  CreateRoomResponse,
  RoomResponse,
  UpdateRoomPayload,
  JoinRoomPayload,
} from "../types";
import { API_ENDPOINT } from "../constants";
import { User } from "../types";
import axios from "axios";

export const getSubjects = async (): Promise<Subject[]> => {
  try {
    const response = await apiClient.get(API_ENDPOINT.ALL_SUBJECTS);
    if (response.status !== 200) {
      throw new Error(`Error fetching subjects: ${response.statusText}`);
    }
    const data: Subject[] = response.data.data;
    return data;
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
    throw error;
  }
};

export const createRoom = async (
  payload: CreateRoomPayload
): Promise<CreateRoomResponse> => {
  try {
    const response = await apiClient.post(API_ENDPOINT.CREATE_ROOM, payload);

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(
        errorData.message || `Error creating room: ${response.statusText}`
      );
    }

    const data: CreateRoomResponse = response.data;
    return data;
  } catch (error) {
    console.error("Failed to create room:", error);
    throw error;
  }
};

export const updateRoom = async (
  payload: UpdateRoomPayload
): Promise<UpdateRoomPayload> => {
  try {
    const response = await apiClient.put(API_ENDPOINT.UPDATE_ROOM, payload);

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(
        errorData.message || `Error creating room: ${response.statusText}`
      );
    }

    const data: UpdateRoomPayload = response.data;
    return data;
  } catch (error) {
    console.error("Failed to create room:", error);
    throw error;
  }
};

export const deleteRoom = async (
  roomId: string
): Promise<CreateRoomResponse> => {
  try {
    const response = await apiClient.delete(API_ENDPOINT.DELETE_ROOM, {
      params: { id: roomId },
    });

    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(
        errorData.message || `Error Deleting room: ${response.statusText}`
      );
    }

    const data: CreateRoomResponse = response.data;
    return data;
  } catch (error) {
    console.error("Failed to delete room:", error);
    throw error;
  }
};

export const getAllRooms = async (
  page: number,
  pageSize: number
): Promise<RoomResponse[]> => {
  try {
    const response = await apiClient.get(API_ENDPOINT.ALL_ROOMS, {
      params: { page, pageSize },
    });
    if (response.status !== 200) {
      throw new Error(`Error fetching rooms: ${response.statusText}`);
    }
    const data: RoomResponse[] = response.data.data;
    console.log("Fetched rooms:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    throw error;
  }
};

export const getRoomManagementData = async (
  userId: string
): Promise<{ user: User; myRoom: Room | null }> => {
  try {
    const userPromise = apiClient.get(API_ENDPOINT.USER, {
      params: { id: userId },
    });

    const myRoomPromise = apiClient
      .get(API_ENDPOINT.MY_ROOM, { params: { id: userId } })
      .catch((error) => {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          return { data: { data: null } };
        }
        throw error;
      });

    const [userResponse, myRoomResponse] = await Promise.all([
      userPromise,
      myRoomPromise,
    ]);

    return {
      user: userResponse.data.data,
      myRoom: myRoomResponse.data.data, // myRoom giờ đây sẽ là null nếu có lỗi 400
    };
  } catch (error) {
    console.error("Lỗi nghiêm trọng khi tải dữ liệu quản lý phòng:", error);
    throw new Error("Không thể tải dữ liệu từ máy chủ.");
  }
};

export const getRoomDetail = async (id: string): Promise<Room> => {
  try {
    const response = await apiClient.get(API_ENDPOINT.GET_ROOM, {
      params: { id: id },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error getting room:", error);
    throw new Error("Không thể tìm thấy thông tin phòng học.");
  }
};

//Join room
export const joinRoomSession = async (
  payload: JoinRoomPayload
): Promise<void> => {
  try {
    const response = await apiClient.post(API_ENDPOINT.JOIN_ROOM, payload);
    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(
        errorData.message || `Error joining room: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error recording user join:", error);
  }
};

//Out room hoac bi kick khoi room
export const leaveRoomSession = async (memberId: string): Promise<void> => {
  try {
    const response = await apiClient.delete(API_ENDPOINT.OUT_ROOM, {
      params: { memberId: memberId },
    });
    if (response.status !== 200) {
      const errorData = response.data;
      throw new Error(
        errorData.message || `Error deleting room: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error recording user leave:", error);
  }
};
