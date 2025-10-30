"use client";

import { useState } from "react";
import {
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { Button as AntButton, Tag, Modal, message } from "antd";
import { useQuizContext } from "../../context/QuizContext";
import QuestionCard from "../ui/QuestionCard";
import EditQuestionModal from "../ui/EditQuestionModal";
import { useNavigate } from "react-router-dom";
import { Question } from "../../types";

export default function QuizCreated() {
  const { fileUploaded, results, setResults } = useQuizContext();
  const navigate = useNavigate();
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Handle edit question
  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsEditModalVisible(true);
  };

  // Handle save edited question
  const handleSaveEdit = (updatedQuestion: Question) => {
    const updatedResults = results.map(q => 
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setResults(updatedResults);
    setIsEditModalVisible(false);
    setEditingQuestion(null);
    message.success('Đã lưu thay đổi');
  };

  // Handle delete question
  const handleDelete = (questionId: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa câu hỏi này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        const updatedResults = results.filter(q => q.id !== questionId);
        // Re-number questions
        const renumberedResults = updatedResults.map((q, index) => ({
          ...q,
          number: index + 1,
        }));
        setResults(renumberedResults);
        message.success('Đã xóa câu hỏi');
      },
    });
  };

  // Handle toggle correct answer
  const handleToggleCorrect = (questionId: number, answerIndex: number) => {
    const updatedResults = results.map(q => {
      if (q.id === questionId) {
        const updatedAnswers = q.answers.map((a, idx) => ({
          ...a,
          isCorrect: idx === answerIndex ? !a.isCorrect : a.isCorrect,
        }));
        return { ...q, answers: updatedAnswers };
      }
      return q;
    });
    setResults(updatedResults);
  };

  // Handle image upload
  const handleImageUpload = (questionId: number, imageUrl: string) => {
    const updatedResults = results.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          questionImg: imageUrl,
          imageSrc: imageUrl,
          hasImage: true,
        };
      }
      return q;
    });
    setResults(updatedResults);
    message.success('Đã thêm ảnh cho câu hỏi');
  };

  // Handle image deletion
  const handleImageDelete = (questionId: number) => {
    Modal.confirm({
      title: 'Xác nhận xóa ảnh',
      content: 'Bạn có chắc chắn muốn xóa ảnh này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        const updatedResults = results.map(q => {
          if (q.id === questionId) {
            return {
              ...q,
              questionImg: undefined,
              imageSrc: undefined,
              hasImage: false,
            };
          }
          return q;
        });
        setResults(updatedResults);
        message.success('Đã xóa ảnh');
      },
    });
  };

  // Handle delete all
  const handleDeleteAll = () => {
    Modal.confirm({
      title: 'Xác nhận xóa tất cả',
      content: 'Bạn có chắc chắn muốn xóa tất cả câu hỏi?',
      okText: 'Xóa tất cả',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => {
        setResults([]);
        message.success('Đã xóa tất cả câu hỏi');
      },
    });
  };

  // Handle move question up
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newResults = [...results];
    [newResults[index - 1], newResults[index]] = [newResults[index], newResults[index - 1]];
    // Re-number questions
    const renumberedResults = newResults.map((q, idx) => ({
      ...q,
      number: idx + 1,
    }));
    setResults(renumberedResults);
  };

  // Handle move question down
  const handleMoveDown = (index: number) => {
    if (index === results.length - 1) return;
    const newResults = [...results];
    [newResults[index], newResults[index + 1]] = [newResults[index + 1], newResults[index]];
    // Re-number questions
    const renumberedResults = newResults.map((q, idx) => ({
      ...q,
      number: idx + 1,
    }));
    setResults(renumberedResults);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Kết quả</h2>
        {fileUploaded && (
          <AntButton 
            danger 
            size="large" 
            className="font-medium"
            onClick={handleDeleteAll}
            disabled={results.length === 0}
          >
            Xóa hết
          </AntButton>
        )}
      </div>
      {!fileUploaded ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FileTextOutlined className="text-6xl text-gray-300 mb-4" />
          <p className="text-gray-400 text-center">
            Chưa có kết quả. Vui lòng tải lên file để bắt đầu.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FileTextOutlined className="text-6xl text-gray-300 mb-4" />
          <p className="text-gray-400 text-center">
            Không có câu hỏi nào. Vui lòng tải lên file để tạo câu hỏi.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {results.map((question, index) => (
            <QuestionCard 
              key={question.id} 
              question={question} 
              onEdit={() => handleEdit(question)}
              onDelete={() => handleDelete(question.id!)}
              onToggleCorrect={handleToggleCorrect}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              onImageUpload={handleImageUpload}
              onImageDelete={handleImageDelete}
              isFirst={index === 0}
              isLast={index === results.length - 1}
            />
          ))}
        </div>
      )}

      {/* Edit Question Modal */}
      <EditQuestionModal
        visible={isEditModalVisible}
        question={editingQuestion}
        onSave={handleSaveEdit}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingQuestion(null);
        }}
      />
    </div>
  );
}

