import { CameraOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Image, Input, Radio, Select, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { Question } from "../../types";

interface InputQuestionCardProps {
  onAddQuestion: (question: Question) => void;
}

export default function InputQuestionCard({ onAddQuestion }: InputQuestionCardProps) {
  const [questionNumber, setQuestionNumber] = useState(1);
  const [questionContent, setQuestionContent] = useState("");
  const [questionType, setQuestionType] = useState("1");
  const [hardLevel, setHardLevel] = useState(1);
  const [quesScore, setQuesScore] = useState(1.0);
  const [answers, setAnswers] = useState([
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
  ]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = { ...newAnswers[index], content: value };
    setAnswers(newAnswers);
  };

  const handleAddQuestion = () => {
    if (!questionContent.trim()) {
      message.warning("Vui lòng nhập nội dung câu hỏi!");
      return;
    }

    const hasValidAnswer = answers.some(answer => answer.content.trim());
    if (!hasValidAnswer) {
      message.warning("Vui lòng nhập ít nhất một đáp án!");
      return;
    }

    const newQuestion: Question = {
      id: Date.now(),
      number: questionNumber,
      content: questionContent,
      questionType: questionType,
      hardLevel: hardLevel,
      quesScore: quesScore,
      answers: answers.map((answer, index) => ({
        ...answer,
        isCorrect: index === correctAnswerIndex
      })),
      hasImage: false,
    };

    onAddQuestion(newQuestion);
    message.success("Thêm câu hỏi thành công!");


    setQuestionNumber(questionNumber + 1);
    setQuestionContent("");
    setAnswers([
      { content: "", isCorrect: false },
      { content: "", isCorrect: false },
      { content: "", isCorrect: false },
      { content: "", isCorrect: false },
    ]);
    setCorrectAnswerIndex(0);
  };

  return (
    <Card className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex flex-row flex-shrink-0">Câu hỏi số :</span>
          <div className="w-[50px] h-[30px]">
            <Input
              value={questionNumber}
              onChange={(e) => setQuestionNumber(parseInt(e.target.value) || 1)}
              className="w-full text-center !bg-[#6B9BF0] !text-white !border-[#6B9BF0] !hover:bg-[#6B9BF0] !focus:bg-[#6B9BF0] !focus-visible:ring-[#6B9BF0]"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Độ khó:</span>
            <Select value={hardLevel} onChange={setHardLevel} style={{ width: 100 }}>
              <Select.Option value={1}>Dễ</Select.Option>
              <Select.Option value={2}>Trung bình</Select.Option>
              <Select.Option value={3}>Khó</Select.Option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span>Điểm:</span>
            <Input
              value={quesScore}
              onChange={(e) => setQuesScore(parseFloat(e.target.value) || 1.0)}
              style={{ width: 60 }}
              type="number"
              step="0.5"
            />
          </div>
        </div>
      </div>

      <TextArea
        value={questionContent}
        onChange={(e) => setQuestionContent(e.target.value)}
        placeholder="Nhập nội dung câu hỏi..."
        className="min-h-[120px] resize-y mb-4"
        rows={5}
      />

      <div className="mb-4">
        <span className="font-semibold">Chọn đáp án đúng:</span>
        <Radio.Group value={correctAnswerIndex} onChange={(e) => setCorrectAnswerIndex(e.target.value)}>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {["A", "B", "C", "D"].map((letter, index) => (
              <Radio key={letter} value={index} className="text-center">
                {letter}
              </Radio>
            ))}
          </div>
        </Radio.Group>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <div className="space-y-3">
            {["A", "B", "C", "D"].map((letter, index) => (
              <div key={letter} className="flex items-center gap-3">
                <span className="w-8 shrink-0 font-semibold">{letter}</span>
                <Input
                  value={answers[index].content}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder={`Nhập đáp án ${letter}...`}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1">
          <div className="border border-gray-200 rounded-lg p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span>Hình ảnh</span>
              <Image className="!text-white !w-5 !h-5 !bg-sky-600" />
            </div>

            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg mb-3 min-h-[200px] cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-gray-400">Nhấn để thêm ảnh</span>
            </div>

            <Button className="w-full" icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          className="!bg-[#6B9BF0] !hover:bg-[#5A8ADF] !px-8 text-white"
          onClick={handleAddQuestion}
          disabled={!questionContent.trim()}
        >
          Thêm câu hỏi
        </Button>
      </div>
    </Card>
  );
}
