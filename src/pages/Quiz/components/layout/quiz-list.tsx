"use client";

import { Card, Button, Input, Pagination, Row, Col } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import QuizItem from "../ui/quiz-item";
import QuizStats from "../ui/quiz-stats";
import { fetchExams, ExamResponse } from "../../services/examService";
import { exam } from "../../types";

interface QuizListProps {
  onCreateQuizClick: () => void;
}

export default function QuizList({ onCreateQuizClick }: QuizListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [exams, setExams] = useState<exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalExams, setTotalExams] = useState(0);

  useEffect(() => {
    const loadExams = async () => {
      setLoading(true);
      try {
        const response = await fetchExams(currentPage - 1, 10); // API uses 0-based pagination
        setExams(response.data);
        setTotalExams(response.pageMetadata?.totalElements || 0);
      } catch (error) {
        console.error('Failed to fetch exams:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [currentPage]);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Học từ exam đã tạo
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-blue-500 hover:bg-blue-600"
          onClick={onCreateQuizClick}
        >
          Tạo Exam
        </Button>
      </div>

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

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
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
        </Col>

        <Col xs={24} lg={8}>
          <QuizStats />
        </Col>
      </Row>
    </>
  );
}
