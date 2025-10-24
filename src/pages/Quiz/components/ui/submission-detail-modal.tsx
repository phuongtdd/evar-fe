"use client";

import { Modal, Card, Tag, Space, Typography, Divider, Image, Spin, message } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { fetchSubmissionDetails, SubmissionDetailResponse } from "../../services/submissionService";

const { Title, Text } = Typography;

interface SubmissionDetailModalProps {
  visible: boolean;
  submissionId: string | null;
  onClose: () => void;
}

export default function SubmissionDetailModal({ 
  visible, 
  submissionId, 
  onClose 
}: SubmissionDetailModalProps) {
  const [submission, setSubmission] = useState<SubmissionDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && submissionId) {
      loadSubmissionDetails();
    }
  }, [visible, submissionId]);

  const loadSubmissionDetails = async () => {
    if (!submissionId) return;
    
    setLoading(true);
    try {
      const data = await fetchSubmissionDetails(submissionId);
      setSubmission(data);
    } catch (error) {
      console.error("Failed to fetch submission details:", error);
      message.error("Không thể tải chi tiết bài làm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "green";
    if (score >= 6) return "orange";
    return "red";
  };

  const getScoreText = (score: number) => {
    return "Điểm của bạn";
  };

  return (
    <Modal
      title="Chi tiết bài làm"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ maxHeight: "80vh" }}
    >
      <Spin spinning={loading}>
        {submission && (
          <div className="space-y-4">
            {/* Thông tin tổng quan */}
            <Card>
              <div className="flex justify-between items-center">
                <div>
                  <Title level={4} className="mb-2">{submission.examName}</Title>
                  <Space direction="vertical" size="small">
                    <Text>Người làm: <strong>{submission.username}</strong></Text>
                    <Text>Lần thử: <Tag color="blue">Lần {submission.timeTry}</Tag></Text>
                    <Text>Ngày nộp: {
                      submission.submittedAt && submission.submittedAt !== null && submission.submittedAt !== '' 
                        ? new Date(submission.submittedAt).toLocaleString("vi-VN")
                        : 'Chưa có thông tin'
                    }</Text>
                  </Space>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">
                    <Tag color={getScoreColor(submission.totalScore)} >
                      {submission.totalScore.toFixed(1)}
                    </Tag>
                  </div>
                  <Text type="secondary">{getScoreText(submission.totalScore)}</Text>
                </div>
              </div>
            </Card>

            <Divider />

            {/* Chi tiết từng câu hỏi */}
            <div className="space-y-4">
              <Title level={5}>Chi tiết câu trả lời</Title>
              {submission.questions?.map((question, index) => (
                <Card key={index} size="small">
                  <div className="mb-3">
                    <Text strong>Câu {index + 1}:</Text>
                    <div className="mt-2 w-full flex flex-row justify-between">
                      <Text>
                        <strong>Nội dung : </strong>{question.questionContent}</Text>
                      {question.questionImg && (
                        <Image
                          src={question.questionImg}
                          alt={`Câu hỏi ${index + 1}`}
                          style={{ maxWidth: 200, maxHeight: 150 }}
                          className="mb-2"
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {question.answers.map((answer, answerIndex) => (
                      <div 
                        key={answerIndex}
                        className={`p-2 rounded border ${
                          answer.select 
                            ? (answer.correct ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300')
                            : (answer.correct ? 'bg-yellow-50 border-yellow-300' : 'bg-gray-50')
                        }`}
                      >
                        <Space>
                          {answer.select ? (
                            answer.correct ? (
                              <CheckCircleOutlined className="text-green-500" />
                            ) : (
                              <CloseCircleOutlined className="text-red-500" />
                            )
                          ) : answer.correct ? (
                            <CheckCircleOutlined className="text-yellow-500" />
                          ) : null}
                          <Text 
                            className={
                              answer.select 
                                ? (answer.correct ? 'text-green-700' : 'text-red-700')
                                : (answer.correct ? 'text-yellow-700' : 'text-gray-700')
                            }
                          >
                            {answer.answerContent}
                          </Text>
                          {answer.correct && (
                            <Tag color="green">Đáp án đúng</Tag>
                          )}
                          {answer.select && (
                            <Tag color={answer.correct ? "green" : "red"} >
                              {answer.correct ? "Đúng" : "Sai"}
                            </Tag>
                          )}
                        </Space>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Spin>
    </Modal>
  );
}
