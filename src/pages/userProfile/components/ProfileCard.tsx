import React, { useState, useEffect } from "react"
import { Button } from "react-bootstrap"
import type { UserProfile } from "../types"
import "../styles/ProfileCard.css"
import EditProfileModal from "./EditProfileModal"

interface ProfileCardProps {
  profile: UserProfile
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile: initialProfile }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);
  
  const nameParts = profile.name.split(' ')
  const lastName = nameParts[nameParts.length - 1] || ''
  const firstName = nameParts.slice(0, -1).join(' ') || ''
  
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    
    window.dispatchEvent(new CustomEvent('avatarUpdated', { 
      detail: { 
        avatar: updatedProfile.avatar,
        name: updatedProfile.name
      } 
    }));
  };

  return (
    <div className="profile-card">
      <div className="basic-info-section">
        <div className="basic-info-header">
          <h6 className="basic-info-title">
            Thông tin cơ bản
          </h6>
          <Button 
            variant="link" 
            className="edit-button p-0" 
            onClick={() => setShowEditModal(true)}
          >
            ✏️
          </Button>
        </div>
        
        {/* Khung chứa avatar và thông tin cá nhân */}
        <div className="profile-content">
          {/* Ảnh đại diện */}
          <div className="avatar-container">
            <img 
              src={profile.avatar || "/placeholder-user.jpg"} 
              alt={profile.name}
              className="avatar-image"
            />
          </div>

          {/* Thông tin chi tiết bên phải avatar */}
          <div className="profile-details">
            <div className="profile-detail-row">
              <span className="profile-detail-label">Họ và tên đệm :</span>
              <span className="profile-detail-value">{firstName || '-'}</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Tên :</span>
              <span className="profile-detail-value">{lastName || '-'}</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Ngày sinh :</span>
              <span className="profile-detail-value">{profile.dateOfBirth || '-'}</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Giới tính :</span>
              <span className="profile-detail-value">{profile.gender || '-'}</span>
            </div>
            <div className="profile-detail-row">
              <span className="profile-detail-label">Trạng thái :</span>
              <span className={`profile-detail-value ${profile.status === '1' ? 'status-active' : 'status-inactive'}`}>
                {profile.status === '1' ? 'Đang hoạt động' : 'Không hoạt động'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {profile.face && (
        <div className="face-section" style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h6 className="mb-3" style={{ fontWeight: 'bold' }}>
            Ảnh mặt (để xác thực)
          </h6>
          <div className="text-center">
            <img 
              src={profile.face} 
              alt="Face verification image"
              style={{ 
                maxWidth: '200px', 
                maxHeight: '200px', 
                borderRadius: '8px',
                border: '2px solid #dee2e6'
              }}
            />
          </div>
        </div>
      )}

      {/* Khung thông tin liên hệ */}
      <div className="contact-section">
        <h6 className="contact-title">
          Thông tin Liên hệ
        </h6>
        
        <div className="contact-list">
          <div className="contact-item">
            <span className="contact-icon">📧</span>
            <span className="contact-label">Email :</span>
            <span className="contact-value">{profile.email || '-'}</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <span className="contact-label">Số điện thoại :</span>
            <span className="contact-value">{profile.phone || '-'}</span>
          </div>
          <div className="contact-item">
            <span className="contact-icon">📍</span>
            <span className="contact-label">Địa chỉ :</span>
            <span className="contact-value">{profile.address || '-'}</span>
          </div>
        </div>
      </div>
      <EditProfileModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  )
}

export default ProfileCard
