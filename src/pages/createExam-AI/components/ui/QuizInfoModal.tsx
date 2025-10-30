import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, Spin } from "antd";
import { QuizInfo, Subject } from "../../types";
import { subjectService } from "../../../Subject/services/subjectService";
import { getUsernameFromToken } from "../../../../utils/auth";
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
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true);
        const { subjects: fetchedSubjects } = await subjectService.getAllSubjects();
        setSubjects(fetchedSubjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setSubjectsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (visible) {
      const currentUser = getUsernameFromToken() || "Admin";
      form.setFieldsValue({
        description: currentUser,
      });
    }
  }, [visible, initialValues, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then(() => {
        const allValues = form.getFieldsValue(true);
        const currentUser = getUsernameFromToken() || "Admin";
        const payload = {
          ...allValues,
          description: allValues.description || currentUser,
          examType: 1, 
        } as QuizInfo;
        form.resetFields();
        onOk(payload);
        setVisible(false);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };
  
  const cancelButtonStyle: React.CSSProperties = {
    border: '1px solid #d9d9d9', 
    color: '#595959', 
    borderRadius: '6px',
    fontWeight: 500
  };

  const nextButtonStyle: React.CSSProperties = {
    backgroundColor: '#6969ff', 
    borderColor: '#6969ff',
    color: 'white',
    borderRadius: '6px',
    fontWeight: 500
  };

  return (
    <Modal
      title={<h2 style={{ fontWeight: 'bold', fontSize: '1.5rem', margin: 0 }}>Tạo Đề Thi mới</h2>}
      open={visible}
      onCancel={onCancel}
      width={600}      
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
              name="examName"
              label={<span style={{fontWeight: '500'}}>Tên đề thi</span>}
              rules={[
                { required: true, message: "Nhập tên đề thi" },
              ]}
              style={{ margin: 0 }}
            >
              <Input placeholder="Nhập tên đề thi..." style={{ borderRadius: '4px' }} />
            </Form.Item>


            <Form.Item
              name="subjectId"
              label={<span style={{fontWeight: '500'}}>Môn học</span>}
              rules={[
                { required: true, message: "Chọn môn học" },
              ]}
              style={{ margin: 0 }}
            >
              <Select
                placeholder="Chọn môn học"
                loading={subjectsLoading}
                options={subjects.map(subject => ({
                  value: subject.id,
                  label: subject.subject_name
                }))}
                notFoundContent={subjectsLoading ? <Spin size="small" /> : "Không có môn học nào"}
                style={{ borderRadius: '4px' }}
              />
            </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '64% 1fr', gap: '24px', marginBottom: '16px' }}>

            <Form.Item
              name="description"
              label={<span style={{fontWeight: '500'}}>Người tạo</span>}
              style={{ margin: 0 }}
            >
              <Input placeholder="Admin" style={{ borderRadius: '4px' }} disabled />
            </Form.Item>

            <Form.Item
              name="grade"
              label={<span style={{fontWeight: '500'}}>Lớp</span>}
              rules={[
                { required: true, message: "Chọn lớp" },
              ]}
              style={{ margin: 0 }}
            >
              <Select
                placeholder="Chọn lớp"
                options={[
                  { value: "10", label: "Lớp 10" },
                  { value: "11", label: "Lớp 11" },
                  { value: "12", label: "Lớp 12" },
                ]}
                style={{ borderRadius: '4px' }}
              />
            </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '64% 1fr', gap: '24px' }}>

            <Form.Item
              name="questionType"
              label={<span style={{fontWeight: '500'}}>Loại câu hỏi</span>}
              initialValue="SINGLE_CHOICE"
              style={{ margin: 0 }}
            >
              <Select
                placeholder="Chọn loại câu hỏi"
                options={[
                  { value: "SINGLE_CHOICE", label: "Trắc nghiệm 1 đáp án" },
                  { value: "MULTIPLE_CHOICE", label: "Trắc nghiệm nhiều đáp án" },
                  { value: "TRUE_FALSE", label: "Đúng/Sai" },
                  { value: "ESSAY", label: "Tự luận" },
                ]}
                style={{ borderRadius: '4px' }}
              />
            </Form.Item>

            <Form.Item
              name="duration"
              label={<span style={{fontWeight: '500'}}>Thời gian (phút)</span>}
              initialValue={60}
              style={{ margin: 0 }}
            >
              <Select
                placeholder="Chọn thời gian"
                options={[
                  { value: 30, label: "30 phút" },
                  { value: 45, label: "45 phút" },
                  { value: 60, label: "60 phút" },
                  { value: 90, label: "90 phút" },
                  { value: 120, label: "120 phút" },
                ]}
                style={{ borderRadius: '4px' }}
              />
            </Form.Item>
        </div>
        
      </Form>
    </Modal>
  );
};

export default QuizInfoModal;