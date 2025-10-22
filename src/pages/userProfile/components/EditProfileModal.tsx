import React from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import type { UserProfile } from '../types';
import '../styles/EditProfileModal.css';

interface EditProfileModalProps {
  show: boolean;
  onHide: () => void;
  profile: UserProfile;
  onSave: (updatedProfile: UserProfile) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ show, onHide, profile, onSave }) => {
  const [formData, setFormData] = React.useState<UserProfile>({ ...profile });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onHide();
  };

  // Tách tên thành họ và tên
  const nameParts = formData.name.split(' ');
  const lastName = nameParts[nameParts.length - 1] || '';
  const firstName = nameParts.slice(0, -1).join(' ') || '';

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="edit-profile-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fs-5">Chỉnh sửa thông tin cá nhân</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body className="pt-0">
          <div className="text-center mb-3">
            <div className="position-relative d-inline-block">
              <img 
                src={formData.avatar || "/placeholder-user.jpg"} 
                alt={formData.name}
                className="edit-avatar"
              />
              <button type="button" className="btn btn-light btn-sm rounded-circle position-absolute bottom-0 end-0">
                <i className="fas fa-camera"></i>
              </button>
            </div>
            <h6 className="mt-2 mb-0 fw-bold">{formData.name}</h6>
            <small className="text-muted">ID: {formData.id || 'N/A'}</small>
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
          <Button variant="outline-secondary" className="px-4" onClick={onHide}>
            Hủy
          </Button>
          <Button variant="primary" type="submit" className="px-4">
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
