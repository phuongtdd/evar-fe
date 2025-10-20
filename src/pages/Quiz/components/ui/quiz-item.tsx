import { Tag, Button } from "antd"
import { ArrowRightOutlined, EyeOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { exam } from "../../types"
import { examService } from "../../../takeQuiz-Exam/services/examService"

export default function QuizItem({ exam }: { exam: exam }) {
  const navigate = useNavigate();

  const handleNavigate = async () => {
    try {
      const examResponse = await examService.getExamById(exam.id!);
      const examData = examResponse.data;

      navigate(`takeQuiz/exam/${exam.id}`, {
        state: { examData }
      });
    } catch (error) {
      console.error('Error fetching exam data:', error);
      navigate(`takeQuiz/exam/${exam.id}`);
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex-1">{exam.examName}</h3>
        <Tag color="blue" className="ml-2">
          <EyeOutlined /> Chỉnh sửa
        </Tag>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Môn:</span>
          <Tag color="blue">{exam.subjectName}</Tag>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Số câu hỏi:</span>
          <span className="font-semibold text-gray-900">{exam.numOfQuestions}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Loại:</span>
          <span className="font-semibold text-gray-900">{exam.examType === 1 ? 'Thi' : 'Luyện tập'}</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-600">{new Date(exam.createdAt).toLocaleDateString('vi-VN')}</span>
          <Button
            type="primary"
            danger
            icon={<ArrowRightOutlined />}
            className="!bg-green-500 !hover:bg-green-600 !border-green-500"
            onClick={() => handleNavigate()}
          >
            Làm
          </Button>
        </div>
      </div>
    </div>
  )
}
