// Mô hình dữ liệu hiển thị trên UI (dùng cho phần giao diện người dùng)
export interface UserProfile {
  id: string
  name: string
  age: string
  dateOfBirth: string
  gender: string
  status: string
  avatar: string
  face: string
  email: string
  phone: string
  address: string
}

export interface Assessment {
  label: string
  value: number
  max: number
  color: string
}

export interface Subject {
  name: string
  color: string
}

export interface Activity {
  id: string
  name: string
  time: string
  type: string
  typeColor: string
  subject: string
  subjectColor: string
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
}

// ================= Kiểu dữ liệu API (phản ánh đúng schema của backend) =================

// Khung dữ liệu phản hồi chung từ backend
export interface ApiEnvelope<T> {
  code: number
  message: string
  data: T
  pageMetadata?: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

// Thực thể person được backend trả về (các field có thể null)
export interface PersonApiModel {
  firstName: string | null
  lastName: string | null
  phone: string | null
  email: string | null
  gender: string | null
  dob: string | null
  description: string | null
  isAdmin: boolean
  avatarUrl: string | null
  faceUrl: string | null
  provinceCode: string | null
  wardCode: string | null
  address: string | null
  createdBy: string | null
  updatedBy: string | null
  createdDate: string | null
  updatedDate: string | null
}

// Thực thể user được backend trả về
export interface UserApiModel {
  username: string
  status: number
  person: PersonApiModel
}

// Interface cho request update user
export interface UpdateUserRequest {
  id: string
  password?: string
  person: {
    firstName?: string
    lastName?: string
    phone?: string
    dob?: string
    email?: string
    gender?: string
    avatarUrl?: string
    faceUrl?: string
    provinceCode?: string
    wardCode?: string
    address?: string
    description?: string
  }
}

// Interface cho response từ IMGBB API
export interface ImgbbResponse {
  data: {
    id: string
    title: string
    url_viewer: string
    url: string
    display_url: string
    width: number
    height: number
    size: number
    time: string
    expiration: string
    image: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    thumb: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    medium: {
      filename: string
      name: string
      mime: string
      extension: string
      url: string
    }
    delete_url: string
  }
  success: boolean
  status: number
}