"use client";

import { Card, Input, Button } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import QuizItem from "../ui/quiz-item";
import { fetchExams, ExamResponse } from "../../services/examService";

export default function HistorySection() {
  const [exams, setExams] = useState<ExamResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadExams = async () => {
      setLoading(true);
      try {
        // For history section, we might want to show recent exams or completed ones
        // For now, showing the first page of exams
        const response = await fetchExams(0, 10);
        setExams(response.data);
      } catch (error) {
        console.error('Failed to fetch exams for history section:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, []);

  return (
    <>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Lịch sử làm bài
      </h2>

      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Tìm kiếm"
          prefix={<SearchOutlined />}
          className="flex-1"
          style={{ maxWidth: "200px" }}
        />
        <Button
          icon={<SearchOutlined />}
          className="bg-blue-500 text-white hover:bg-blue-600"
        />
        <Button icon={<FilterOutlined />} />
      </div>

      <div className="space-y-4">
        {exams.map((exam) => (
          <QuizItem key={exam.id} exam={exam} />
        ))}
      </div>
    </>
  );
}
