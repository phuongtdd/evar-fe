import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ExamState, UseExamReturn, ExamResults, Question } from "../types";
import { examService } from "../services/examService";
import { EXAM_CONFIG, EXAM_CONSTANTS } from "../constants";
import { getUserIdFromToken } from "../../Room/utils/auth";

export const useExam = (examId?: string, initialExamData?: any): UseExamReturn => {
  const navigate = useNavigate();

  const [examState, setExamState] = useState<ExamState>({
    examData: null,
    questions: [],
    currentQuestionIndex: 0,
    timeLeft: EXAM_CONFIG.DEFAULT_TIME_LIMIT,
    isExamStarted: false,
    isExamCompleted: false,
    userAnswers: {} as { [questionId: string]: number },
    markedQuestions: new Set(),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('=== EXAM STATE CHANGED ===', {
      questions: examState.questions.map(q => ({ id: q.id, isMarked: q.isMarked })),
      markedQuestions: Array.from(examState.markedQuestions),
      currentQuestionIndex: examState.currentQuestionIndex
    });
  }, [examState.questions, examState.markedQuestions, examState.currentQuestionIndex]);

  const loadExam = useCallback(async () => {
    if (!examId) return;

    setIsLoading(true);
    setError(null);

    try {
      let examData;

      if (initialExamData) {
        examData = initialExamData;
      } else {
        const response = await examService.getExamById(examId);
        examData = response.data;
      }

      const questions: Question[] = examData.questions.map((q: any, index: number) => ({
        id: index + 1,
        questionId: q.id,
        content: q.content,
        questionType: q.questionType,
        hardLevel: q.hardLevel,
        subjectName: q.subjectName,
        answers: q.answers.map((answer: any, answerIndex: number) => ({
          id: answerIndex + 1,
          answerId: answer.id,
          content: answer.content,
          isCorrect: answer.isCorrect,
          isSelected: false,
        })),
        questionImg: q.questionImg,
        selectedAnswer: undefined,
        selectedAnswers: [],
        isMarked: false,
        isAnswered: false,
      }));

      setExamState((prev) => ({
        ...prev,
        examData,
        questions,
        timeLeft: EXAM_CONFIG.DEFAULT_TIME_LIMIT,
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi tải bài thi"
      );
    } finally {
      setIsLoading(false);
    }
  }, [examId, initialExamData]);

  const startExam = useCallback(() => {
    setExamState((prev) => ({
      ...prev,
      isExamStarted: true,
    }));
  }, []);

  const selectAnswer = useCallback(
    (questionId: number, answerIndex: number, isMultiple: boolean = false) => {
      setExamState((prev) => {
        const newQuestions = [...prev.questions];
        const questionIndex = newQuestions.findIndex(
          (q) => q.id === questionId
        );

        if (questionIndex !== -1) {
          if (isMultiple) {
            // Handle multiple choice
            const currentAnswers = newQuestions[questionIndex].selectedAnswers || [];
            const isAlreadySelected = currentAnswers.includes(answerIndex);

            if (isAlreadySelected) {
              // Remove the answer
              newQuestions[questionIndex].selectedAnswers = currentAnswers.filter(
                (idx) => idx !== answerIndex
              );
            } else {
              // Add the answer
              newQuestions[questionIndex].selectedAnswers = [...currentAnswers, answerIndex];
            }

            newQuestions[questionIndex].isAnswered = newQuestions[questionIndex].selectedAnswers!.length > 0;
          } else {
            // Handle single choice
            newQuestions[questionIndex].selectedAnswer = answerIndex;
            newQuestions[questionIndex].isAnswered = true;
          }
        }

        const newUserAnswers = {
          ...prev.userAnswers,
          [newQuestions[questionIndex].questionId]: isMultiple
            ? newQuestions[questionIndex].selectedAnswers!
            : answerIndex,
        };

        return {
          ...prev,
          questions: newQuestions,
          userAnswers: newUserAnswers,
        };
      });
    },
    []
  );

  const markQuestion = useCallback((questionId: number) => {
    console.log('=== MARK QUESTION CALLED ===', { questionId });

    setExamState(prev => {
      console.log('Previous state:', {
        questionId,
        prevIsMarked: prev.questions.find(q => q.id === questionId)?.isMarked,
        prevMarkedQuestions: Array.from(prev.markedQuestions)
      });

      const newQuestions = prev.questions.map(q => ({ ...q }));
      const questionIndex = newQuestions.findIndex(q => q.id === questionId);

      if (questionIndex !== -1) {
        const wasMarked = newQuestions[questionIndex].isMarked;
        newQuestions[questionIndex] = {
          ...newQuestions[questionIndex],
          isMarked: !wasMarked
        };

        console.log('Question updated:', {
          questionId,
          wasMarked,
          isNowMarked: !wasMarked,
          questionIndex
        });

        console.log(`Question ${questionId} ${wasMarked ? 'unmarked' : 'marked'}`, {
          questionId,
          wasMarked,
          isNowMarked: !wasMarked,
          timestamp: new Date().toLocaleTimeString()
        });
      }

      const newMarkedQuestions = new Set(prev.markedQuestions);
      const isNowMarked = questionIndex !== -1 ? newQuestions[questionIndex].isMarked : false;

      if (isNowMarked) {
        newMarkedQuestions.add(questionId);
        console.log(`Question ${questionId} added to marked questions set`);
      } else {
        newMarkedQuestions.delete(questionId);
        console.log(`Question ${questionId} removed from marked questions set`);
      }

      const newState = {
        ...prev,
        questions: newQuestions,
        markedQuestions: newMarkedQuestions
      };

      console.log('New state:', {
        questionId,
        newIsMarked: newState.questions.find(q => q.id === questionId)?.isMarked,
        newMarkedQuestions: Array.from(newState.markedQuestions)
      });

      return newState;
    });
  }, []);



  const goToQuestion = useCallback((questionIndex: number) => {
    setExamState((prev) => ({
      ...prev,
      currentQuestionIndex: questionIndex,
    }));
  }, []);

  const submitExam = useCallback(async () => {
    if (!examId) {
      throw new Error("Không tìm thấy ID bài thi");
    }

    try {
      const currentState = examState;

      console.log("------------ currentState", currentState)

      // Submit to backend API
      const submissionResponse = await examService.submitExamAnswers(examId, currentState.userAnswers, currentState.examData);

      // Use backend response for results
      const results: ExamResults = {
        totalQuestions: currentState.questions.length,
        answeredQuestions: Object.keys(currentState.userAnswers).length,
        correctAnswers: Math.round((submissionResponse.data.totalScore / 10) * currentState.questions.length), // Assuming max score is 10 per question
        score: Math.round(submissionResponse.data.totalScore * 10), // Convert to percentage
        timeSpent: EXAM_CONFIG.DEFAULT_TIME_LIMIT - currentState.timeLeft,
        userAnswers: currentState.userAnswers,
      };

      setExamState((prev) => ({
        ...prev,
        isExamCompleted: true,
      }));

      return results;
    } catch (err) {
      console.error('Submit exam error:', err);
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi nộp bài";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [examId, examState]);

  const resetExam = useCallback(() => {
    setExamState({
      examData: null,
      questions: [],
      currentQuestionIndex: 0,
      timeLeft: EXAM_CONFIG.DEFAULT_TIME_LIMIT,
      isExamStarted: false,
      isExamCompleted: false,
      userAnswers: {} as { [questionId: string]: number | number[] },
      markedQuestions: new Set(),
    });
    setError(null);
  }, []);

  useEffect(() => {
    if (!examState.isExamStarted || examState.isExamCompleted) return;

    const timer = setInterval(() => {
      setExamState((prev) => {
        if (prev.timeLeft <= 0) {
          clearInterval(timer);
          return {
            ...prev,
            isExamCompleted: true,
          };
        }
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1,
        };
      });
    }, EXAM_CONSTANTS.TIMER_INTERVAL);

    return () => clearInterval(timer);
  }, [examState.isExamStarted, examState.isExamCompleted]);

  useEffect(() => {
    if (!examState.isExamStarted || examState.isExamCompleted || !examId)
      return;

    const autoSave = setInterval(() => {
      examService.saveExamProgress(
        examId,
        examState.userAnswers,
        examState.currentQuestionIndex
      );
    }, EXAM_CONSTANTS.AUTO_SAVE_INTERVAL);

    return () => clearInterval(autoSave);
  }, [
    examState.isExamStarted,
    examState.isExamCompleted,
    examId,
    examState.userAnswers,
    examState.currentQuestionIndex,
  ]);

  useEffect(() => {
    loadExam();
  }, [loadExam]);

  return {
    examState,
    startExam,
    selectAnswer,
    markQuestion,
    goToQuestion,
    submitExam,
    resetExam,
    isLoading,
    error,
  };
};
