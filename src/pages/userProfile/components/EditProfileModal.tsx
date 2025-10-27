import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserProfile, UpdateUserRequest } from '../types';
import { uploadImageToImgbb, updateUserProfile } from '../services';
import { getUserIdFromToken } from '../utils/auth';
import '../styles/EditProfileModal.css';

interface EditProfileModalProps {
  show: boolean;
  onHide: () => void;
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ show, onHide, profile, onSave }) => {
  const [formData, setFormData] = React.useState<UserProfile>({ ...profile });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFaceFile, setSelectedFaceFile] = useState<File | null>(null);
  const [faceImagePreview, setFaceImagePreview] = useState<string>('');
  const faceFileInputRef = useRef<HTMLInputElement>(null);
  const [deleteFaceImage, setDeleteFaceImage] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Chỉ được phép tải lên file ảnh (JPEG, PNG, GIF, WebP)');
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('Kích thước file không được vượt quá 5MB');
        return;
      }

      // Lưu file để upload sau
      setSelectedFile(file);
      setError(null);

      // Tạo preview ngay lập tức
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset input để có thể chọn cùng file nếu cần
    e.target.value = '';
  };

  const handleFaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Chỉ được phép tải lên file ảnh (JPEG, PNG, GIF, WebP)');
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('Kích thước file không được vượt quá 5MB');
        return;
      }

      // Lưu file để upload sau
      setSelectedFaceFile(file);
      setError(null);

      // Tạo preview ngay lập tức
      const reader = new FileReader();
      reader.onload = (e) => {
        setFaceImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset input để có thể chọn cùng file nếu cần
    e.target.value = '';
  };

  const handleDeleteFaceImage = () => {
    setDeleteFaceImage(true);
    setSelectedFaceFile(null);
    setFaceImagePreview('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      // Tách tên thành firstName và lastName
      const nameParts = formData.name.split(' ');
      const lastName = nameParts[nameParts.length - 1] || '';
      const firstName = nameParts.slice(0, -1).join(' ') || '';

      // Tạo update request - chỉ gửi những trường đã thay đổi
      const updateData: UpdateUserRequest = {
        id: userId,
        person: {}
      };

      // Chỉ thêm những trường đã thay đổi so với profile gốc
      if (firstName !== profile.name.split(' ').slice(0, -1).join(' ')) {
        updateData.person.firstName = firstName;
      }
      if (lastName !== profile.name.split(' ').pop()) {
        updateData.person.lastName = lastName;
      }
      if (formData.dateOfBirth !== profile.dateOfBirth) {
        updateData.person.dob = formData.dateOfBirth;
      }
      if (formData.gender !== profile.gender) {
        updateData.person.gender = formData.gender;
      }
      if (formData.email !== profile.email) {
        updateData.person.email = formData.email;
      }
      if (formData.phone !== profile.phone) {
        updateData.person.phone = formData.phone;
      }
      if (formData.address !== profile.address) {
        updateData.person.address = formData.address;
      }

      if (selectedFile) {
        try {
          const imageResult = await uploadImageToImgbb(selectedFile);
          updateData.person.avatarUrl = imageResult.url;
        } catch (uploadError: any) {
          throw new Error(`Lỗi upload ảnh đại diện: ${uploadError.message}`);
        }
      }

      if (selectedFaceFile && !deleteFaceImage) {
        try {
          const imageResult = await uploadImageToImgbb(selectedFaceFile);
          updateData.person.faceUrl = imageResult.url;
        } catch (uploadError: any) {
          throw new Error(`Lỗi upload ảnh mặt: ${uploadError.message}`);
        }
      }

      if (deleteFaceImage) {
        updateData.person.faceUrl = '';
      }

      const updatedProfile = await updateUserProfile(updateData);
      
      setSuccess(true);
      onSave(updatedProfile);
      
      setTimeout(() => {
        setSelectedFile(null);
        setImagePreview('');
        setSelectedFaceFile(null);
        setFaceImagePreview('');
        setDeleteFaceImage(false);
        onHide();
      }, 1000);
      
    } catch (error: any) {
      setError(`Lỗi cập nhật: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormData({ ...profile });
  }, [profile]);

  useEffect(() => {
    if (show) {
      setSelectedFile(null);
      setImagePreview('');
      setSelectedFaceFile(null);
      setFaceImagePreview('');
      setDeleteFaceImage(false);
      setError(null);
      setSuccess(false);
    }
  }, [show]);

  // Tách tên thành họ và tên
  const nameParts = formData.name.split(' ');
  const lastName = nameParts[nameParts.length - 1] || '';
  const firstName = nameParts.slice(0, -1).join(' ') || '';

  return (
    <AnimatePresence>
      {show && (
        <Modal 
          show={show} 
          onHide={onHide} 
          centered 
          size="lg" 
          className="edit-profile-modal"
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Modal.Header closeButton className="border-0 pt-3 pe-3" />
      <form onSubmit={handleSubmit}>
        <Modal.Body className="pt-3">
          {error && (
            <Alert variant="danger" className="mb-3" onClose={() => setError(null)} dismissible>
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mb-3" onClose={() => setSuccess(false)} dismissible>
              <i className="fas fa-check-circle me-2"></i>
              Cập nhật thông tin thành công!
            </Alert>
          )}
          
          {/* Profile Image Upload */}
          <div className="text-center mb-4">
            <div className="position-relative d-inline-block">
              <div 
                className="avatar-upload-container"
                onClick={() => !loading && fileInputRef.current?.click()}
                style={{ cursor: 'pointer' }}
              >
                <img 
                  src={imagePreview || formData.avatar || "/placeholder-user.jpg"} 
                  alt={formData.name}
                  className="edit-avatar"
                />
                <div className="avatar-upload-overlay">
                  <div className="plus-icon-container">
                    <i className="fas fa-plus"></i>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="d-none"
                  disabled={loading}
                />
              </div>
            </div>
            <h6 className="mt-3 mb-0 fw-bold">Ảnh đại diện</h6>
            {imagePreview && (
              <div className="mt-2">
                <small className="text-info">
                  <i className="fas fa-info-circle me-1"></i>
                  Ảnh mới sẽ được tải lên khi bạn lưu thay đổi
                </small>
              </div>
            )}
          </div>

          <div className="text-center mb-4">
            <h6 className="mb-2 fw-bold">Ảnh mặt (để xác thực)</h6>
            <div className="position-relative d-inline-block">
              {(faceImagePreview || formData.face) && !deleteFaceImage ? (
                <div className="text-center">
                  <img 
                    src={faceImagePreview || formData.face || "/placeholder-user.jpg"} 
                    alt="Face image"
                    className="edit-avatar"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                  <div className="mt-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleDeleteFaceImage}
                      disabled={loading}
                    >
                      <i className="fas fa-trash me-1"></i>
                      Xóa ảnh mặt
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="avatar-upload-container"
                  onClick={() => !loading && faceFileInputRef.current?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src="/placeholder-user.jpg" 
                    alt="Face image"
                    className="edit-avatar"
                  />
                  <div className="avatar-upload-overlay">
                    <div className="plus-icon-container">
                      <i className="fas fa-plus"></i>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={faceFileInputRef}
                    onChange={handleFaceFileChange}
                    accept="image/*"
                    className="d-none"
                    disabled={loading}
                  />
                </div>
              )}
            </div>
            {faceImagePreview && (
              <div className="mt-2">
                <small className="text-info">
                  <i className="fas fa-info-circle me-1"></i>
                  Ảnh mới sẽ được tải lên khi bạn lưu thay đổi
                </small>
              </div>
            )}
          </div>

          <div className="form-section compact-form">
            <h6 className="section-title">Thông tin cá nhân</h6>
            <div className="form-grid">
              <Form.Group>
                <Form.Label>Họ và tên đệm</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => {
                    const newName = e.target.value + (lastName ? ' ' + lastName : '');
                    setFormData({...formData, name: newName});
                  }}
                  className="form-control-sm"
                />
              </Form.Group>
              
              <Form.Group>
                <Form.Label>Tên</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => {
                    const newName = (firstName ? firstName + ' ' : '') + e.target.value;
                    setFormData({...formData, name: newName});
                  }}
                  className="form-control-sm"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Ngày sinh</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ''}
                  onChange={handleChange}
                  className="form-control-sm"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Giới tính</Form.Label>
                <Form.Select 
                  name="gender"
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="form-control-sm"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <div className="form-section mt-3 compact-form">
            <h6 className="section-title">Thông tin liên hệ</h6>
            <div className="form-grid">
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="form-control-sm"
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="form-control-sm"
                />
              </Form.Group>

              <Form.Group className="col-span-2">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="form-control-sm"
                />
              </Form.Group>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" className="px-4" onClick={onHide} disabled={loading}>
            Hủy
          </Button>
          <Button variant="primary" type="submit" className="px-4" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Đang lưu...
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
