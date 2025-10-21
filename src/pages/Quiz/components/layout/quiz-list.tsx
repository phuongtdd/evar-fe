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
import type { GetProps } from "antd";

type SearchProps = GetProps<typeof Input.Search>;

const { Search } = Input;

const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
  console.log(info?.source, value);
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
        const response = await fetchExams(currentPage - 1, 10);
        setExams(response.data);
        setTotalExams(response.pageMetadata?.totalElements || 0);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, [currentPage]);

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[18px] !font-extrabold">Học từ exam đã tạo</h4>
      </div>
      <Row gutter={[44, 44]}>
        <Col xs={24} lg={16}>
          <div className="flex gap-3 mb-6 item-center justify-between">
            <div className="flex flex-row gap-3 ">
              <span className="text-[16px]">Tất cả</span>
              <Search
                placeholder="Tìm kiếm"
                onSearch={onSearch}
                enterButton
                style={{ maxWidth: "200px" }}
                className="flex-1"
              />
              <Button icon={<FilterOutlined />} />
            </div>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="bg-blue-500 hover:bg-blue-600"
              onClick={onCreateQuizClick}
            >
              Tạo Exam
            </Button>
          </div>
          <div className="space-y-4 bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            {exams.map((exam) => (
              <QuizItem key={exam.id} exam={exam} />
            ))}
          </div>

          <div className="flex justify-end  mt-6">
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
