import { useState, useCallback } from "react";
import { App } from "antd";
import { getSubjects, createRoom, updateRoom } from "../services/roomService";
import { Subject } from "../types";

// Helper: giải mã JWT và lấy userId
function getUserIdFromToken(): string | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.userId || null;
  } catch {
    return null;
  }
}

export const useCreateRoom = () => {
  const { message: messageApi } = App.useApp();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState(false);

  // SỬA LỖI: Bọc hàm trong useCallback để tránh việc tạo lại hàm sau mỗi lần render
  const fetchSubjects = useCallback(async () => {
    setLoadingSubjects(true);
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      messageApi.error("Không thể tải danh sách môn học.");
    } finally {
      setLoadingSubjects(false);
    }
  }, []); // Mảng dependency rỗng vì hàm này không phụ thuộc vào props hay state nào

  const handleCreateRoom = useCallback(
    async (
      values: any,
      onSuccess?: (newRoom: any) => void,
      onClose?: () => void
    ) => {
      setCreatingRoom(true);
      try {
        const ownerId = getUserIdFromToken();
        if (!ownerId) {
          throw new Error(
            "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
          );
        }

        const payload = {
          ownerId,
          roomName: values.roomName,
          description: values.description || "",
          capacity: values.capacity,
          subjectId: values.subjectId,
        };

        const newRoom = await createRoom(payload);
        messageApi.success("Phòng học đã được tạo thành công!");
        onSuccess?.(newRoom);
        onClose?.();
      } catch (error: any) {
        messageApi.error(error.message || "Tạo phòng thất bại.");
      } finally {
        setCreatingRoom(false);
      }
    },
    []
  );

  const handleUpdateRoom = useCallback(
    async (
      id: string,
      values: any,
      onSuccess?: (newRoom: any) => void,
      onClose?: () => void
    ) => {
      setCreatingRoom(true);
      try {
        const ownerId = getUserIdFromToken();
        if (!ownerId) {
          throw new Error(
            "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại."
          );
        }

        const payload = {
          id,
          ownerId,
          roomName: values.roomName,
          description: values.description || "",
          capacity: values.capacity,
          subjectId: values.subjectId,
        };

        const newRoom = await updateRoom(payload);
        messageApi.success("Phòng học đã được cập nhật thành công!");
        onSuccess?.(newRoom);
        onClose?.();
      } catch (error) {
        console.error("Lỗi khi cập nhật phòng:", error);
        messageApi.error("Có lỗi xảy ra khi cập nhật phòng.");
      } finally {
        setCreatingRoom(false);
      }
    },
    [messageApi]
  );

  return {
    subjects,
    loadingSubjects,
    creatingRoom,
    fetchSubjects,
    handleCreateRoom,
    handleUpdateRoom,
  };
};
