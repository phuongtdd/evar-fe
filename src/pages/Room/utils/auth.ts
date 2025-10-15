// src/utils/auth.ts

/**
 * Giải mã JWT token từ localStorage để lấy userId.
 * @returns userId hoặc null nếu không tìm thấy token hoặc token không hợp lệ.
 */
export const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        // Tách phần payload của token (phần thứ 2)
        const payload = token.split('.')[1];
        // Giải mã Base64 và parse thành JSON
        const decoded = JSON.parse(atob(payload));
        return decoded.userId || null;
    } catch (error) {
        console.error("Lỗi giải mã token:", error);
        return null;
    }
};

export const getUsernameFromToken = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        // Tách phần payload của token (phần thứ 2)
        const payload = token.split('.')[1];
        // Giải mã Base64 và parse thành JSON
        const decoded = JSON.parse(atob(payload));
        return decoded.username || null;
    } catch (error) {
        console.error("Lỗi giải mã token:", error);
        return null;
    }
};

export const getFullNameFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = token.split('.')[1];

    // Chuẩn hóa Base64URL thành Base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

    // Decode UTF-8 an toàn (dùng TextDecoder)
    const jsonPayload = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(base64), c => c.charCodeAt(0))
      )
    );

    return jsonPayload.fullName || null;
  } catch (error) {
    console.error("Lỗi giải mã token:", error);
    return null;
  }
};

