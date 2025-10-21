"use client";

import { Table, Input, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FilterOutlined } from "@ant-design/icons";
import { useState, useMemo, useEffect } from "react";
import { fetchExams, ExamResponse } from "../../services/examService";
import QuizItem from "../ui/quiz-item";
import type { GetProps } from "antd";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

const onSearch: SearchProps["onSearch"] = (value, _e, info) =>
  console.log(info?.source, value);

export default function HistorySection() {
  const [exams, setExams] = useState<ExamResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadExams = async () => {
      setLoading(true);
      try {
        const response = await fetchExams(0, 10);
        setExams(response.data);
      } catch (error) {
        console.error("Failed to fetch exams for history section:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, []);

  const columns: ColumnsType<ExamResponse> = useMemo(
    () => [
      {
        title: "Tên bài thi",
        dataIndex: "examName",
        key: "examName",
        render: (value) => <span className="font-semibold text-gray-900">{value}</span>,
      },
      {
        title: "Môn",
        dataIndex: "subjectName",
        key: "subjectName",
      },
      {
        title: "Số câu hỏi",
        dataIndex: "numOfQuestions",
        key: "numOfQuestions",
        align: "center",
      },
      {
        title: "Loại",
        dataIndex: "examType",
        key: "examType",
        render: (value: number) => (value === 1 ? "Thi" : "Luyện tập"),
      },
      {
        title: "Ngày tạo",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (value: string) =>
          new Date(value).toLocaleDateString("vi-VN"),
      },
      {
        title: "Thao tác",
        key: "actions",
        render: (_, exam) => <QuizItem exam={exam} asTableAction />,
      },
    ],
    []
  );

  return (
    <>
      <h4 className="text-[18px] !font-extrabold mb-2">Lịch sử làm bài</h4>

      <div className="flex gap-3 mb-1">
        <Search
          placeholder="Tìm kiếm"
          onSearch={onSearch}
          enterButton
          style={{ maxWidth: "200px" }}
          className="flex-1"
        />
        <Button icon={<FilterOutlined />} />
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={exams}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
}