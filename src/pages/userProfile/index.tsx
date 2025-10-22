import type React from "react"
import MainLayout from "./components/MainLayout"
import { useUserProfile } from "./hooks/useUserProfile"
import { useActivities } from "./hooks/useActivities"
import { mockAssessments, mockSubjects } from "./mock"
import "./styles/index.css"

const index: React.FC = () => {
  const { profile, loading: profileLoading, error: profileError } = useUserProfile()
  const { activities, currentPage, totalPages, goToPage } = useActivities()

  // Hiển thị loading state
  if (profileLoading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Đang tải thông tin...</div>
        <div className="loading-spinner"></div>
      </div>
    )
  }

  // Hiển thị error state với thông tin chi tiết để debug
  if (profileError || !profile) {
    return (
      <div className="error-container">
        <div className="error-card">
          <h2 className="error-title">
            ❌ Lỗi tải thông tin người dùng
          </h2>
          <div className="error-details">
            <strong>Chi tiết lỗi:</strong>
            <pre className="error-pre">
              {profileError || 'Không tìm thấy thông tin người dùng'}
            </pre>
          </div>
          <div className="error-suggestions">
            <strong>Gợi ý khắc phục:</strong>
            <ul className="error-list">
              <li>Kiểm tra JWT token trong localStorage có hợp lệ không</li>
              <li>Kiểm tra backend API có đang chạy không (http://localhost:8080)</li>
              <li>Kiểm tra network tab trong DevTools để xem request có lỗi gì</li>
              <li>Kiểm tra console để xem chi tiết lỗi</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            🔄 Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="user-profile-page">
      <MainLayout
        profile={profile}
        assessments={mockAssessments}
        subjects={mockSubjects}
        activities={activities}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </div>
  )
}

export default index

