import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { QuizInfo } from "../../types";
import DropdownSelect from "./DropdownSelect";
import { grades, subjects } from "../../mock/mockData";
import { CloseOutlined } from "@ant-design/icons";

interface QuizInfoModalProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onOk: (info: QuizInfo) => void;
  onCancel: () => void;
  initialValues?: Partial<QuizInfo>;
}

const QuizInfoModal: React.FC<QuizInfoModalProps> = ({
  visible,
  setVisible,
  onOk,
  onCancel,
  initialValues,
}) => {
  const [form] = Form.useForm<QuizInfo>();

  // Set initial values when modal opens
  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [visible, initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onOk(values);
        setVisible(false); // Đóng modal
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  
  // Style cho nút theo hình ảnh
  const cancelButtonStyle: React.CSSProperties = {
    border: '1px solid #d9d9d9', 
    color: '#595959', 
    borderRadius: '6px',
    fontWeight: 500
  };

  const nextButtonStyle: React.CSSProperties = {
    backgroundColor: '#6969ff', // Màu xanh tím tương tự hình ảnh
    borderColor: '#6969ff',
    color: 'white',
    borderRadius: '6px',
    fontWeight: 500
  };

  return (
    <Modal
      title={<h2 style={{ fontWeight: 'bold', fontSize: '1.5rem', margin: 0 }}>Tạo bài Quiz mới</h2>}
      open={visible}
      onCancel={onCancel}
      width={600} // Điều chỉnh kích thước modal để phù hợp
      destroyOnClose
      
      // Tùy chỉnh Footer để khớp với giao diện Hủy và Tiếp theo
      footer={[
        <Button key="cancel" onClick={onCancel} style={cancelButtonStyle}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleOk}
          style={nextButtonStyle}
        >
          Tiếp theo
        </Button>,
      ]}
      closeIcon={<CloseOutlined style={{color: 'red', fontSize: '18px'}} />}
    >
      <Form 
        form={form} 
        layout="vertical" 
        name="quiz_info_form" 
        style={{ padding: '10px 0' }}
      >
        
        <div style={{ display: 'grid', gridTemplateColumns: '64% 1fr', gap: '24px', marginBottom: '16px' }}>
            
            <Form.Item
              name="title"
              label={<span style={{fontWeight: '500'}}>Tên bài quiz</span>}
              rules={[
                { required: true, message: "Nhập tên bài Quiz" },
              ]}
              style={{ margin: 0 }} 
            >
              <Input placeholder="Nhập tên bài Quiz..." style={{ borderRadius: '4px' }} />
            </Form.Item>
            
          
            <Form.Item
              name="subject"
              label={<span style={{fontWeight: '500'}}>Môn học</span>}
              rules={[
                { required: true, message: "Chọn môn học" },
              ]}
              style={{ margin: 0 }}
            >
              <DropdownSelect data={subjects} placeholder="Toán" />
            </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '64% 1fr', gap: '24px' }}>
            
            <Form.Item
              name="description"
              label={<span style={{fontWeight: '500'}}>Người tạo</span>}
              rules={[
                { required: true, message: "Người tạo" },
              ]}
              style={{ margin: 0 }} 
            >
              <Input placeholder="Admin" style={{ borderRadius: '4px' }} />
            </Form.Item>

            <Form.Item
              name="grade"
              label={<span style={{fontWeight: '500'}}>Lớp</span>}
              rules={[
                { required: true, message: "Chọn lớp" },
              ]}
              style={{ margin: 0 }}
            >
              <DropdownSelect data={grades} placeholder="12" />
            </Form.Item>
        </div>
        
      </Form>
    </Modal>
  );
};

export default QuizInfoModal;