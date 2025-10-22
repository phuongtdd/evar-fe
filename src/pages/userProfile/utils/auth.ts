// Tiện ích giải mã JWT dành cho module userProfile
// Học theo cách làm ở Room/utils/auth.ts để tránh phụ thuộc chéo giữa các module

/**
 * Giải mã JWT từ localStorage và lấy userId
 */
export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem("token")
  console.log("🎫 Token từ localStorage:", token ? "Có token" : "Không có token")
  
  if (!token) {
    console.warn("⚠️ Không tìm thấy token trong localStorage")
    return null
  }

  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    console.log("🔓 Decoded token:", decoded)
    console.log("🆔 UserId từ token:", decoded.userId)
    return decoded.userId || null
  } catch (error) {
    console.error("❌ Lỗi giải mã token:", error)
    return null
  }
}

/**
 * Giải mã JWT và lấy username (hàm hỗ trợ, có thể không dùng)
 */
export const getUsernameFromToken = (): string | null => {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return decoded.username || null
  } catch (error) {
    console.error("Lỗi giải mã token:", error)
    return null
  }
}

/**
 * Cách giải mã Base64URL an toàn hơn để lấy fullName (ví dụ minh hoạ)
 */
export const getFullNameFromToken = (): string | null => {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(base64), c => c.charCodeAt(0))
      )
    )
    return jsonPayload.fullName || null
  } catch (error) {
    console.error("Lỗi giải mã token:", error)
    return null
  }
}


