"use client";
import {
  Card,
  Button,
  Dropdown,
  Tag,
  Spin,
  Empty,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import {
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileTextOutlined,
  FileImageOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useMaterials, useQuizzes, useFlashcards } from "../../hooks";
import { StudyMaterial, Quiz, Flashcard } from "../../types";
import {
  FILE_TYPE_LABELS,
  STATUS_LABELS,
  DIFFICULTY_LABELS,
  formatFileSize,
  formatDate,
} from "../../mock/mockData";

interface MaterialsGridProps {
  type: "quiz" | "material" | "flashcard" | "view-pdf" | "notes";
}

export default function MaterialsGrid({ type }: MaterialsGridProps) {
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<
    StudyMaterial | Quiz | Flashcard | null
  >(null);
  const [form] = Form.useForm();

  const materialsHook = useMaterials();
  const quizzesHook = useQuizzes();
  const flashcardsHook = useFlashcards();

  const getCurrentData = () => {
    switch (type) {
      case "material":
        return materialsHook.data?.data || [];
      case "quiz":
        return quizzesHook.data || [];
      case "flashcard":
        return flashcardsHook.data || [];
      default:
        return [];
    }
  };

  const getCurrentLoading = () => {
    switch (type) {
      case "material":
        return materialsHook.loading;
      case "quiz":
        return quizzesHook.loading;
      case "flashcard":
        return flashcardsHook.loading;
      default:
        return false;
    }
  };

  const handleEdit = (item: StudyMaterial | Quiz | Flashcard) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setEditModalVisible(true);
  };

  const handleDelete = async (item: StudyMaterial | Quiz | Flashcard) => {
    Modal.confirm({
      title: "Are you sure you want to delete this item?",
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          switch (type) {
            case "material":
              await materialsHook.deleteMaterial(item.id);
              break;
            case "quiz":
              await quizzesHook.deleteQuiz(item.id);
              break;
            case "flashcard":
              await flashcardsHook.deleteFlashcard(item.id);
              break;
          }
        } catch (error) {
          console.error("Delete error:", error);
        }
      },
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      if (!editingItem) return;

      switch (type) {
        case "material":
          await materialsHook.updateMaterial(editingItem.id, values);
          break;
        case "quiz":
          await quizzesHook.updateQuiz(editingItem.id, values);
          break;
        case "flashcard":
          await flashcardsHook.updateFlashcard(editingItem.id, values);
          break;
      }

      setEditModalVisible(false);
      setEditingItem(null);
      form.resetFields();
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileTextOutlined className="!text-red-500" />;
      case "image":
        return <FileImageOutlined className="!text-green-500" />;
      default:
        return <FileOutlined className="!text-gray-500" />;
    }
  };

  const getMenuItems = (item: StudyMaterial | Quiz | Flashcard) => [
    {
      key: "view",
      label: "View",
      icon: <EyeOutlined />,
      onClick: () => console.log("View", item.id),
    },
    {
      key: "edit",
      label: "Edit",
      icon: <EditOutlined />,
      onClick: () => handleEdit(item),
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => handleDelete(item),
    },
  ];

  const renderMaterialCard = (item: StudyMaterial) => (
    <div
      key={item.id}
      className="!relative !group !cursor-pointer !transition-all !hover:shadow-lg !bg-white !rounded-lg !border !border-gray-200 !overflow-hidden"
    >
      <div className="!bg-gray-100 !aspect-video !flex !items-center !justify-center !overflow-hidden !relative">
        <div className="!w-full !h-full !bg-gradient-to-br !from-gray-200 !to-gray-300 !flex !items-center !justify-center !flex-col !gap-2">
          {getFileIcon(item.type)}
          <span className="!text-gray-500 !text-sm">
            {FILE_TYPE_LABELS[item.type]}
          </span>
        </div>
        <div className="!absolute !inset-0 !bg-black/0 !group-hover:bg-black/10 !transition-colors" />
        <div className="!absolute !top-2 !right-2">
          <Dropdown
            menu={{ items: getMenuItems(item) }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined />}
              className="!text-gray-400 !hover:text-gray-600 !bg-white/80 !hover:bg-white"
            />
          </Dropdown>
        </div>
      </div>
      <div className="!p-4">
        <h3 className="!font-semibold !text-gray-900 !mb-1 !line-clamp-2">
          {item.title}
        </h3>
        {item.description && (
          <p className="!text-sm !text-gray-500 !mb-2 !line-clamp-2">
            {item.description}
          </p>
        )}
        <div className="!flex !items-center !justify-between !mb-2">
          <Tag
            color={
              item.status === "ready"
                ? "green"
                : item.status === "processing"
                ? "blue"
                : "red"
            }
          >
            {STATUS_LABELS[item.status]}
          </Tag>
          <span className="!text-xs !text-gray-400">
            {formatFileSize(item.fileSize)}
          </span>
        </div>
        <div className="!flex !flex-wrap !gap-1 !mb-2">
          {item.tags.slice(0, 3).map((tag) => (
            <Tag key={tag} className="!text-xs">
              {tag}
            </Tag>
          ))}
          {item.tags.length > 3 && (
            <Tag className="!text-xs">+{item.tags.length - 3}</Tag>
          )}
        </div>
        <p className="!text-xs !text-gray-400">{formatDate(item.uploadDate)}</p>
      </div>
    </div>
  );

  const renderQuizCard = (item: Quiz) => (
    <Card
      key={item.id}
      className="!border !border-gray-200 !rounded-lg !shadow-sm !hover:shadow-md !transition-all !cursor-pointer [&_.ant-card-body]:!p-4"
      hoverable
    >
      <div className="!flex !items-start !justify-between">
        <div className="!flex-1">
          <h3 className="!font-semibold !text-gray-900 !mb-1">{item.title}</h3>
          <p className="!text-sm !text-gray-500 !mb-3">{item.description}</p>
          <div className="!flex !items-center !gap-2 !mb-2">
            <Tag color="blue">{DIFFICULTY_LABELS[item.difficulty]}</Tag>
            <Tag color="green">{item.questions.length} questions</Tag>
            <Tag color="orange">{item.estimatedTime} min</Tag>
          </div>
          <p className="!text-xs !text-gray-400">
            {formatDate(item.createdAt)}
          </p>
        </div>
        <Dropdown
          menu={{ items: getMenuItems(item) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            size="small"
            icon={<MoreOutlined />}
            className="!text-gray-400 !hover:text-gray-600"
          />
        </Dropdown>
      </div>
    </Card>
  );

  const renderFlashcardCard = (item: Flashcard) => (
    <Card
      key={item.id}
      className="!border !border-gray-200 !rounded-lg !shadow-sm !hover:shadow-md !transition-all !cursor-pointer [&_.ant-card-body]:!p-4"
      hoverable
    >
      <div className="!flex !items-start !justify-between">
        <div className="!flex-1">
          <h3 className="!font-semibold !text-gray-900 !mb-1">{item.front}</h3>
          <p className="!text-sm !text-gray-500 !mb-3 !line-clamp-2">
            {item.back}
          </p>
          <div className="!flex !items-center !gap-2 !mb-2">
            <Tag color="blue">{DIFFICULTY_LABELS[item.difficulty]}</Tag>
            <Tag color="green">
              {Math.round(item.successRate * 100)}% success
            </Tag>
            <Tag color="purple">{item.reviewCount} reviews</Tag>
          </div>
          <p className="!text-xs !text-gray-400">
            {formatDate(item.createdAt)}
          </p>
        </div>
        <Dropdown
          menu={{ items: getMenuItems(item) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            size="small"
            icon={<MoreOutlined />}
            className="!text-gray-400 !hover:text-gray-600"
          />
        </Dropdown>
      </div>
    </Card>
  );

  const currentData = getCurrentData();
  const loading = getCurrentLoading();

  if (loading) {
    return (
      <div className="!flex !justify-center !items-center !h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (currentData.length === 0) {
    return <Empty description="No items found" className="!py-12" />;
  }

  return (
    <>
      <div
        className={`!grid !gap-6 ${
          type === "material" ? "!grid-cols-3" : "!grid-cols-2"
        }`}
      >
        {currentData.map((item) => {
          switch (type) {
            case "material":
              return renderMaterialCard(item as StudyMaterial);
            case "quiz":
              return renderQuizCard(item as Quiz);
            case "flashcard":
              return renderFlashcardCard(item as Flashcard);
            default:
              return null;
          }
        })}
      </div>

      <Modal
        title={`Edit ${
          type === "material"
            ? "Material"
            : type === "quiz"
            ? "Quiz"
            : "Flashcard"
        }`}
        open={editModalVisible}
        onOk={handleSave}
        onCancel={() => {
          setEditModalVisible(false);
          setEditingItem(null);
          form.resetFields();
        }}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Enter title" />
          </Form.Item>

          {type === "material" && (
            <>
              <Form.Item name="description" label="Description">
                <Input.TextArea placeholder="Enter description" rows={3} />
              </Form.Item>
              <Form.Item name="tags" label="Tags">
                <Select
                  mode="tags"
                  placeholder="Enter tags"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </>
          )}

          {type === "quiz" && (
            <>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  { required: true, message: "Please enter a description" },
                ]}
              >
                <Input.TextArea placeholder="Enter description" rows={3} />
              </Form.Item>
              <Form.Item
                name="difficulty"
                label="Difficulty"
                rules={[
                  { required: true, message: "Please select difficulty" },
                ]}
              >
                <Select placeholder="Select difficulty">
                  <Select.Option value="easy">Easy</Select.Option>
                  <Select.Option value="medium">Medium</Select.Option>
                  <Select.Option value="hard">Hard</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}

          {type === "flashcard" && (
            <>
              <Form.Item
                name="front"
                label="Front"
                rules={[{ required: true, message: "Please enter front text" }]}
              >
                <Input.TextArea placeholder="Enter front text" rows={2} />
              </Form.Item>
              <Form.Item
                name="back"
                label="Back"
                rules={[{ required: true, message: "Please enter back text" }]}
              >
                <Input.TextArea placeholder="Enter back text" rows={2} />
              </Form.Item>
              <Form.Item
                name="difficulty"
                label="Difficulty"
                rules={[
                  { required: true, message: "Please select difficulty" },
                ]}
              >
                <Select placeholder="Select difficulty">
                  <Select.Option value="easy">Easy</Select.Option>
                  <Select.Option value="medium">Medium</Select.Option>
                  <Select.Option value="hard">Hard</Select.Option>
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  );
}
