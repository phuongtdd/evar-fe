import { EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Input, Select, TimePicker } from "antd";
import { useEffect, useState } from "react";
import { QuizProps, typeQuiz, Subject } from "../../types";
import { subjectService } from "../../../Subject/services/subjectService";
import { grades } from "../../mock/mockData";
import dayjs from "dayjs";

const QuizInfor = ({ quiz, onEdit }: QuizProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuiz, setEditedQuiz] = useState<typeQuiz>(quiz);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { subjects: fetched } = await subjectService.getAllSubjects();
        setSubjects(fetched);
      } catch (e) {
        console.error("Failed to fetch subjects", e);
      }
    };
    fetchSubjects();
  }, []);

  const handleSave = () => {
    onEdit?.(editedQuiz);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedQuiz(quiz);
    setIsEditing(false);
  };

  const handleFieldChange = (field: keyof typeQuiz, value: any) => {
    setEditedQuiz((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div className="flex">
            <span className="text-gray-600 w-40 flex-shrink-0">Tên Quiz :</span>
            {isEditing ? (
              <Input
                value={editedQuiz.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                className="flex-1"
              />
            ) : (
              <span className="text-gray-900 font-medium">{quiz.name}</span>
            )}
          </div>
          <div className="flex">
            <span className="text-gray-600 w-40 flex-shrink-0">Môn học :</span>
            {isEditing ? (
              <Select
                value={editedQuiz.subject}
                onChange={(value) => handleFieldChange("subject", value)}
                className="flex-1"
              >
                {subjects.map((subject) => (
                  <Select.Option key={subject.id} value={subject.subject_name}>
                    {subject.subject_name}
                  </Select.Option>
                ))}
              </Select>
            ) : (
              <span className="text-gray-900">{quiz.subject}</span>
            )}
          </div>
          <div className="flex">
            <span className="text-gray-600 w-40 flex-shrink-0">
              Số câu hỏi :
            </span>
            {isEditing ? (
              <Input
                type="number"
                value={editedQuiz.questionCount}
                onChange={(e) =>
                  handleFieldChange(
                    "questionCount",
                    parseInt(e.target.value) || 0
                  )
                }
                className="flex-1"
              />
            ) : (
              <span className="text-gray-900">{quiz.questionCount}</span>
            )}
          </div>
          <div className="flex">
            <span className="text-gray-600 w-40 flex-shrink-0">
              Người tạo :
            </span>
            {isEditing ? (
              <Input
                value={editedQuiz.creator}
                onChange={(e) => handleFieldChange("creator", e.target.value)}
                className="flex-1"
              />
            ) : (
              <span className="text-gray- 900 font-medium">{quiz.creator}</span>
            )}
          </div>
          <div className="flex">
            <span className="text-gray-600 w-40 flex-shrink-0">
              Thời gian làm bài :
            </span>
            {isEditing ? (
              <TimePicker
                value={editedQuiz.duration ? dayjs(editedQuiz.duration, "HH:mm:ss") : undefined}
                format="HH:mm:ss"
                onChange={(value) => handleFieldChange("duration", value ? value.format("HH:mm:ss") : "")}
                className="flex-1"
              />
            ) : (
              <span className="text-gray-900">{quiz.duration}</span>
            )}
          </div>
          <div className="flex">
            <span className="text-gray-600 w-40 flex-shrink-0">Lớp :</span>
            {isEditing ? (
              <Select
                value={editedQuiz.grade}
                onChange={(value) => handleFieldChange("grade", value)}
                className="flex-1"
              >
                {grades.map((grade) => (
                  <Select.Option key={grade.id} value={grade.id}>
                    {grade.label}
                  </Select.Option>
                ))}
              </Select>
            ) : (
              <span className="text-gray-900">{quiz.grade}</span>
            )}
          </div>
        </div>

        <div className="w-full flex flex-row items-end justify-end">
          {isEditing ? (
            <>
              <div className="mt-4 flex flex-row gap-2">
                <Button
                  type="primary"
                  icon={<CheckOutlined />}
                  size="large"
                  className="mt-6 !bg-green-500 !hover:bg-green-600 !px-6 !py-3 mr-2"
                  onClick={handleSave}
                >
                  Lưu
                </Button>
                <Button
                  type="default"
                  icon={<CloseOutlined />}
                  size="large"
                  className="mt-6 !px-4"
                  onClick={handleCancel}
                >
                  Hủy
                </Button>
              </div>
            </>
          ) : (
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="large"
              className="mt-6 !bg-[#6392E9] !hover:bg-blue-600 !px-4"
              onClick={() => setIsEditing(true)}
            >
              Sửa
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default QuizInfor;
