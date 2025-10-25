import { CameraOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Card, Image, Input, Radio, Select, message, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { Question } from "../../types";
import { QUESTION_TYPES } from "../../constants";
import { uploadImageToImgBB } from "../../../../utils/ImageUpload";

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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

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

    // Validation based on question type
    if (questionType === QUESTION_TYPES.SINGLE_CHOICE.value) {
      const hasValidAnswer = answers.some(answer => answer.content.trim());
      if (!hasValidAnswer) {
        message.warning("Vui lòng nhập ít nhất một đáp án!");
        return;
      }

      // For single choice, check if a correct answer is selected via radio button
      if (correctAnswerIndex < 0 || correctAnswerIndex > 3) {
        message.warning("Vui lòng chọn đáp án đúng!");
        return;
      }
    }

    if (questionType === QUESTION_TYPES.MULTIPLE_CHOICE.value) {
      const hasValidAnswer = answers.some(answer => answer.content.trim());
      if (!hasValidAnswer) {
        message.warning("Vui lòng nhập ít nhất một đáp án!");
        return;
      }

      // Check if at least one correct answer is selected via checkboxes
      const hasCorrectAnswer = answers.some(answer => answer.isCorrect);
      if (!hasCorrectAnswer) {
        message.warning("Vui lòng chọn ít nhất một đáp án đúng!");
        return;
      }
    }

    if (questionType === QUESTION_TYPES.TRUE_FALSE.value) {
      // For true/false, just need to select correct answer via radio button
      if (correctAnswerIndex !== 0 && correctAnswerIndex !== 1) {
        message.warning("Vui lòng chọn đáp án đúng!");
        return;
      }
    }

    if (questionType === QUESTION_TYPES.MATCH_ANSWER.value) {
      const hasValidAnswer = answers.some(answer => answer.content.trim());
      if (!hasValidAnswer) {
        message.warning("Vui lòng nhập ít nhất một cặp ghép!");
        return;
      }
    }

    // For subjective questions, no answers needed
    if (questionType === QUESTION_TYPES.SUBJECTIVE_ANSWER.value) {
      // No validation needed for answers
    }

    const newQuestion: Question = {
      id: Date.now(),
      number: questionNumber,
      content: questionContent,
      questionType: questionType,
      hardLevel: hardLevel,
      quesScore: quesScore,
      answers: questionType === QUESTION_TYPES.SUBJECTIVE_ANSWER.value
        ? [] // No answers for subjective questions
        : questionType === QUESTION_TYPES.TRUE_FALSE.value
        ? [
            { content: "Đúng", isCorrect: correctAnswerIndex === 0 },
            { content: "Sai", isCorrect: correctAnswerIndex === 1 }
          ]
        : answers.map((answer, index) => ({
            ...answer,
            isCorrect: questionType === QUESTION_TYPES.SINGLE_CHOICE.value
              ? index === correctAnswerIndex
              : answer.isCorrect // For multiple choice, use the checkbox state
          })),
      hasImage: !!uploadedImage,
      imageSrc: uploadedImage || undefined,
      questionImg: uploadedImage || undefined,
    };

    onAddQuestion(newQuestion);
    message.success("Thêm câu hỏi thành công!");

    setQuestionNumber(questionNumber + 1);
    setQuestionContent("");
    setQuestionType("1"); // Reset to default question type
    setAnswers([
      { content: "", isCorrect: false },
      { content: "", isCorrect: false },
      { content: "", isCorrect: false },
      { content: "", isCorrect: false },
    ]);
    setCorrectAnswerIndex(0);
    setUploadedImage(null);
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
            <span>Loại câu hỏi:</span>
            <Select value={questionType} onChange={setQuestionType} style={{ width: 200 }}>
              {Object.values(QUESTION_TYPES).map((type) => (
                <Select.Option key={type.value} value={type.value}>
                  {type.label}
                </Select.Option>
              ))}
            </Select>
          </div>
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

      {questionType === QUESTION_TYPES.SINGLE_CHOICE.value && (
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
      )}

      {questionType === QUESTION_TYPES.MULTIPLE_CHOICE.value && (
        <div className="mb-4">
          <span className="font-semibold">Chọn các đáp án đúng (có thể nhiều):</span>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {["A", "B", "C", "D"].map((letter, index) => (
              <div key={letter} className="flex items-center justify-center">
                <input
                  type="checkbox"
                  id={`answer-${index}`}
                  checked={answers[index].isCorrect}
                  onChange={(e) => {
                    const newAnswers = [...answers];
                    newAnswers[index] = { ...newAnswers[index], isCorrect: e.target.checked };
                    setAnswers(newAnswers);
                  }}
                  className="mr-2"
                />
                <label htmlFor={`answer-${index}`} className="font-semibold cursor-pointer">
                  {letter}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {questionType === QUESTION_TYPES.TRUE_FALSE.value && (
        <div className="mb-4">
          <span className="font-semibold">Chọn đáp án đúng:</span>
          <Radio.Group value={correctAnswerIndex} onChange={(e) => setCorrectAnswerIndex(e.target.value)}>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Radio value={0} className="text-center">Đúng</Radio>
              <Radio value={1} className="text-center">Sai</Radio>
            </div>
          </Radio.Group>
        </div>
      )}

      {questionType === QUESTION_TYPES.SUBJECTIVE_ANSWER.value && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="font-semibold text-blue-800">Câu hỏi tự luận:</span>
          <p className="text-blue-700 mt-1">Học sinh sẽ nhập câu trả lời mở. Không cần thiết lập đáp án đúng.</p>
        </div>
      )}

      {questionType === QUESTION_TYPES.MATCH_ANSWER.value && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <span className="font-semibold text-green-800">Câu hỏi ghép đôi:</span>
          <p className="text-green-700 mt-1">Nhập các cặp ghép trong phần đáp án (A-B, C-D, v.v.).</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          <div className="space-y-3">
            {(questionType === QUESTION_TYPES.SINGLE_CHOICE.value ||
              questionType === QUESTION_TYPES.MULTIPLE_CHOICE.value) && (
              <>
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
              </>
            )}

            {questionType === QUESTION_TYPES.TRUE_FALSE.value && (
              <>
                <div className="flex items-center gap-3">
                  <span className="w-8 shrink-0 font-semibold">A</span>
                  <Input
                    value="Đúng"
                    disabled
                    className="flex-1 bg-gray-100"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-8 shrink-0 font-semibold">B</span>
                  <Input
                    value="Sai"
                    disabled
                    className="flex-1 bg-gray-100"
                  />
                </div>
              </>
            )}

            {questionType === QUESTION_TYPES.SUBJECTIVE_ANSWER.value && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700">Không cần nhập đáp án mẫu cho câu hỏi tự luận.</p>
              </div>
            )}

            {questionType === QUESTION_TYPES.MATCH_ANSWER.value && (
              <>
                {["A", "B", "C", "D"].map((letter, index) => (
                  <div key={letter} className="flex items-center gap-3">
                    <span className="w-8 shrink-0 font-semibold">{letter}</span>
                    <Input
                      value={answers[index].content}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      placeholder={`Nhập cặp ghép ${letter} (ví dụ: "Từ A - Nghĩa A")...`}
                      className="flex-1"
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="col-span-1">
          <div className="border border-gray-200 rounded-lg p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span>Hình ảnh</span>
              <CameraOutlined className="!text-white !w-5 !h-5 !bg-sky-600" />
            </div>

            {uploadedImage ? (
              <div className="flex-1 flex flex-col items-center justify-center mb-3 min-h-[200px]">
                <Image
                  src={uploadedImage}
                  alt="Uploaded question image"
                  width={140}
                  height={140}
                  className="rounded mb-2"
                />
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => setUploadedImage(null)}
                >
                  Xóa ảnh
                </Button>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg mb-3 min-h-[200px] cursor-pointer hover:bg-gray-50 transition-colors">
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={async (file) => {
                    setUploading(true);
                    try {
                      const imageUrl = await uploadImageToImgBB(file);
                      setUploadedImage(imageUrl);
                      message.success("Tải ảnh lên thành công!");
                    } catch (error) {
                      message.error("Tải ảnh lên thất bại. Vui lòng thử lại.");
                      console.error("Upload error:", error);
                    } finally {
                      setUploading(false);
                    }
                    return false; // Prevent default upload behavior
                  }}
                >
                  <div className="text-center">
                    <CameraOutlined className="text-2xl text-gray-400 mb-2" />
                    <p className="text-gray-400 text-sm">
                      {uploading ? "Đang tải lên..." : "Nhấn để thêm ảnh"}
                    </p>
                  </div>
                </Upload>
              </div>
            )}

            {!uploadedImage && (
              <Button className="w-full" icon={<DeleteOutlined />} disabled>
                Xóa
              </Button>
            )}
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
