import apiClient from "../../../configs/axiosConfig"
import { API_ENDPOINT } from "../constants"
import type { ApiEnvelope, UserApiModel, UserProfile, Activity } from "../types"
import { mockActivities } from "../mock"

// Chuyển đổi dữ liệu user từ backend sang mô hình dùng cho UI
const mapUserApiToProfile = (id: string, api: UserApiModel): UserProfile => {
  const fullName = `${api.person.firstName || ''} ${api.person.lastName || ''}`.trim()
  return {
    id,
    name: fullName || api.username,
    age: "", // Optional: compute from dob if needed
    dateOfBirth: api.person.dob || "",
    gender: api.person.gender || "",
    status: String(api.status),
    avatar: api.person.avatarUrl || "",
    email: api.person.email || "",
    phone: api.person.phone || "",
    address: api.person.address || "",
  }
}

// Lấy thông tin user theo id đúng theo API: GET /users?id=<string>
export const getUserById = async (id: string): Promise<UserProfile> => {
  try {
    const url = `${API_ENDPOINT.getUser}?id=${id}`
    console.log("🌐 Gọi API:", url)
    
    const res = await apiClient.get<ApiEnvelope<UserApiModel>>(API_ENDPOINT.getUser, {
      params: { id },
    })
    
    console.log("📦 Response status:", res.status)
    console.log("📦 Response data:", res.data)
    
    if (res.status !== 200) {
      throw new Error(res.statusText || "Request failed")
    }
    
    const payload = res.data
    // Backend trả về code: 1000 khi thành công (không phải 0)
    if (payload.code !== 1000) {
      throw new Error(payload.message || "API returned error")
    }
    
    const mappedProfile = mapUserApiToProfile(id, payload.data)
    console.log("🔄 Mapped profile:", mappedProfile)
    
    return mappedProfile
  } catch (error: any) {
    console.error("❌ Failed to fetch user by id:", error)
    console.error("❌ Error response:", error?.response)
    console.error("❌ Error message:", error?.message)
    throw error
  }
}

// (Tùy chọn) Giữ mock activities để không ảnh hưởng các phần UI khác
export const getActivities = async (page = 1): Promise<Activity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockActivities)
    }, 300)
  })
}
