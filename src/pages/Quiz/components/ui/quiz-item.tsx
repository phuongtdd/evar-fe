import { Button, Divider, Tag } from "antd";
import { ArrowRightOutlined, EditFilled, EyeOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { exam } from "../../types";
import { examService } from "../../../takeQuiz-Exam/services/examService";
import Calendar from "../../../../assets/icons/Calendar_fill.png";
interface QuizItemProps {
  exam: exam;
  asTableAction?: boolean;
}

export default function QuizItem({ exam, asTableAction }: QuizItemProps) {
  const navigate = useNavigate();

  const handleNavigate = async () => {
    try {
      const examResponse = await examService.getExamById(exam.id!);
      const examData = examResponse.data;

      navigate(`takeQuiz/exam/${exam.id}`, {
        state: { examData },
      });
    } catch (error) {
      console.error("Error fetching exam data:", error);
      navigate(`takeQuiz/exam/${exam.id}`);
    }
  };

  if (asTableAction) {
    return (
      <div className="flex items-center gap-2">
        <Button
          type="primary"
          danger
          size="small"
          icon={<ArrowRightOutlined />}
          className="!bg-green-500 !hover:bg-green-600 !border-green-500"
          onClick={handleNavigate}
        >
          Làm
        </Button>
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-row items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <span className="font-bold text-gray-900 text-[24px]">{exam.examName}</span>
            <Button className="!bg-[#6392E9]/33 !text-[#6392E9] !px-5 !py-1 !rounded-[12px]" icon={<EditFilled/>}></Button>
          </div>

          <div className="flex flex-row item-center w-full gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold">Môn:</span>
              <Tag className="!font-semibold !text-[#ffffff] !bg-blue-400 !py-1 !px-5 text-[16px] !rounded-[12px] !border-[#6392E9] ">
                {exam.subjectName}
              </Tag>
            </div>

            <div className="flex items-center gap-2 text-[14px]">
              <span className="font-bold">Số câu hỏi:</span>
              <span className="font-semibold text-[#6392E9] ">
                {exam.numOfQuestions}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold">Loại:</span>
              <span className="font-semibold text-[#6392E9] text-[14px]">
                {exam.examType === 1 ? "Thi" : "Luyện tập"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[14px]">
              <ClockCircleOutlined className="text-[#6392E9]" />
              <span className="font-bold">Thời gian:</span>
              <span className="font-semibold text-[#6392E9]">
                {exam.duration ? `${exam.duration} phút` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img src={Calendar} alt="" />
            <span className="text-[14px] text-[#6392E9] font-bold ">
              {new Date(exam.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>

          <Button
            type="primary"
            danger
            className="!bg-[#4CAF50] !hover:bg-green-600 !border-green-500 !font-bold"
            onClick={handleNavigate}
          >
            Làm
            <ArrowRightOutlined />
          </Button>
        </div>
      </div>
      <Divider/>
    </div>
  );
}
