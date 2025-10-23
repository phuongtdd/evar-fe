"use client";

import { Card, Input, Button, Pagination, Segmented } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import QuizItem from "../ui/quiz-item";
import { fetchExams, ExamResponse } from "../../services/examService";

export default function ExploreSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [exams, setExams] = useState<ExamResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalExams, setTotalExams] = useState(0);
  const [sortBy, setSortBy] = useState<string | number>("latest");

  useEffect(() => {
    const loadExams = async () => {
      setLoading(true);
      try {
        const response = await fetchExams(currentPage - 1, 10);
        setExams(response.data);
        setTotalExams(
          response.pageMetadata?.totalElements || response.data.length * 10
        );
      } catch (error) {
        console.error("Failed to fetch exams for explore section:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [currentPage, sortBy]);

  return (
    <div>
      <h4 className="text-[18px] !font-extrabold mb-2">Khám phá thêm</h4>

      <div className="flex gap-3 mb-6">
        <Segmented
          value={sortBy}
          onChange={setSortBy}
          options={[
            { label: "Mới nhất", value: "latest" },
            { label: "Tương tác cao", value: "trending" },
          ]}
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

      <Card >
        {exams.map((exam) => (
          <QuizItem key={exam.id} exam={exam} />
        ))}
      </Card>

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
