import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import './ChangePasswordModal.css';

interface ChangePasswordModalProps {
  show: boolean;
  onHide: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ show, onHide }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword) {
      setError('Vui lòng nhập mật khẩu hiện tại');
      return false;
    }
    if (!formData.newPassword) {
      setError('Vui lòng nhập mật khẩu mới');
      return false;
    }
    if (formData.newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    if (formData.currentPassword === formData.newPassword) {
      setError('Mật khẩu mới phải khác mật khẩu hiện tại');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // TODO: Gọi API đổi mật khẩu
      // const response = await changePassword({
      //   currentPassword: formData.currentPassword,
      //   newPassword: formData.newPassword
      // });

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Đóng modal sau 2 giây
      setTimeout(() => {
        onHide();
      }, 2000);
      
    } catch (error: any) {
      setError(`Lỗi đổi mật khẩu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setError(null);
      setSuccess(false);
      onHide();
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <Modal 
          show={show} 
          onHide={onHide} 
          centered 
          className="change-password-modal"
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="w-100 text-center fs-5">Đổi mật khẩu</Modal.Title>
          </Modal.Header>
          <form onSubmit={handleSubmit}>
            <Modal.Body className="pt-0">
              {/* Thông báo lỗi và thành công */}
              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" className="mb-3">
                  Đổi mật khẩu thành công!
                </Alert>
              )}

              <div className="form-section">
                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu hiện tại</Form.Label>
                  <Form.Control
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu hiện tại"
                    disabled={loading}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu mới"
                    disabled={loading}
                    required
                    minLength={6}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Nhập lại mật khẩu mới"
                    disabled={loading}
                    required
                  />
                </Form.Group>
              </div>
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0">
              <Button variant="outline-secondary" className="px-4" onClick={handleClose} disabled={loading}>
                Hủy
              </Button>
              <Button variant="primary" type="submit" className="px-4" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Đang xử lý...
                  </>
                ) : (
                  'Đổi mật khẩu'
                )}
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ChangePasswordModal;
