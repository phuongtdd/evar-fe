import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner, Row, Col, Card } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import './BuyTimeModal.css';

interface BuyTimeModalProps {
  show: boolean;
  onHide: () => void;
}

const BuyTimeModal: React.FC<BuyTimeModalProps> = ({ show, onHide }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const timePackages = [
    {
      id: 'basic',
      name: 'Gói Cơ Bản',
      hours: 10,
      price: 50000,
      description: '10 giờ meeting miễn phí',
      features: ['10 giờ meeting', 'Hỗ trợ cơ bản', 'Không giới hạn số người']
    },
    {
      id: 'premium',
      name: 'Gói Premium',
      hours: 50,
      price: 200000,
      description: '50 giờ meeting cao cấp',
      features: ['50 giờ meeting', 'Hỗ trợ ưu tiên', 'Ghi âm cuộc họp', 'Chất lượng HD']
    },
    {
      id: 'unlimited',
      name: 'Gói Không Giới Hạn',
      hours: -1,
      price: 500000,
      description: 'Meeting không giới hạn thời gian',
      features: ['Không giới hạn thời gian', 'Hỗ trợ 24/7', 'Tất cả tính năng', 'Quản lý nâng cao']
    }
  ];

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    setError(null);
  };

  const handlePurchase = async () => {
    if (!selectedPackage) {
      setError('Vui lòng chọn gói thời gian');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // TODO: Gọi API mua thời gian
      // const response = await buyTime({
      //   packageId: selectedPackage
      // });

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      
      // Đóng modal sau 2 giây
      setTimeout(() => {
        onHide();
      }, 2000);
      
    } catch (error: any) {
      setError(`Lỗi mua thời gian: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedPackage(null);
      setError(null);
      setSuccess(false);
      onHide();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <AnimatePresence>
      {show && (
        <Modal 
          show={show} 
          onHide={onHide} 
          centered 
          size="lg" 
          className="buy-time-modal"
          as={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="w-100 text-center fs-5">Mua thêm thời gian</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && (
              <Alert variant="danger" onClose={() => setError(null)} dismissible>
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </Alert>
            )}
            {success && (
              <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
                <i className="fas fa-check-circle me-2"></i>
                Mua thời gian thành công!
              </Alert>
            )}
            <Row className="g-3 mt-2">
              {timePackages.map((pkg) => (
                <Col key={pkg.id} md={4}>
                  <Card 
                    className={`h-100 cursor-pointer ${selectedPackage === pkg.id ? 'border-primary' : ''}`}
                    onClick={() => handleSelectPackage(pkg.id)}
                  >
                    <Card.Body className="text-center">
                      <h5 className="card-title">{pkg.name}</h5>
                      <h3 className="text-primary">{pkg.hours > 0 ? `${pkg.hours} giờ` : 'Không giới hạn'}</h3>
                      <div className="my-3">
                        <span className="h4">{formatPrice(pkg.price)}</span>
                      </div>
                      <ul className="list-unstyled text-start small">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="mb-1">
                            <i className="fas fa-check-circle text-success me-2"></i>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
              Hủy
            </Button>
            <Button 
              variant="primary" 
              onClick={handlePurchase}
              disabled={loading || !selectedPackage}
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Đang xử lý...
                </>
              ) : (
                'Mua ngay'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default BuyTimeModal;
