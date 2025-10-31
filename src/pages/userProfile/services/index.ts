import apiClient from "../../../configs/axiosConfig"
import { API_ENDPOINT, IMGBB_API_KEY, IMGBB_UPLOAD_URL } from "../constants"
import { mockActivities } from "../mock"
import type { ApiEnvelope, UserApiModel, UserProfile, Activity, UpdateUserRequest, ImgbbResponse } from "../types"


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
    face: api.person.faceUrl || "",
    email: api.person.email || "",
    phone: api.person.phone || "",
    address: api.person.address || "",
  }
}

// Lấy thông tin user theo id đúng theo API: GET /users?id=<string>
export const getUserById = async (id: string): Promise<UserProfile> => {
  try {
    const url = `${API_ENDPOINT.getUser}?id=${id}`
    // console.log("🌐 Gọi API:", url)
    
    const res = await apiClient.get<ApiEnvelope<UserApiModel>>(API_ENDPOINT.getUser, {
      params: { id },
    })
    
    console.log("Response status:", res.status)
    console.log("Response data:", res.data)
    
    if (res.status !== 200) {
      throw new Error(res.statusText || "Request failed")
    }
    
    const payload = res.data
    // Backend trả về code: 1000 khi thành công (không phải 0)
    if (payload.code !== 1000) {
      throw new Error(payload.message || "API returned error")
    }
    
    const mappedProfile = mapUserApiToProfile(id, payload.data)
    console.log(" Mapped profile:", mappedProfile)
    
    return mappedProfile
  } catch (error: any) {
    console.error(" Failed to fetch user by id:", error)
    console.error("Error response:", error?.response)
    console.error(" Error message:", error?.message)
    throw error
  }
}

// Upload ảnh lên IMGBB và trả về cả URL và delete URL
export const uploadImageToImgbb = async (file: File): Promise<{url: string, deleteUrl: string}> => {
  try {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('key', IMGBB_API_KEY)

    console.log(" Uploading image to IMGBB...")
    
    const response = await fetch(IMGBB_UPLOAD_URL, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const data: ImgbbResponse = await response.json()
    
    if (!data.success) {
      throw new Error('Upload failed: IMGBB API returned error')
    }

    console.log(" Image uploaded successfully:", data.data.url)
    console.log(" Delete URL:", data.data.delete_url)
    
    return {
      url: data.data.url,
      deleteUrl: data.data.delete_url
    }
  } catch (error: any) {
    console.error("Failed to upload image:", error)
    throw error
  }
}

export const updateUserProfile = async (updateData: UpdateUserRequest): Promise<UserProfile> => {
  try {
    console.log(" Updating user profile:", updateData)
    
    const response = await apiClient.put<ApiEnvelope<UserApiModel>>(
      API_ENDPOINT.updateUser,
      updateData
    )
    
    console.log(" Update response:", response.data)
    
    if (response.status !== 200) {
      throw new Error(response.statusText || "Update failed")
    }
    
    const payload = response.data
    if (payload.code !== 1000) {
      throw new Error(payload.message || "API returned error")
    }
    
    const mappedProfile = mapUserApiToProfile(updateData.id, payload.data)
    console.log(" Profile updated successfully:", mappedProfile)
    
    return mappedProfile
  } catch (error: any) {
    console.error(" Failed to update user profile:", error)
    throw error
  }
}

// (Tùy chọn) Giữ mock activities để không ảnh hưởng các phần UI khác
export const getActivities = async (page = 1): Promise<Activity[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockActivities)
      // console.log("hihi")
    }, 300)
  })
}
