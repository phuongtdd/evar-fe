import React from 'react';
import { Button, Progress, Card, Collapse, Tag } from 'antd';
import { TrophyOutlined, ReloadOutlined, HomeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ExamResultsProps, Question } from '../../types';
import { EXAM_STYLES } from '../../constants';

const ExamResults: React.FC<ExamResultsProps> = ({
  results,
  onRetake,
  onBackToDashboard,
  examState
}) => {
  const scorePercentage = results.submissionDetails
    ? Math.round(results.submissionDetails.totalScore * 10) // Convert to percentage if using API data
    : Math.round((results.correctAnswers / results.totalQuestions) * 100);

  const displayResults = results.submissionDetails || results;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Xuất sắc';
    if (score >= 60) return 'Khá';
    return 'Cần cải thiện';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  console.log(results)

  return (
    <div className="min-h-screen bg-[#f4f4f4] flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <div className="text-center">
          {/* Trophy Icon */}
          <div className="mb-6">
            <TrophyOutlined 
              className="text-[80px]" 
              style={{ color: getScoreColor(scorePercentage) }}
            />
          </div>

          {/* Title */}
          <h1 className="text-[32px] font-bold text-black mb-2">
            Kết quả bài thi
          </h1>
          
          {/* Score */}
          <div className="mb-8">
            <div className="text-[48px] font-bold mb-2" style={{ color: getScoreColor(scorePercentage) }}>
              {scorePercentage}%
            </div>
            <div className="text-[20px] text-gray-600 mb-4">
              {getScoreText(scorePercentage)}
            </div>
            
            <Progress
              percent={scorePercentage}
              strokeColor={getScoreColor(scorePercentage)}
              trailColor="#f0f0f0"
              strokeWidth={8}
              className="max-w-md mx-auto"
            />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-[#f8f9ff] rounded-[12px] p-4">
              <div className="text-[24px] font-bold text-[#6392e9]">
                {results.submissionDetails
                  ? `${Math.round(results.submissionDetails.totalScore * results.totalQuestions / 10)}/${results.totalQuestions}`
                  : `${results.correctAnswers}/${results.totalQuestions}`
                }
              </div>
              <div className="text-[16px] text-gray-600">Câu đúng</div>
            </div>

            <div className="bg-[#f8f9ff] rounded-[12px] p-4">
              <div className="text-[24px] font-bold text-[#6392e9]">
                {formatTime(results.timeSpent)}
              </div>
              <div className="text-[16px] text-gray-600">Thời gian làm bài</div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-[#f8f9ff] rounded-[12px] p-6 mb-8">
            <h3 className="text-[20px] font-semibold text-black mb-4">Chi tiết kết quả</h3>
            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng số câu hỏi:</span>
                <span className="font-semibold">{results.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Câu đã trả lời:</span>
                <span className="font-semibold">{results.answeredQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Câu trả lời đúng:</span>
                <span className="font-semibold text-green-600">
                  {results.submissionDetails
                    ? Math.round(results.submissionDetails.totalScore * results.totalQuestions / 10)
                    : results.correctAnswers
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Câu trả lời sai:</span>
                <span className="font-semibold text-red-600">
                  {results.submissionDetails
                    ? results.totalQuestions - Math.round(results.submissionDetails.totalScore * results.totalQuestions / 10)
                    : results.answeredQuestions - results.correctAnswers
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Question-by-Question Details */}
          {results.submissionDetails ? (
            <div className="bg-[#f8f9ff] rounded-[12px] p-6 mb-8">
              <h3 className="text-[20px] font-semibold text-black mb-4">Chi tiết từng câu hỏi</h3>
              <Collapse>
                {results.submissionDetails.questions.map((question, index) => (
                  <Collapse.Panel
                    key={index}
                    header={
                      <div className="flex items-center justify-between w-full">
                        <span>Câu hỏi {index + 1}: {question.questionContent.substring(0, 50)}...</span>
                        <div className="flex items-center gap-2">
                          {question.answers.some(answer => answer.correct && answer.select) ? (
                            <Tag className="!bg-green-50" color="success" icon={<CheckCircleOutlined />}>Đúng</Tag>
                          ) : (
                            <Tag className="!bg-red-50" color="error" icon={<CloseCircleOutlined />}>Sai</Tag>
                          )}
                        </div>
                      </div>
                    }
                  >
                    <div className="space-y-2">
                      {question.answers.map((answer, answerIndex) => (
                        <div
                          key={answerIndex}
                          className={`p-3 !rounded !border ${
                            answer.correct
                              ? '!bg-green-50 !border-green-200 !border-solid'
                              : answer.select && !answer.correct
                              ? '!bg-red-50 !border-red-200 !border-solid'
                              : answer.select
                              ? '!bg-blue-50 !border-blue-200 !border-solid'
                              : '!bg-gray-50 !border-gray-200 !border-solid'
                          }`}
                        >
                          <div className="!flex !items-center !justify-between">
                            <div className="!flex !items-center !gap-2">
                              <span className="!font-medium">
                                {String.fromCharCode(65 + answerIndex)}.
                              </span>
                              <span>{answer.answerContent}</span>
                              <div className="!flex !items-center !gap-2">
                                {answer.select && (
                                  <span className="!text-blue-600 !font-semibold">(Đã chọn)</span>
                                )}
                                {answer.correct && !answer.select && question.answers.some(a => a.select && !a.correct) && (
                                  <span className="!text-green-600 !font-semibold">(Đáp án đúng)</span>
                                )}
                              </div>
                            </div>
                            <div className="!flex !items-center !gap-2">
                              {answer.correct && (
                                <CheckCircleOutlined className="!text-green-600 !text-lg" />
                              )}
                              {answer.select && !answer.correct && (
                                <CloseCircleOutlined className="!text-red-600 !text-lg" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Collapse.Panel>
                ))}
              </Collapse>
            </div>
          ) : examState ? (
            // Fallback to local calculation when no submission details
            <div className="bg-[#f8f9ff] rounded-[12px] p-6 mb-8">
              <h3 className="text-[20px] font-semibold text-black mb-4">Chi tiết từng câu hỏi</h3>
              <Collapse>
                {examState.questions.map((question: Question, index: number) => {
                  const userAnswer = results.userAnswers[question.questionId];
                  const selectedIndices = Array.isArray(userAnswer) ? userAnswer : [userAnswer].filter(a => a !== undefined);
                  const correctIndices = question.answers
                    .map((answer: any, idx: number) => answer.isCorrect ? idx : -1)
                    .filter((idx: number) => idx !== -1);

                  const isCorrect = question.questionType === 'MULTIPLE_CHOICE'
                    ? selectedIndices.sort().join(',') === correctIndices.sort().join(',')
                    : selectedIndices.length === 1 && correctIndices.includes(selectedIndices[0]);

                  return (
                    <Collapse.Panel
                      key={index}
                      header={
                        <div className="flex items-center justify-between w-full">
                          <span>Câu hỏi {index + 1}: {question.content.substring(0, 50)}...</span>
                          <div className="flex items-center gap-2">
                            {isCorrect ? (
                              <Tag color="success" icon={<CheckCircleOutlined />}>Đúng</Tag>
                            ) : (
                              <Tag color="error" icon={<CloseCircleOutlined />}>Sai</Tag>
                            )}
                          </div>
                        </div>
                      }
                    >
                      <div className="space-y-2">
                        {question.answers.map((answer: any, answerIndex: number) => {
                          const isUserSelected = selectedIndices.includes(answerIndex);
                          // console.log("is User Selected: "+isUserSelected)
                          return (
                            <div
                              key={answerIndex}
                              className={`p-3 !rounded !border !important ${
                                answer.isCorrect
                                  ? '!bg-green-50 !border-green-200 !border-solid !important'
                                  : isUserSelected && !answer.isCorrect
                                  ? '!bg-red-50 !border-red-200 !border-solid !important'
                                  : isUserSelected
                                  ? '!bg-blue-50 !border-blue-200 !border-solid !important'
                                  : '!bg-gray-50 !border-gray-200 !border-solid !important'
                              }`}
                            >
                              <div className="!flex !items-center !justify-between">
                                <div className="!flex !items-center !gap-2">
                                  <span className="!font-medium">
                                    {String.fromCharCode(65 + answerIndex)}.
                                  </span>
                                  <span>{answer.content}</span>
                                  {isUserSelected && (
                                    <span className="!text-blue-600 !font-semibold">(Đã chọn)</span>
                                  )}
                                </div>
                                <div className="!flex !items-center !gap-2">
                                  {answer.isCorrect && (
                                    <CheckCircleOutlined className="!text-green-600 !text-lg" />
                                  )}
                                  {isUserSelected && !answer.isCorrect && (
                                    <CloseCircleOutlined className="!text-red-600 !text-lg" />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </Collapse.Panel>
                  );
                })}
              </Collapse>
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={onBackToDashboard}
              icon={<HomeOutlined />}
              className="!bg-gray-500 !hover:bg-gray-600 text-white rounded-[8px] h-[50px] px-8 text-[18px]"
            >
              Về trang chủ
            </Button>
            <Button
              onClick={onRetake}
              icon={<ReloadOutlined />}
              className="!bg-[#6392e9] !hover:bg-[#5282d8] text-white rounded-[8px] h-[50px] px-8 text-[18px] font-semibold"
            >
              Làm lại
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ExamResults;
