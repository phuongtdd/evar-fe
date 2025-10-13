"use client";

import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Spin,
  App,
} from "antd";
import { CloseCircleOutlined, SendOutlined } from "@ant-design/icons";
import { CreateRoomModalProps, Room } from "../types";
import { useCreateRoom } from "../hooks/createRoomHook";

const { Option } = Select;
const { TextArea } = Input;

interface UpgradedModalProps extends CreateRoomModalProps {
  mode: "create" | "update";
  initialData?: Room | null;
}

const CreateRoomModal: React.FC<UpgradedModalProps> = ({
  isVisible,
  onClose,
  onRoomCreated,
  mode,
  initialData,
}) => {
  const [form] = Form.useForm();
  const { message: messageApi } = App.useApp();

  // 2. Sử dụng hook để lấy state và các hàm xử lý
  const {
    subjects,
    loadingSubjects,
    creatingRoom,
    fetchSubjects,
    handleCreateRoom,
    handleUpdateRoom,
  } = useCreateRoom();

  useEffect(() => {
    if (isVisible) {
      fetchSubjects();
      if (mode === "update" && initialData) {
        form.setFieldsValue({
          ...initialData,
          subjectId: initialData.subject?.subjectId,
        });
      } else {
        form.resetFields();
      }
    }
  }, [isVisible, form, fetchSubjects, mode, initialData]);
  
  console.log("InitialData", initialData)

  const onFinish = (values: any) => {
    if (mode === "create") {
      handleCreateRoom(values, onRoomCreated, onClose);
    } else if (mode === "update" && initialData) {
      // ✨ NEW: Gọi hàm cập nhật
      handleUpdateRoom(initialData.id, values, onRoomCreated, onClose, );
    } else {
      messageApi.error("Hành động không hợp lệ!");
    }
  };

  // ♻️ MODIFIED: Thay đổi Title và Text của nút dựa vào mode
  const modalTitle =
    mode === "create" ? "Tạo phòng học mới" : "Cập nhật thông tin phòng";
  const submitButtonText = mode === "create" ? "Tạo" : "Cập nhật";

  return (
    <Modal
      open={isVisible}
      onCancel={onClose}
      footer={null}
      closeIcon={
        <CloseCircleOutlined style={{ fontSize: "20px", color: "#999" }} />
      }
      width={500}
      centered
      className="create-room-modal"
    >
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold mb-2">{modalTitle}</h2>
        <p className="text-blue-600 mb-6">Mời bạn bè và cùng nhau học tập</p>
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ capacity: 10 }}
      >
        <Form.Item
          label="Tên phòng :"
          name="roomName"
          rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
        >
          <Input placeholder="Vui lòng nhập tên phòng" />
        </Form.Item>

        <Form.Item label="Mô tả :" name="description">
          <TextArea rows={2} placeholder="Mô tả về phòng học (tùy chọn)" />
        </Form.Item>

        <Form.Item
          label="Số lượng tham gia :"
          name="capacity"
          rules={[
            { required: true, message: "Vui lòng nhập số người tham gia!" },
          ]}
        >
          <InputNumber
            min={1}
            max={100}
            placeholder="Nhập số người tham gia"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="Môn học :"
          name="subjectId"
          rules={[{ required: true, message: "Vui lòng chọn môn học!" }]}
        >
          <Select
            placeholder="Chọn môn học"
            loading={loadingSubjects}
            notFoundContent={
              loadingSubjects ? <Spin size="small" /> : "Không có môn học nào"
            }
          >
            {subjects.map((subject) => (
              <Option key={subject.id} value={subject.id}>
                {subject.subjectName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item className="mt-6">
          <div className="flex justify-end space-x-4">
            <Button onClick={onClose} disabled={creatingRoom}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={creatingRoom}
              icon={<SendOutlined />}
            >
              {submitButtonText}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateRoomModal;
