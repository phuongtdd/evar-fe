// src/hooks/useRoomManagement.ts
import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { User, Room } from '../types';
import { getRoomManagementData, getAllRooms } from '../services/roomService';
import { getUserIdFromToken } from '../utils/auth';

export const useRoomManagement = () => {
    const [user, setUser] = useState<User | null>(null);
    const [myRoom, setMyRoom] = useState<Room | null>(null);
    const [discoverRooms, setDiscoverRooms] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        const userId = getUserIdFromToken();
        if (!userId) {
            const errorMessage = "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.";
            setError(errorMessage);
            setLoading(false);
            message.error(errorMessage);
            return;
        }

        try {
            // Gọi hàm service để lấy dữ liệu
            const { user, myRoom } = await getRoomManagementData(userId);
            setUser(user);
            setMyRoom(myRoom);
            const rooms = await getAllRooms(0, 10); // Giả sử bạn có hàm này để lấy danh sách phòng
            setDiscoverRooms(rooms);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Đã có lỗi xảy ra khi tải dữ liệu.";
            setError(errorMessage);
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Trả về state và hàm refetch để component có thể sử dụng
    return { user, myRoom, discoverRooms, loading, error, refetch: fetchData };
};