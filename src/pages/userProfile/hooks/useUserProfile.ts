"use client"

import { useState, useEffect } from "react"
import type { UserProfile } from "../types"
import { getUserById } from "../services"
import { getUserIdFromToken } from "../utils/auth"

// Hook tải thông tin hồ sơ người dùng theo id thông qua service API
export const useUserProfile = (id?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null) // Reset error trước khi fetch
        
        const userId = id || getUserIdFromToken() || ""
        console.log("🔍 UserId từ token:", userId)
        
        if (!userId) {
          throw new Error("Không tìm thấy user id trong token. Vui lòng đăng nhập lại.")
        }
        
        console.log("📡 Đang gọi API getUserById với id:", userId)
        const data = await getUserById(userId)
        console.log("✅ Nhận được dữ liệu:", data)
        setProfile(data)
      } catch (err: any) {
        console.error("❌ Lỗi trong useUserProfile:", err)
        const errorMessage = err?.response?.data?.message || err?.message || "Tải hồ sơ người dùng thất bại"
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [id])

  return { profile, loading, error }
}
