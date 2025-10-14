import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";

type Props = {
  open: boolean;
  onCancel: () => void;
  onNext: (values: any) => void;
};

const subjects = [
  { label: "Toán", value: "toan" },
  { label: "Lý", value: "ly" },
  { label: "Hóa", value: "hoa" },
];

const grades = [
  { label: "12", value: "12" },
  { label: "11", value: "11" },
  { label: "10", value: "10" },
];

export default function CreateQuizModal({ open, onCancel, onNext }: Props) {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      footer={null}
      closable={false}
      centered
      width={480}
      className="rounded-xl"
      bodyStyle={{ padding: 40 }}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="text-3xl font-bold">Tạo bài Quiz mới</div>
        <Button
          type="text"
          icon={<CloseCircleFilled style={{ color: "#FF3B30", fontSize: 28 }} />}
          onClick={onCancel}
        />
      </div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onNext}
        initialValues={{ creator: "Admin", subject: "toan", grade: "12" }}
      >
        <div className="grid grid-cols-2 gap-6">
          <Form.Item
            label="Tên bài quiz"
            name="title"
            className="col-span-1"
            rules={[{ required: true, message: "Nhập tên bài quiz" }]}
          >
            <Input placeholder="Họ tên ...." size="large" />
          </Form.Item>
          <Form.Item
            label="Môn học"
            name="subject"
            className="col-span-1"
            rules={[{ required: true, message: "Chọn môn học" }]}
          >
            <Select options={subjects} size="large" />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <Form.Item
            label="Tạo bởi"
            name="creator"
            className="col-span-1"
          >
            <Input disabled size="large" />
          </Form.Item>
          <Form.Item
            label="Lớp"
            name="grade"
            className="col-span-1"
            rules={[{ required: true, message: "Chọn lớp" }]}
          >
            <Select options={grades} size="large" />
          </Form.Item>
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <Button
            type="default"
            size="large"
            className="border-blue-500 text-blue-500 font-bold"
            onClick={onCancel}
          >
            Hủy
          </Button>
          <Button
            type="primary"
            size="large"
            className="bg-blue-500 font-bold"
            htmlType="submit"
          >
            Tiếp theo
          </Button>
        </div>
      </Form>
    </Modal>
  );
}