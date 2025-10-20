"use client";

import { Card, Input, Button, Pagination } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import QuizItem from "../ui/quiz-item";
import { fetchExams, ExamResponse } from "../../services/examService";

export default function ExploreSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [exams, setExams] = useState<ExamResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalExams, setTotalExams] = useState(0);

  useEffect(() => {
    const loadExams = async () => {
      setLoading(true);
      try {
        const response = await fetchExams(currentPage - 1, 10); // API uses 0-based pagination
        setExams(response.data);
        // Assuming the API response includes total elements, otherwise we'd need to fetch all
        setTotalExams(response.pageMetadata?.totalElements || response.data.length * 10);
      } catch (error) {
        console.error('Failed to fetch exams for explore section:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [currentPage]);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Khám phá thêm
      </h2>

      <div className="flex gap-3 mb-6">
        <Input
          placeholder="Mô tả"
          className="flex-1"
          style={{ maxWidth: "150px" }}
        />
        <Input
          placeholder="Bảng hot"
          className="flex-1"
          style={{ maxWidth: "150px" }}
        />
        <Input
          placeholder="Tìm kiếm"
          prefix={<SearchOutlined />}
          className="flex-1"
          style={{ maxWidth: "150px" }}
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

      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          total={totalExams}
          pageSize={10}
          onChange={setCurrentPage}
          showSizeChanger={false}
        />
      </div>
    </div>
  );
}
